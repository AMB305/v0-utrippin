import React from "react";
import { cn } from "../../lib/utils";

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <input
    type="checkbox"
    ref={ref}
    className={cn(
      "h-4 w-4 rounded border-gray-300 text-[#0068EF] focus:ring-[#0068EF] focus:ring-2",
      className
    )}
    {...props}
  />
));
Checkbox.displayName = "Checkbox";

export { Checkbox };