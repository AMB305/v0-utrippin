import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Star, 
  MapPin, 
  Clock, 
  DollarSign, 
  Languages, 
  CheckCircle,
  MessageCircle,
  Calendar,
  Shield
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LocalExpert {
  id: string;
  user_email: string;
  destination_name: string;
  expertise_areas: string[];
  description: string;
  hourly_rate?: number;
  languages: string[];
  verified: boolean;
  rating: number;
  total_reviews: number;
  availability?: any;
}

export function LocalExpertNetwork() {
  const [experts, setExperts] = useState<LocalExpert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchExperts();
  }, [selectedDestination]);

  const fetchExperts = async () => {
    try {
      let query = supabase
        .from('local_experts')
        .select(`
          *,
          destinations(name),
          users(email)
        `)
        .eq('verified', true);

      if (selectedDestination) {
        query = query.eq('destination_id', selectedDestination);
      }

      const { data, error } = await query
        .order('rating', { ascending: false })
        .limit(12);

      if (error) throw error;

      if (data) {
        // Get user and destination details
        const expertsWithDetails = await Promise.all(
          data.map(async (expert) => {
            // Get user details
            const { data: userData } = await supabase
              .from('users')
              .select('email')
              .eq('id', expert.user_id)
              .single();

            // Get destination details
            const { data: destinationData } = await supabase
              .from('destinations')
              .select('name')
              .eq('id', expert.destination_id)
              .single();

            return {
              ...expert,
              user_email: userData?.email || 'Unknown',
              destination_name: destinationData?.name || 'Unknown'
            };
          })
        );

        setExperts(expertsWithDetails);
      }
    } catch (error) {
      console.error('Error fetching experts:', error);
      toast.error('Failed to load local experts');
    } finally {
      setLoading(false);
    }
  };

  const handleContactExpert = async (expertId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please sign in to contact experts');
      return;
    }

    // This would typically create a conversation or booking request
    toast.success('Contact request sent! Expert will respond soon.');
  };

  const filteredExperts = experts.filter(expert =>
    expert.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.destination_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.expertise_areas.some(area => 
      area.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded mb-4 w-3/4"></div>
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Local Expert Network</h2>
          <p className="text-muted-foreground">Connect with verified local guides and experts</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <Input
            placeholder="Search experts or destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64"
          />
          <Button variant="outline" onClick={() => toast.info('Become an expert feature coming soon!')}>
            Become an Expert
          </Button>
        </div>
      </div>

      {/* Expertise Categories */}
      <div className="flex gap-2 flex-wrap">
        {[
          'All Destinations',
          'Food & Dining',
          'Adventure Sports',
          'Cultural Tours',
          'Photography',
          'Local Markets',
          'Hidden Gems',
          'Transportation'
        ].map((category) => (
          <Badge
            key={category}
            variant="outline"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => {
              if (category === 'All Destinations') {
                setSelectedDestination("");
              } else {
                setSearchTerm(category);
              }
            }}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Experts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExperts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No experts found</h3>
            <p className="text-muted-foreground">Try adjusting your search or check back later</p>
          </div>
        ) : (
          filteredExperts.map((expert) => (
            <Card key={expert.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${expert.user_email}`} />
                    <AvatarFallback>{expert.user_email.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">
                        {expert.user_email.split('@')[0]}
                      </h3>
                      {expert.verified && (
                        <Shield className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{expert.destination_name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{expert.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({expert.total_reviews} reviews)
                      </span>
                    </div>
                  </div>
                  
                  {expert.hourly_rate && (
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-lg font-bold">
                        <DollarSign className="h-4 w-4" />
                        {expert.hourly_rate}
                      </div>
                      <p className="text-xs text-muted-foreground">per hour</p>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Expertise Areas */}
                <div>
                  <p className="text-sm font-medium mb-2">Specializes in:</p>
                  <div className="flex flex-wrap gap-1">
                    {expert.expertise_areas.slice(0, 3).map((area) => (
                      <Badge key={area} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                    {expert.expertise_areas.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{expert.expertise_areas.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {expert.description}
                </p>

                {/* Languages */}
                {expert.languages && expert.languages.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {expert.languages.slice(0, 2).join(', ')}
                      {expert.languages.length > 2 && ` +${expert.languages.length - 2} more`}
                    </span>
                  </div>
                )}

                {/* Availability */}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 font-medium">Available today</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleContactExpert(expert.id)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast.info('Booking feature coming soon!')}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredExperts.length > 0 && filteredExperts.length % 12 === 0 && (
        <div className="text-center">
          <Button variant="outline" onClick={() => toast.info('Load more feature coming soon!')}>
            Load More Experts
          </Button>
        </div>
      )}
    </div>
  );
}
