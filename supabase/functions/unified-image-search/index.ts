import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ImageResult {
  id: string;
  url: string;
  thumbnail: string;
  alt: string;
  source: string;
  width?: number;
  height?: number;
  localUrl?: string; // Local Supabase storage URL
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, category = 'general', limit = 20, downloadImages = true } = await req.json();
    
    console.log(`🔍 Unified image search for: "${query}" (category: ${category})`);

    // First, check if we have cached images for this query
    const cachedImages = await getCachedImages(query, category, limit);
    if (cachedImages.length >= Math.min(limit, 10)) {
      console.log(`✅ Found ${cachedImages.length} cached images`);
      return new Response(JSON.stringify({
        images: cachedImages.slice(0, limit),
        source: 'cache',
        total: cachedImages.length
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Define API fallback order
    const apiOrder = ['unsplash', 'pexels', 'pixabay', 'serpapi'];
    let allImages: ImageResult[] = [...cachedImages];
    let totalNeeded = limit - cachedImages.length;

    for (const apiName of apiOrder) {
      if (totalNeeded <= 0) break;

      try {
        console.log(`🔄 Trying ${apiName} API for ${totalNeeded} more images`);
        const newImages = await fetchFromAPI(apiName, query, category, totalNeeded);
        
        if (newImages.length > 0) {
          console.log(`✅ ${apiName} returned ${newImages.length} images`);
          
          // Download and store images if requested
          if (downloadImages) {
            console.log(`📥 Downloading images to storage...`);
            const downloadedImages = await downloadAndStoreImages(newImages, query, category);
            allImages.push(...downloadedImages);
          } else {
            allImages.push(...newImages);
          }
          
          // Cache the new images (with local URLs if downloaded)
          await cacheImages(query, category, downloadImages ? allImages.slice(-newImages.length) : newImages);
          
          totalNeeded -= newImages.length;
        } else {
          console.log(`⚠️ ${apiName} returned no images`);
        }
      } catch (error) {
        console.error(`❌ ${apiName} API failed:`, error.message);
        continue; // Try next API
      }
    }

    if (allImages.length === 0) {
      // Return placeholder images as last resort
      const placeholders = getPlaceholderImages(query, limit);
      return new Response(JSON.stringify({
        images: placeholders,
        source: 'placeholder',
        total: placeholders.length,
        message: 'Using placeholder images - all APIs failed'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      images: allImages.slice(0, limit),
      source: 'mixed',
      total: allImages.length,
      cached: cachedImages.length,
      fresh: allImages.length - cachedImages.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Unified image search error:', error);
    
    // Return placeholder images on error
    const { query = '', limit = 20 } = await req.json().catch(() => ({}));
    const placeholders = getPlaceholderImages(query, limit);
    
    return new Response(JSON.stringify({
      images: placeholders,
      source: 'placeholder',
      total: placeholders.length,
      error: 'All image sources failed, using placeholders'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getCachedImages(query: string, category: string, limit: number): Promise<ImageResult[]> {
  try {
    const { data, error } = await supabase
      .from('cached_images')
      .select('*')
      .ilike('search_query', `%${query}%`)
      .eq('category', category)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching cached images:', error);
      return [];
    }

    return data?.map(item => ({
      id: item.image_id,
      url: item.image_url,
      thumbnail: item.thumbnail_url,
      alt: item.alt_text,
      source: `cached-${item.original_source}`,
      width: item.width,
      height: item.height
    })) || [];
  } catch (error) {
    console.error('Error in getCachedImages:', error);
    return [];
  }
}

async function cacheImages(query: string, category: string, images: ImageResult[]): Promise<void> {
  try {
    const cacheData = images.map(img => ({
      search_query: query,
      category: category,
      image_id: img.id,
      image_url: img.url,
      thumbnail_url: img.thumbnail,
      alt_text: img.alt,
      original_source: img.source,
      width: img.width,
      height: img.height,
      created_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('cached_images')
      .upsert(cacheData, { onConflict: 'image_id' });

    if (error) {
      console.error('Error caching images:', error);
    } else {
      console.log(`💾 Cached ${images.length} images for query: ${query}`);
    }
  } catch (error) {
    console.error('Error in cacheImages:', error);
  }
}

async function fetchFromAPI(apiName: string, query: string, category: string, limit: number): Promise<ImageResult[]> {
  const apiKey = getApiKey(apiName);
  if (!apiKey) {
    throw new Error(`No API key found for ${apiName}`);
  }

  switch (apiName) {
    case 'unsplash':
      return await fetchUnsplash(query, limit, apiKey);
    case 'pexels':
      return await fetchPexels(query, limit, apiKey);
    case 'pixabay':
      return await fetchPixabay(query, category, limit, apiKey);
    case 'serpapi':
      return await fetchSerpApi(query, limit, apiKey);
    default:
      throw new Error(`Unknown API: ${apiName}`);
  }
}

function getApiKey(apiName: string): string | null {
  const keyMap = {
    'unsplash': 'UNSPLASH_ACCESS_KEY',
    'pexels': 'PEXELS_API_KEY',
    'pixabay': 'PIXABAY_API_KEY',
    'serpapi': 'SERPAPI_API_KEY'
  };
  return Deno.env.get(keyMap[apiName as keyof typeof keyMap] || '') || null;
}

async function fetchUnsplash(query: string, limit: number, apiKey: string): Promise<ImageResult[]> {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${limit}&orientation=landscape`,
    {
      headers: { 'Authorization': `Client-ID ${apiKey}` }
    }
  );

  if (!response.ok) {
    throw new Error(`Unsplash API error: ${response.status}`);
  }

  const data = await response.json();
  return data.results?.map((photo: any) => ({
    id: `unsplash-${photo.id}`,
    url: photo.urls.regular,
    thumbnail: photo.urls.thumb,
    alt: photo.alt_description || photo.description || query,
    source: 'unsplash',
    width: photo.width,
    height: photo.height
  })) || [];
}

async function fetchPexels(query: string, limit: number, apiKey: string): Promise<ImageResult[]> {
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${limit}&orientation=landscape`,
    {
      headers: { 'Authorization': apiKey }
    }
  );

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Pexels rate limit exceeded');
    }
    throw new Error(`Pexels API error: ${response.status}`);
  }

  const data = await response.json();
  return data.photos?.map((photo: any) => ({
    id: `pexels-${photo.id}`,
    url: photo.src.large,
    thumbnail: photo.src.medium,
    alt: photo.alt || query,
    source: 'pexels',
    width: photo.width,
    height: photo.height
  })) || [];
}

async function fetchPixabay(query: string, category: string, limit: number, apiKey: string): Promise<ImageResult[]> {
  const categoryMap: { [key: string]: string } = {
    'travel': 'places',
    'food': 'food',
    'nature': 'nature',
    'business': 'business',
    'technology': 'computer'
  };

  const pixabayCategory = categoryMap[category] || 'all';
  
  const response = await fetch(
    `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&category=${pixabayCategory}&per_page=${limit}&image_type=photo&orientation=horizontal&min_width=640`
  );

  if (!response.ok) {
    throw new Error(`Pixabay API error: ${response.status}`);
  }

  const data = await response.json();
  return data.hits?.map((hit: any) => ({
    id: `pixabay-${hit.id}`,
    url: hit.webformatURL,
    thumbnail: hit.previewURL,
    alt: hit.tags || query,
    source: 'pixabay',
    width: hit.imageWidth,
    height: hit.imageHeight
  })) || [];
}

async function fetchSerpApi(query: string, limit: number, apiKey: string): Promise<ImageResult[]> {
  const response = await fetch(
    `https://serpapi.com/search?q=${encodeURIComponent(query)}&tbm=isch&api_key=${apiKey}&num=${limit}`
  );

  if (!response.ok) {
    throw new Error(`SerpAPI error: ${response.status}`);
  }

  const data = await response.json();
  return data.images_results?.slice(0, limit).map((img: any, index: number) => ({
    id: `serpapi-${query}-${index}`,
    url: img.original,
    thumbnail: img.thumbnail,
    alt: img.title || query,
    source: 'serpapi',
    width: img.original_width,
    height: img.original_height
  })) || [];
}

function getPlaceholderImages(query: string, limit: number): ImageResult[] {
  const placeholders = [
    {
      id: 'placeholder-1',
      url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800',
      thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300',
      alt: `${query} - Professional workspace`,
      source: 'placeholder',
      width: 800,
      height: 600
    },
    {
      id: 'placeholder-2',
      url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800',
      thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300',
      alt: `${query} - Technology workspace`,
      source: 'placeholder',
      width: 800,
      height: 600
    },
    {
      id: 'placeholder-3',
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300',
      alt: `${query} - Modern technology`,
      source: 'placeholder',
      width: 800,
      height: 600
    }
  ];

  return placeholders.slice(0, limit);
}

// Download and store images in Supabase Storage
async function downloadAndStoreImages(images: ImageResult[], query: string, category: string): Promise<ImageResult[]> {
  const processedImages: ImageResult[] = [];
  
  for (const image of images) {
    try {
      // Download the original image
      const originalResponse = await fetch(image.url);
      if (!originalResponse.ok) {
        console.error(`Failed to download image ${image.id}: ${originalResponse.status}`);
        // Use original URL as fallback
        processedImages.push(image);
        continue;
      }

      const imageBuffer = await originalResponse.arrayBuffer();
      const imageBlob = new Uint8Array(imageBuffer);
      
      // Generate file paths
      const fileExtension = getFileExtension(image.url) || 'jpg';
      const sanitizedQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const fileName = `${sanitizedQuery}/${image.source}/${image.id}.${fileExtension}`;
      const thumbnailName = `${sanitizedQuery}/${image.source}/${image.id}-thumb.${fileExtension}`;

      // Upload original image
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('downloaded-images')
        .upload(fileName, imageBlob, {
          contentType: `image/${fileExtension}`,
          upsert: true
        });

      if (uploadError) {
        console.error(`Failed to upload image ${image.id}:`, uploadError);
        processedImages.push(image);
        continue;
      }

      // Get public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('downloaded-images')
        .getPublicUrl(fileName);

      // Download and upload thumbnail if different
      let thumbnailUrl = urlData.publicUrl;
      if (image.thumbnail && image.thumbnail !== image.url) {
        try {
          const thumbResponse = await fetch(image.thumbnail);
          if (thumbResponse.ok) {
            const thumbBuffer = await thumbResponse.arrayBuffer();
            const thumbBlob = new Uint8Array(thumbBuffer);
            
            const { error: thumbError } = await supabase.storage
              .from('downloaded-images')
              .upload(thumbnailName, thumbBlob, {
                contentType: `image/${fileExtension}`,
                upsert: true
              });

            if (!thumbError) {
              const { data: thumbUrlData } = supabase.storage
                .from('downloaded-images')
                .getPublicUrl(thumbnailName);
              thumbnailUrl = thumbUrlData.publicUrl;
            }
          }
        } catch (thumbError) {
          console.error(`Failed to download thumbnail for ${image.id}:`, thumbError);
        }
      }

      // Add processed image with local URLs
      processedImages.push({
        ...image,
        url: urlData.publicUrl,
        thumbnail: thumbnailUrl,
        localUrl: urlData.publicUrl
      });

      console.log(`✅ Downloaded and stored image: ${image.id}`);
      
    } catch (error) {
      console.error(`Error processing image ${image.id}:`, error);
      // Use original image as fallback
      processedImages.push(image);
    }
  }

  return processedImages;
}

function getFileExtension(url: string): string | null {
  try {
    const pathname = new URL(url).pathname;
    const extension = pathname.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension || '') ? extension : 'jpg';
  } catch {
    return 'jpg';
  }
}

// Bulk download function for existing images
async function bulkDownloadExistingImages(): Promise<void> {
  console.log('🔄 Starting bulk download of existing cached images...');
  
  try {
    // Get all cached images that don't have local URLs
    const { data: cachedImages, error } = await supabase
      .from('cached_images')
      .select('*')
      .is('local_url', null)
      .limit(100); // Process in batches

    if (error) {
      console.error('Error fetching cached images for bulk download:', error);
      return;
    }

    if (!cachedImages || cachedImages.length === 0) {
      console.log('✅ No images need downloading');
      return;
    }

    console.log(`📥 Found ${cachedImages.length} images to download`);

    for (const cachedImage of cachedImages) {
      try {
        const imageResult: ImageResult = {
          id: cachedImage.image_id,
          url: cachedImage.image_url,
          thumbnail: cachedImage.thumbnail_url,
          alt: cachedImage.alt_text,
          source: cachedImage.original_source,
          width: cachedImage.width,
          height: cachedImage.height
        };

        const downloadedImages = await downloadAndStoreImages([imageResult], cachedImage.search_query, cachedImage.category);
        
        if (downloadedImages.length > 0 && downloadedImages[0].localUrl) {
          // Update the cached image with local URL
          await supabase
            .from('cached_images')
            .update({ 
              local_url: downloadedImages[0].localUrl,
              local_thumbnail_url: downloadedImages[0].thumbnail 
            })
            .eq('id', cachedImage.id);
          
          console.log(`✅ Updated cached image ${cachedImage.image_id} with local URL`);
        }
      } catch (error) {
        console.error(`Error downloading cached image ${cachedImage.image_id}:`, error);
      }
    }

    console.log('✅ Bulk download completed');
  } catch (error) {
    console.error('Error in bulk download:', error);
  }
}
