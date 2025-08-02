import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

interface RelevanceScoreBadgeProps {
  score?: number
}

export function RelevanceScoreBadge({ score }: RelevanceScoreBadgeProps) {
  if (!score || score < 70) return null

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    if (score >= 80) return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    return "bg-amber-500/20 text-amber-400 border-amber-500/30"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Highly Relevant"
    if (score >= 80) return "Very Relevant"
    return "Relevant"
  }

  return (
    <Badge className={getScoreColor(score)}>
      <TrendingUp className="h-3 w-3 mr-1" />
      {getScoreLabel(score)}
    </Badge>
  )
}
