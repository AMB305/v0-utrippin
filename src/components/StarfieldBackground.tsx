import React from 'react';

const StarfieldBackground: React.FC = () => {
  // Generate random stars with different sizes and positions
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    animationType: Math.random() > 0.6 ? 'twinkle' : Math.random() > 0.3 ? 'float' : 'sparkle'
  }));

  const getAnimationClass = (type: string) => {
    switch (type) {
      case 'twinkle': return 'animate-star-twinkle';
      case 'float': return 'animate-star-float';
      case 'sparkle': return 'animate-star-sparkle';
      default: return 'animate-star-float';
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black"></div>
      
      {/* Animated stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full bg-purple-200/40 ${getAnimationClass(star.animationType)}`}
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
      
      {/* Floating sparkle elements */}
      <div className="absolute top-1/4 left-1/4 text-purple-300/30 text-2xl animate-star-sparkle">✨</div>
      <div className="absolute top-1/3 right-1/4 text-pink-300/30 text-xl animate-star-twinkle" style={{ animationDelay: '2s' }}>⭐</div>
      <div className="absolute bottom-1/3 left-1/3 text-orange-300/30 text-lg animate-star-float" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute top-1/2 right-1/3 text-purple-300/30 text-sm animate-star-sparkle" style={{ animationDelay: '3s' }}>⭐</div>
      <div className="absolute bottom-1/4 right-1/5 text-pink-300/30 text-xl animate-star-twinkle" style={{ animationDelay: '1.5s' }}>✨</div>
    </div>
  );
};

export default StarfieldBackground;