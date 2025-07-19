import React from 'react';

// Responsive design utility component to fix common layout issues
export const ResponsiveContainer = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`container mx-auto px-4 lg:px-6 xl:px-8 ${className}`}>
    {children}
  </div>
);

export const ResponsiveGrid = ({ 
  children, 
  cols = "1 md:2 lg:3", 
  className = "" 
}: { 
  children: React.ReactNode, 
  cols?: string,
  className?: string 
}) => (
  <div className={`grid grid-cols-${cols} gap-4 md:gap-6 ${className}`}>
    {children}
  </div>
);

export const ResponsiveText = ({ 
  children, 
  size = "base",
  className = ""
}: { 
  children: React.ReactNode, 
  size?: "sm" | "base" | "lg" | "xl" | "2xl",
  className?: string 
}) => {
  const sizeClasses = {
    sm: "text-sm md:text-base",
    base: "text-base md:text-lg",
    lg: "text-lg md:text-xl",
    xl: "text-xl md:text-2xl",
    "2xl": "text-2xl md:text-3xl lg:text-4xl"
  };
  
  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
};

export const MobileOnlyWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="block md:hidden">
    {children}
  </div>
);

export const DesktopOnlyWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="hidden md:block">
    {children}
  </div>
);

export const ResponsiveStack = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-stretch md:items-center">
    {children}
  </div>
);