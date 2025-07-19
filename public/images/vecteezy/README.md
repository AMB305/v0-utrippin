# Vecteezy Images - Local Storage

This directory contains locally hosted travel images to replace external API calls and prevent broken image issues.

## Structure

All images are stored locally in `/public/images/vecteezy/` and mapped in the `VecteezyImage` component.

## Available Images

### Virtual Tour Destinations
- `times-square-nyc.jpg` - Times Square, New York
- `grand-canyon-arizona.jpg` - Grand Canyon, Arizona  
- `golden-gate-bridge-san-francisco.jpg` - Golden Gate Bridge, San Francisco
- `caribbean-beach-paradise.jpg` - Caribbean Beach Paradise

### Travel Categories
- `romantic-santorini-greece.jpg` - Romantic Santorini
- `wellness-spa-tulum.jpg` - Wellness & Spa Tulum
- `arts-culture-kyoto.jpg` - Arts & Culture Kyoto
- `food-drink-rome.jpg` - Food & Drink Rome
- `festivals-events-new-orleans.jpg` - Festivals & Events New Orleans
- `nightlife-city-berlin.jpg` - Nightlife & City Berlin
- `luxury-shopping-milan.jpg` - Luxury Shopping Milan
- `inspired-getaways-bali.jpg` - Inspired Getaways Bali
- `relax-retreat-costa-rica.jpg` - Relax & Retreat Costa Rica

### Default Fallbacks
- `travel-placeholder.jpg` - Main fallback image
- `destination-default.jpg` - Default destination image
- `travel-default.jpg` - Default travel image
- `landmark-default.jpg` - Default landmark image

## Adding New Images

1. Download high-quality travel images (preferably from Vecteezy with proper licensing)
2. Save them in this directory with descriptive filenames
3. Add the mapping to `localImageMapping` in `src/components/VecteezyImage.tsx`
4. Use kebab-case naming convention (e.g., `destination-name.jpg`)

## Benefits

✅ **Faster load times** - No external API calls
✅ **Full control** - Images always available
✅ **No broken images** - Prevents API quota issues
✅ **Consistent design** - Curated image selection
✅ **Better SEO** - Faster page loads
✅ **Offline support** - Works without internet

## Image Optimization

All images should be:
- **Format**: JPG for photos, PNG for graphics
- **Size**: 800x600px recommended
- **Quality**: High quality but web-optimized
- **Alt text**: Descriptive and SEO-friendly

## Migration from API

This system replaces the external Vecteezy API calls that were causing 402 Payment Required errors. The `VecteezyImage` component now:

1. Maps destinations to local images
2. Falls back to Supabase storage if needed  
3. Uses default placeholder for unknown destinations
4. No longer makes external API calls

## Future Additions

When adding new destinations or categories:
1. Download appropriate images
2. Update the mapping in `VecteezyImage.tsx`
3. Test the fallback behavior
4. Document new images in this README