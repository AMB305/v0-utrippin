import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle } from 'lucide-react'

interface StoryVerificationBadgeProps {
  verified?: boolean
  source?: string | null
}

export function StoryVerificationBadge({ verified, source }: StoryVerificationBadgeProps) {
  if (!verified) return null

  return (
    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
      <Shield className="h-3 w-3 mr-1" />
      Verified Source
    </Badge>
  )
}
