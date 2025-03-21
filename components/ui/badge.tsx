// components/ui/badge.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-secondary text-text hover:bg-secondary-hover",
        secondary:
          "border-transparent bg-background-secondary text-text hover:bg-secondary-hover",
        destructive:
          "border-transparent bg-red-500 text-white hover:bg-red-500/80",
        outline: "text-text border border-border",
        success: "border-transparent bg-accent/20 text-accent border border-accent/50",
        warning: "border-transparent bg-yellow-500/20 text-yellow-400 border border-yellow-500/50",
        primary: "border-transparent bg-primary/20 text-primary border border-primary/50",
        purple: "border-transparent bg-purple-500/20 text-purple-400 border border-purple-500/50",
        info: "border-transparent bg-sky-500/20 text-sky-400 border border-sky-500/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }