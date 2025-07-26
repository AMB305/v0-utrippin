
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "btn-lovable text-white hover:scale-105 hover:-translate-y-0.5 active:scale-95 active:translate-y-0",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft",
        outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white hover:-translate-y-0.5 shadow-soft",
        secondary: "bg-gradient-to-r from-lovable-mint to-lovable-sage text-white hover:from-lovable-sage hover:to-lovable-mint hover:scale-105 hover:-translate-y-0.5 shadow-soft",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-all duration-200",
        link: "text-primary underline-offset-4 hover:underline hover:text-lovable-coral transition-colors",
        hero: "btn-lovable text-lg px-8 py-4 text-white font-bold hover:scale-110 hover:-translate-y-1 shadow-glow animate-pulse-glow",
        warm: "bg-gradient-to-r from-lovable-coral to-lovable-peach text-white hover:from-lovable-peach hover:to-lovable-coral hover:scale-105 hover:-translate-y-0.5 shadow-medium",
        cool: "bg-gradient-to-r from-lovable-lavender to-travel-blue text-white hover:from-travel-blue hover:to-lovable-lavender hover:scale-105 hover:-translate-y-0.5 shadow-medium",
        glass: "glass-card text-lovable-warm-gray hover:bg-white/40 hover:scale-105 hover:-translate-y-0.5 backdrop-blur-xl border border-white/20",
        "travel-glass": "bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/30 hover:border-white/40 transition-all duration-300",
        "travel-outline": "border-2 border-white/60 text-white bg-transparent hover:bg-white/10 hover:border-white/80 transition-all duration-300",
        "travel-gold": "bg-gradient-to-r from-travel-gold to-yellow-500 text-white hover:from-yellow-500 hover:to-travel-gold hover:scale-105 hover:-translate-y-0.5 shadow-medium"
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // If using asChild, ensure we have a single child
    if (asChild && React.Children.count(children) > 1) {
      console.warn('Button with asChild prop should have only one child element')
      // Wrap multiple children in a single element
      const wrappedChildren = <span>{children}</span>
      return (
        <Comp
          className={cn(buttonVariants({ variant, size }), className)}
          ref={ref}
          {...props}
        >
          {wrappedChildren}
        </Comp>
      )
    }
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        <>
          {variant === "default" && !asChild && (
            <span className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
          )}
          {children}
        </>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
