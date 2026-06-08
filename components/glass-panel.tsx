import { cn } from "@/lib/utils"

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
  padding?: string
}

export function GlassPanel({ children, hover = true, padding = "p-6", className, ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-xl",
        padding,
        hover && "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
