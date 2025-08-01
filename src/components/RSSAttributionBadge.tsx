import { Badge } from "@/components/ui/badge"
import { Rss, ExternalLink, Edit3 } from 'lucide-react'

interface RSSAttributionBadgeProps {
  source?: string | null
  rssSource?: boolean
  attribution?: string | null
}

export function RSSAttributionBadge({ source, rssSource, attribution }: RSSAttributionBadgeProps) {
  if (source === "Utrippin Editorial") {
    return (
      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
        <Edit3 className="h-3 w-3 mr-1" />
        Original Content
      </Badge>
    )
  }

  if (rssSource) {
    return (
      <div className="flex items-center space-x-2">
        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
          <Rss className="h-3 w-3 mr-1" />
          RSS Feed
        </Badge>
        <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">
          <ExternalLink className="h-3 w-3 mr-1" />
          Fair Use
        </Badge>
      </div>
    )
  }

  return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Community Content</Badge>
}