import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { clsx } from "clsx"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const baseStyles = "font-pixel inline-flex items-center justify-center transition-all pixel-shadow active:translate-x-1 active:translate-y-1 active:shadow-none disabled:pointer-events-none disabled:opacity-50"
    
    const variants = {
      default: "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90",
      secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/90",
      destructive: "bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]/90",
      outline: "border-2 border-[var(--border)] bg-transparent hover:bg-[var(--accent)]/20",
      ghost: "hover:bg-[var(--accent)]/20"
    }
    
    const sizes = {
      default: "px-4 py-3",
      sm: "px-3 py-2 text-xs",
      lg: "px-6 py-4"
    }
    
    return (
      <Comp
        className={clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
