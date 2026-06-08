import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BlockchainCardProps {
  name: string
  description: string
  docsUrl: string
  icon: string
  status: "Live" | "Coming Soon"
  networks?: string[]
}

export function BlockchainCard({ name, description, docsUrl, icon, status, networks = [] }: BlockchainCardProps) {
  return (
    <div className="p-6 border border-border rounded-lg bg-card hover:border-blue-500/50 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{icon}</div>
          <div>
            <h3 className="font-bold text-lg text-foreground">{name}</h3>
            <p className={`text-xs font-semibold ${status === "Live" ? "text-green-500" : "text-yellow-500"}`}>
              {status}
            </p>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {networks.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Networks:</p>
          <div className="flex flex-wrap gap-2">
            {networks.map((net) => (
              <span key={net} className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded">
                {net}
              </span>
            ))}
          </div>
        </div>
      )}
      <a href={docsUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
          View Docs
          <ExternalLink className="h-3 w-3" />
        </Button>
      </a>
    </div>
  )
}
