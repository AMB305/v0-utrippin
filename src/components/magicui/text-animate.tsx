"use client";

import { cn } from "@/lib/utils";
import { ElementType, memo, useEffect, useState } from "react";

type AnimationType = "text" | "word" | "character" | "line";
type AnimationVariant =
  | "fadeIn"
  | "blurIn"
  | "blurInUp"
  | "blurInDown"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scaleUp"
  | "scaleDown";

interface TextAnimateProps {
  /**
   * The text content to animate
   */
  children: string;
  /**
   * The class name to be applied to the component
   */
  className?: string;
  /**
   * The class name to be applied to each segment
   */
  segmentClassName?: string;
  /**
   * The delay before the animation starts
   */
  delay?: number;
  /**
   * The duration of the animation
   */
  duration?: number;
  /**
   * The element type to render
   */
  as?: ElementType;
  /**
   * How to split the text ("text", "word", "character")
   */
  by?: AnimationType;
  /**
   * Whether to start animation when component enters viewport
   */
  startOnView?: boolean;
  /**
   * Whether to animate only once
   */
  once?: boolean;
  /**
   * The animation preset to use
   */
  animation?: AnimationVariant;
}

const getAnimationClass = (animation: AnimationVariant): string => {
  switch (animation) {
    case "fadeIn":
      return "animate-fade-in-up";
    case "blurIn":
      return "animate-fade-in-up";
    case "blurInUp":
      return "animate-fade-in-up";
    case "blurInDown":
      return "animate-slide-in-left";
    case "slideUp":
      return "animate-slide-in-left";
    case "slideDown":
      return "animate-slide-in-left";
    case "slideLeft":
      return "animate-slide-in-left";
    case "slideRight":
      return "animate-slide-in-left";
    case "scaleUp":
      return "animate-scale-in";
    case "scaleDown":
      return "animate-scale-in";
    default:
      return "animate-fade-in-up";
  }
};

const TextAnimateBase = ({
  children,
  delay = 0,
  duration = 0.3,
  className,
  segmentClassName,
  as: Component = "p",
  startOnView = true,
  once = false,
  by = "word",
  animation = "fadeIn",
  ...props
}: TextAnimateProps) => {
  const [isVisible, setIsVisible] = useState(!startOnView);

  useEffect(() => {
    if (!startOnView) {
      setIsVisible(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [startOnView, delay]);

  let segments: string[] = [];
  switch (by) {
    case "word":
      segments = children.split(/(\s+)/);
      break;
    case "character":
      segments = children.split("");
      break;
    case "line":
      segments = children.split("\n");
      break;
    case "text":
    default:
      segments = [children];
      break;
  }

  const animationClass = getAnimationClass(animation);

  if (by === "text") {
    return (
      <Component
        className={cn("whitespace-pre-wrap", className, isVisible ? animationClass : "opacity-0")}
        style={{ animationDelay: `${delay}s` }}
        {...props}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      className={cn("whitespace-pre-wrap", className)}
      {...props}
    >
      {segments.map((segment, i) => (
        <span
          key={`${by}-${segment}-${i}`}
          className={cn(
            by === "line" ? "block" : "inline-block whitespace-pre",
            by === "character" && "",
            segmentClassName,
            isVisible ? animationClass : "opacity-0"
          )}
          style={{ 
            animationDelay: `${delay + (i * (duration / segments.length))}s` 
          }}
        >
          {segment}
        </span>
      ))}
    </Component>
  );
};

// Export the memoized version
export const TextAnimate = memo(TextAnimateBase);
