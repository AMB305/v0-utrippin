import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface FollowUpSuggestionsProps {
  lastQuery?: string;
  onSelect: (query: string) => void;
}

const FollowUpSuggestions = ({ lastQuery, onSelect }: FollowUpSuggestionsProps) => {
  // Generate context-aware suggestions based on last query
  const generateSuggestions = () => {
    if (!lastQuery) {
      return ["Trips under $1000", "Solo adventures", "Family vacations", "Weekend getaways"];
    }

    const query = lastQuery.toLowerCase();
    
    if (query.includes("europe") || query.includes("european")) {
      return ["Budget trips to Europe", "European capitals tour", "European countryside", "Mediterranean cruise"];
    }
    
    if (query.includes("asia") || query.includes("asian")) {
      return ["Southeast Asia backpacking", "Japan cultural tour", "Thai island hopping", "India spiritual journey"];
    }
    
    if (query.includes("beach") || query.includes("island")) {
      return ["Caribbean islands", "Pacific coast road trip", "Mediterranean beaches", "Tropical paradises"];
    }
    
    if (query.includes("adventure") || query.includes("hiking") || query.includes("outdoor")) {
      return ["Mountain adventures", "National park tours", "Safari expeditions", "Extreme sports trips"];
    }
    
    if (query.includes("budget") || query.includes("cheap") || query.includes("affordable")) {
      return ["Backpacking trips", "Hostels and budget stays", "Free attractions tours", "Local food experiences"];
    }
    
    if (query.includes("luxury") || query.includes("premium") || query.includes("upscale")) {
      return ["5-star resort getaways", "Private villa rentals", "Michelin dining tours", "Luxury cruise options"];
    }
    
    if (query.includes("family") || query.includes("kids") || query.includes("children")) {
      return ["Theme park adventures", "All-inclusive resorts", "Educational tours", "Kid-friendly destinations"];
    }
    
    if (query.includes("solo") || query.includes("alone") || query.includes("single")) {
      return ["Solo female travel", "Digital nomad spots", "Wellness retreats", "Cultural immersion trips"];
    }
    
    if (query.includes("weekend") || query.includes("short") || query.includes("quick")) {
      return ["City breaks", "Weekend spa retreats", "Nearby attractions", "3-day getaways"];
    }
    
    // Default suggestions for general queries
    return ["Explore trending destinations", "Seasonal travel deals", "Cultural experiences", "Adventure activities"];
  };

  const suggestions = generateSuggestions();

  return (
    <div className="mt-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-ai-travel-button" />
        <h3 className="text-white/80 text-sm font-medium">Explore more ideas</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, idx) => (
          <Button
            key={idx}
            variant="ghost"
            size="sm"
            onClick={() => onSelect(suggestion)}
            className="h-auto px-3 py-2 bg-ai-travel-card border border-white/20 text-white hover:bg-white/10 hover:border-ai-travel-button/50 text-xs rounded-lg transition-colors"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FollowUpSuggestions;
