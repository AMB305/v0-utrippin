"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  inView?: boolean;
  direction?: "up" | "down" | "left" | "right";
}

export function BlurFade({
  children,
  className,
  duration = 0.4,
  delay = 0,
  inView = false,
  direction = "down",
  ...props
}: BlurFadeProps) {
  const [isVisible, setIsVisible] = useState(!inView);

  useEffect(() => {
    if (!inView) {
      setIsVisible(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [inView, delay]);

  const getAnimationClass = () => {
    switch (direction) {
      case "up":
        return "animate-fade-in-up";
      case "down":
        return "animate-fade-in-up";
      case "left":
        return "animate-slide-in-left";
      case "right":
        return "animate-slide-in-left";
      default:
        return "animate-fade-in-up";
    }
  };

  return (
    <div
      className={cn(
        className,
        isVisible ? getAnimationClass() : "opacity-0"
      )}
      style={{ 
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
      {...props}
    >
      {children}
    </div>
  );
}
