import React from "react";
import { cn } from "../../lib/utils";

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200">
      <div className="absolute h-full bg-[#0068EF]" />
    </div>
  </div>
));
Slider.displayName = "Slider";

export { Slider };