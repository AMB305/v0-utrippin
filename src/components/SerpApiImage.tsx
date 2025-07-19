// DEPRECATED: Use VecteezyImage component instead
// This component is being phased out in favor of Vecteezy-only images

import { VecteezyImage } from './VecteezyImage';

interface SerpApiImageProps {
  destination: string;
  description?: string;
  tags?: string[];
  fallbackImage?: string;
  className?: string;
  alt?: string;
  onClick?: () => void;
  provider?: 'undercover-tourist' | 'expedia' | 'general';
}

// Convert SerpApiImage props to VecteezyImage props
const SerpApiImage: React.FC<SerpApiImageProps> = (props) => {
  return <VecteezyImage {...props} />;
};

export default SerpApiImage;