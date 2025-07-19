import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GroupedFlight } from "@/utils/groupOffersByFlight";
import { DuffelOffer } from "@/lib/duffel";
import { Plane, Clock, Wifi, Zap, Shield, Luggage } from "lucide-react";
import { mapOfferToDisplayCard } from "@/utils/mapOfferToDisplayCard";

interface GroupedFlightOffersProps {
  groupedFlights: GroupedFlight[];
  onOfferSelect?: (offer: DuffelOffer) => void;
}

export default function GroupedFlightOffers({ groupedFlights, onOfferSelect }: GroupedFlightOffersProps) {
  const navigate = useNavigate();

  if (!groupedFlights || groupedFlights.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Plane className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No flights found</h3>
        <p>Try adjusting your search criteria or filters</p>
      </div>
    );
  }

  const handleSelectFlight = (offer: DuffelOffer) => {
    // Store selected offer and search params
    localStorage.setItem("selectedOffer", JSON.stringify(offer));
    
    const urlParams = new URLSearchParams(window.location.search);
    const searchParams = {
      origin: urlParams.get('origin') || '',
      destination: urlParams.get('destination') || '',
      departure: urlParams.get('departure') || '',
      return: urlParams.get('return') || '',
      adults: urlParams.get('adults') || '1',
      children: urlParams.get('children') || '0',
      infants: urlParams.get('infants') || '0',
      cabinClass: urlParams.get('cabinClass') || 'economy',
      tripType: urlParams.get('tripType') || 'round-trip',
      directOnly: urlParams.get('directOnly') || 'false'
    };
    
    localStorage.setItem("lastSearchParams", JSON.stringify(searchParams));
    navigate(`/flights/booking?offerId=${offer.id}`);
    onOfferSelect?.(offer);
  };

  return (
    <div className="space-y-6">
      {groupedFlights.map((flight) => {
        const baseCard = mapOfferToDisplayCard(flight.baseOffer);
        const hasMultipleFares = flight.offers.length > 1;

        return (
          <div
            key={flight.key}
            className="border rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 bg-white"
          >
            {/* Main Flight Info */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-4">
              
              {/* Left: Airline Info */}
              <div className="flex items-center space-x-4 min-w-0">
                <div className="w-12 h-12 flex items-center justify-center bg-muted rounded-lg flex-shrink-0">
                  <img 
                    src={baseCard.airlineLogo} 
                    alt={baseCard.airlineName}
                    className="h-6 w-auto inline"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                      if (nextElement) nextElement.style.display = 'block';
                    }}
                  />
                  <Plane className={`w-6 h-6 text-primary ${baseCard.airlineLogo !== '/img/default-airline.png' ? 'hidden' : 'block'}`} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{baseCard.airlineName}</p>
                  <p className="text-sm text-muted-foreground">{baseCard.cabin}</p>
                </div>
              </div>

              {/* Center: Flight Route & Times */}
              <div className="flex-1 w-full lg:mx-8">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-xl lg:text-2xl font-bold text-foreground">{baseCard.departureTime}</div>
                    <div className="text-sm font-medium text-muted-foreground">{baseCard.departureAirport}</div>
                  </div>

                  <div className="flex flex-col items-center px-4 min-w-[120px]">
                    <div className="flex items-center text-muted-foreground mb-2">
                      <Clock className="w-3 h-3 mr-1" />
                      <span className="text-xs">{baseCard.duration}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full">
                      <div className="h-1 bg-blue-200 w-full rounded-full relative">
                        <div className="absolute left-0 top-[-6px] w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div className="absolute right-0 top-[-6px] w-3 h-3 bg-blue-500 rounded-full"></div>
                        {baseCard.stops !== "Non-stop" && (
                          <div className="absolute left-1/2 top-[-4px] w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1/2"></div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">{baseCard.stops}</div>
                  </div>

                  <div className="text-center">
                    <div className="text-xl lg:text-2xl font-bold text-foreground">{baseCard.arrivalTime}</div>
                    <div className="text-sm font-medium text-muted-foreground">{baseCard.arrivalAirport}</div>
                  </div>
                </div>

                {/* Return Flight Info */}
                {baseCard.returnDepartureTime && (
                  <div className="border-t border-muted pt-3 mt-3">
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-foreground">{baseCard.returnDepartureTime}</div>
                        <div className="text-xs text-muted-foreground">{baseCard.returnDepartureAirport}</div>
                      </div>
                      <div className="flex flex-col items-center px-4 min-w-[120px]">
                        <div className="text-xs text-muted-foreground mb-1">{baseCard.returnDuration}</div>
                        <div className="flex items-center gap-2 w-full">
                          <div className="h-1 bg-gray-300 w-full rounded-full relative">
                            <div className="absolute left-0 top-[-6px] w-3 h-3 bg-gray-500 rounded-full"></div>
                            <div className="absolute right-0 top-[-6px] w-3 h-3 bg-gray-500 rounded-full"></div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{baseCard.returnStops}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-foreground">{baseCard.returnArrivalTime}</div>
                        <div className="text-xs text-muted-foreground">{baseCard.returnArrivalAirport}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Starting Price */}
              <div className="text-center lg:text-right flex-shrink-0">
                <div className="mb-2">
                  <div className="text-sm text-muted-foreground">Starting from</div>
                  <div className="text-2xl lg:text-3xl font-bold text-blue-600">
                    ${flight.lowestPrice}
                  </div>
                  <div className="text-xs text-gray-500">per person</div>
                </div>
                
                {/* Urgency messaging */}
                <div className="text-xs text-orange-600 mb-2">
                  Only 2 seats left at this price
                </div>
              </div>
            </div>

            {/* Multiple Fare Options */}
            {hasMultipleFares ? (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3 text-sm">Choose your fare:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {flight.offers.slice(0, 3).map((offer, index) => {
                    const price = parseFloat(offer.total_amount);
                    const priceDiff = price - flight.lowestPrice;
                    const fareType = index === 0 ? 'Basic' : index === 1 ? 'Standard' : 'Flex';
                    
                    return (
                      <div key={offer.id} className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium text-sm">{fareType}</div>
                            <div className="text-xs text-muted-foreground">
                              {index === 0 && "Basic fare"}
                              {index === 1 && "Free changes"}
                              {index === 2 && "Fully refundable"}
                            </div>
                          </div>
                          {index === 1 && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                        </div>
                        
                        <div className="mb-3">
                          <div className="font-bold text-lg">${price}</div>
                          {priceDiff > 0 && (
                            <div className="text-xs text-green-600">+${priceDiff.toFixed(0)} more</div>
                          )}
                        </div>
                        
                        <Button 
                          size="sm" 
                          className="w-full"
                          variant={index === 1 ? "default" : "outline"}
                          onClick={() => handleSelectFlight(offer)}
                        >
                          Select {fareType}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Single Fare Option */
              <div className="border-t pt-4 flex justify-between items-center">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Wifi className="w-3 h-3 mr-1" />
                    WiFi Available
                  </div>
                  <div className="flex items-center">
                    <Zap className="w-3 h-3 mr-1" />
                    Power Outlets
                  </div>
                  <div className="flex items-center">
                    <Luggage className="w-3 h-3 mr-1" />
                    {baseCard.baggage}
                  </div>
                </div>
                
                <Button onClick={() => handleSelectFlight(flight.baseOffer)}>
                  Select Flight
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}