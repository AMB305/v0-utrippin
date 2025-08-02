import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DuffelOffer } from "@/lib/duffel";
import { Plane, Clock, MapPin } from "lucide-react";

interface ViewFlightDetailsProps {
  offer: DuffelOffer;
}

export function ViewFlightDetails({ offer }: ViewFlightDetailsProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-800"
        >
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5" />
            Flight Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {offer.slices?.map((slice, sliceIndex) => (
            <div key={slice.id || sliceIndex} className="space-y-4">
              <h3 className="font-semibold text-lg">
                {sliceIndex === 0 ? 'Outbound Flight' : 'Return Flight'}
              </h3>
              
              {slice.segments?.map((segment, segIndex) => {
                const carrier = (segment as any).operating_carrier || (segment as any).marketing_carrier || {};
                return (
                  <div key={(segment as any).id || segIndex} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Plane className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{carrier.name || 'Unknown Airline'}</p>
                          <p className="text-sm text-muted-foreground">
                            {carrier.iata_code} • {(segment as any).aircraft?.name || 'Aircraft not specified'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Segment {segIndex + 1}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <div>
                          <p className="font-medium">{segment.origin?.iata_code || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">{segment.origin?.city_name || 'Unknown'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <div>
                          <p className="font-medium">{segment.destination?.iata_code || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">{segment.destination?.city_name || 'Unknown'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Departure</p>
                        <p className="font-semibold">
                          {(segment as any).departing_at 
                            ? new Date((segment as any).departing_at).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })
                            : 'N/A'
                          }
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(segment as any).departing_at 
                            ? new Date((segment as any).departing_at).toLocaleDateString()
                            : ''
                          }
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center">
                        <Clock className="w-4 h-4 text-muted-foreground mb-1" />
                        <p className="text-sm font-medium">{(segment as any).duration || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Arrival</p>
                        <p className="font-semibold">
                          {(segment as any).arriving_at 
                            ? new Date((segment as any).arriving_at).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })
                            : 'N/A'
                          }
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(segment as any).arriving_at 
                            ? new Date((segment as any).arriving_at).toLocaleDateString()
                            : ''
                          }
                        </p>
                      </div>
                    </div>
                    
                    {(segment as any).passengers?.[0] && (
                      <div className="mt-4 pt-3 border-t">
                        <h4 className="font-medium mb-2">Passenger Details</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Cabin Class: </span>
                            <span className="font-medium">
                              {(segment as any).passengers[0].cabin_class_marketing_name || 'Economy'}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Fare Basis: </span>
                            <span className="font-medium">
                              {(segment as any).passengers[0].fare_basis_code || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Additional Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Refundable: </span>
                <span className={`font-medium ${
                  (offer as any).conditions?.refund_policy?.refundable ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(offer as any).conditions?.refund_policy?.refundable ? "Yes" : "No"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Offer Expires: </span>
                <span className="font-medium">
                  {offer.expires_at 
                    ? new Date(offer.expires_at).toLocaleDateString()
                    : 'N/A'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
