import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProLockProps {
  className?: string
  size?: "sm" | "md" | "lg"
  tooltip?: string
}

const sizeMap = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
}

export function ProLock({ className, size = "md", tooltip = "Pro feature" }: ProLockProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full",
        "bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-500 dark:to-cyan-500",
        className,
      )}
      title={tooltip}
    >
      <Lock className={cn(sizeMap[size], "text-white")} strokeWidth={2.5} />
    </div>
  )
}

export function ProBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block px-2 py-1 rounded-full text-xs font-semibold",
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
        className,
      )}
    >
      Pro
    </span>
  )
}

export function ProTag({ tier = "pro" }: { tier?: "pro" | "pro+" }) {
  return (
    <span
      className={cn(
        "inline-block px-2.5 py-1 rounded-md text-xs font-medium",
        tier === "pro+"
          ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 dark:from-purple-900/40 dark:to-pink-900/40 dark:text-purple-200"
          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
      )}
    >
      {tier === "pro+" ? "Pro+" : "Pro"}
    </span>
  )
}
