import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader, Plane } from "lucide-react";
import { duffelClient, DuffelSeatMapResponse, DuffelSeat } from "@/lib/duffel";
import { toast } from "sonner";

type SeatMap = {
  cabinClass: string;
  seats: DuffelSeat[];
}

interface SeatSelectionProps {
  offerId?: string;
  passengerCount: number;
  onSeatsSelected: (seats: DuffelSeat[], totalPrice: number) => void;
  seatMaps?: SeatMap[] | null;
}

export function SeatSelection({ offerId, passengerCount, onSeatsSelected, seatMaps: externalSeatMaps }: SeatSelectionProps) {
  const [loading, setLoading] = useState(!!offerId);
  const [seatMaps, setSeatMaps] = useState<DuffelSeatMapResponse | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<DuffelSeat[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (offerId && !externalSeatMaps) {
      fetchSeatMaps();
    } else if (externalSeatMaps) {
      setLoading(false);
    }
  }, [offerId, externalSeatMaps]);

  const fetchSeatMaps = async () => {
    if (!offerId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await duffelClient.getSeatMaps(offerId);
      setSeatMaps(response);
    } catch (err) {
      console.error('Error fetching seat maps:', err);
      setError('Unable to load seat map');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seat: DuffelSeat) => {
    if (!seat.available) return;

    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (isSelected) {
      // Remove seat
      const newSelection = selectedSeats.filter(s => s.id !== seat.id);
      setSelectedSeats(newSelection);
      updateParent(newSelection);
    } else {
      // Add seat (if under limit)
      if (selectedSeats.length < passengerCount) {
        const newSelection = [...selectedSeats, seat];
        setSelectedSeats(newSelection);
        updateParent(newSelection);
      } else {
        toast.error(`You can only select up to ${passengerCount} seat${passengerCount > 1 ? 's' : ''}`);
      }
    }
  };

  const updateParent = (seats: DuffelSeat[]) => {
    const totalPrice = seats.reduce((sum, seat) => {
      return sum + parseFloat(seat.price?.amount || '0');
    }, 0);
    onSeatsSelected(seats, totalPrice);
  };

  const getSeatDisplayClass = (seat: DuffelSeat) => {
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    const baseClasses = "w-8 h-8 text-xs rounded cursor-pointer border transition-colors";
    
    if (!seat.available) {
      return `${baseClasses} bg-muted text-muted-foreground cursor-not-allowed`;
    }
    
    if (isSelected) {
      return `${baseClasses} bg-primary text-primary-foreground border-primary`;
    }
    
    return `${baseClasses} bg-background border-border hover:bg-accent hover:text-accent-foreground`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Seat Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading available seats...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle external seat maps or no seat maps available
  if (error || (!seatMaps?.data?.seat_maps?.length && !externalSeatMaps?.length)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Seat Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <div className="text-6xl">🎟️</div>
            <div className="space-y-2">
              <p className="font-medium">Seat selection is included in your fare</p>
              <p className="text-muted-foreground">You'll be able to pick your seat directly with the airline after booking.</p>
              <p className="text-sm text-muted-foreground">Most airlines allow seat selection in their manage booking section or at check-in.</p>
            </div>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => onSeatsSelected([], 0)}
            >
              Continue to Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Seats</CardTitle>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-background border border-border rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted rounded"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded"></div>
            <span>Selected</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {(externalSeatMaps || seatMaps?.data?.seat_maps)?.map((seatMap, mapIndex) => (
          <div key={mapIndex} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-medium capitalize">{(seatMap as any).cabin_class || seatMap.cabinClass} Class</h3>
              {selectedSeats.length > 0 && (
                <Badge variant="outline">
                  {selectedSeats.length} of {passengerCount} selected
                </Badge>
              )}
            </div>
            
            {/* Simplified seat grid */}
            <div className="bg-muted/20 p-4 rounded-lg overflow-x-auto">
              <div className="min-w-max">
                {/* Create rows based on seat data */}
                {Array.from({ length: Math.ceil(seatMap.seats.length / 6) }, (_, rowIndex) => {
                  const rowSeats = seatMap.seats.slice(rowIndex * 6, (rowIndex + 1) * 6);
                  if (rowSeats.length === 0) return null;
                  
                  return (
                    <div key={rowIndex} className="flex items-center gap-1 mb-2">
                      <div className="w-8 text-xs text-muted-foreground text-center">
                        {rowIndex + 1}
                      </div>
                      {rowSeats.map((seat, seatIndex) => (
                        <div key={seat.id} className="flex items-center">
                          <button
                            className={getSeatDisplayClass(seat)}
                            onClick={() => handleSeatClick(seat)}
                            disabled={!seat.available}
                            title={`Seat ${seat.designator}${seat.price ? ` - $${seat.price.amount}` : ''}`}
                          >
                            {seat.designator}
                          </button>
                          {seatIndex === 2 && <div className="w-4"></div>} {/* Aisle gap */}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Selected seats summary */}
            {selectedSeats.length > 0 && (
              <div className="mt-4 p-3 bg-accent/50 rounded-lg">
                <h4 className="font-medium mb-2">Selected Seats:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map(seat => (
                    <Badge key={seat.id} variant="secondary">
                      {seat.designator} 
                      {seat.price && ` (+$${seat.price.amount})`}
                    </Badge>
                  ))}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Total seat fees: ${selectedSeats.reduce((sum, seat) => sum + parseFloat(seat.price?.amount || '0'), 0).toFixed(2)}
                </div>
              </div>
            )}
          </div>
        ))}
        
        <div className="flex justify-between items-center mt-6">
          <Button 
            variant="outline"
            onClick={() => onSeatsSelected([], 0)}
          >
            Skip Seat Selection
          </Button>
          <Button 
            onClick={() => updateParent(selectedSeats)}
            disabled={selectedSeats.length === 0}
          >
            Continue with Selected Seats
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}