import React from "react";
import { cn } from "../../lib/utils";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-gray-900 text-white",
    secondary: "bg-gray-100 text-gray-900",
    destructive: "bg-red-500 text-white",
    outline: "border border-gray-200 bg-white text-gray-900",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };