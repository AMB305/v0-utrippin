import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download, Eye, User, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PixabayImageData {
  id: number;
  url: string;
  largeUrl: string;
  tags: string;
  photographer: string;
  views: number;
  downloads: number;
}

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: string;
  description?: string;
  tags?: string[];
}

export const ImageModal = ({ isOpen, onClose, destination, description, tags }: ImageModalProps) => {
  const [images, setImages] = useState<PixabayImageData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && destination) {
      fetchImages();
    }
  }, [isOpen, destination, description, tags]);

  const fetchImages = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`🖼️ Fetching image gallery for: ${destination}`);

      const { data, error: supabaseError } = await supabase.functions.invoke('pixabay-images', {
        body: {
          destination,
          description,
          tags,
          category: 'places'
        }
      });

      if (supabaseError) {
        throw supabaseError;
      }

      if (data?.images && data.images.length > 0) {
        setImages(data.images);
        setCurrentIndex(0);
        console.log(`✅ Got ${data.images.length} images for ${destination}`);
      } else {
        setError('No images found for this destination');
      }
    } catch (error) {
      console.error(`❌ Failed to fetch images for ${destination}:`, error);
      setError('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold">
            {destination} Gallery
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-muted-foreground">{error}</div>
              <Button 
                variant="outline" 
                onClick={fetchImages}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {!isLoading && !error && images.length > 0 && currentImage && (
          <div className="relative">
            <div className="relative">
              <img
                src={currentImage.largeUrl}
                alt={`${destination} - ${currentImage.tags}`}
                className="w-full h-96 object-cover"
              />
              
              {images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">{currentImage.photographer}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {currentImage.views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        {currentImage.downloads.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {currentImage.tags.split(', ').slice(0, 5).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {images.length > 1 && (
                <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-1 text-sm">
                  {currentIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentIndex 
                        ? 'border-primary' 
                        : 'border-transparent hover:border-muted-foreground'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};