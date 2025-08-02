import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { DuffelOffer } from "@/lib/duffel";
import { Plane, Clock, Wifi, Zap, Shield, Luggage } from "lucide-react";
import { mapOfferToDisplayCard } from "@/utils/mapOfferToDisplayCard";
import { ViewFlightDetails } from "@/components/ViewFlightDetails";

interface DuffelFlightOffersProps {
  offers: DuffelOffer[];
  onOfferSelect?: (offer: DuffelOffer) => void;
}

export default function DuffelFlightOffers({ offers, onOfferSelect }: DuffelFlightOffersProps) {
  const navigate = useNavigate();
  
  // Debug: Log the first offer to see the data structure
  console.log('🛫 DuffelFlightOffers received offers:', offers.length);
  if (offers.length > 0) {
    console.log('📋 First offer structure:', JSON.stringify(offers[0], null, 2));
  }

  if (!offers || offers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Plane className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No flights found</h3>
        <p>Try adjusting your search criteria or dates</p>
      </div>
    );
  }


  const handleSelectFlight = (offer: DuffelOffer) => {
    // Console log the entire Duffel offer payload for booking preparation
    console.log('🎯 SELECTED FLIGHT OFFER - Complete payload for booking:');
    console.log(JSON.stringify(offer, null, 2));
    
    // Log key booking details
    console.log('📋 KEY BOOKING DETAILS:');
    console.log('- Offer ID:', offer.id);
    console.log('- Total Amount:', offer.total_amount, offer.total_currency);
    console.log('- Passengers:', offer.passengers.length);
    console.log('- Cabin Class:', offer.cabin_class);
    console.log('- Expires At:', offer.expires_at);
    console.log('- Live Mode:', offer.live_mode);
    
    // Log route details
    offer.slices.forEach((slice, index) => {
      console.log(`- Route ${index + 1}: ${slice.origin.iata_code} → ${slice.destination.iata_code}`);
      console.log(`  - Duration: ${slice.duration}`);
      console.log(`  - Segments: ${slice.segments.length}`);
    });
    
    // 🔥 FIXED: Store selected offer AND search parameters in localStorage
    localStorage.setItem("selectedOffer", JSON.stringify(offer));
    
    // Extract search params from current URL
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
    console.log('✅ Stored selected offer and search params in localStorage');
    console.log('📋 Search params saved:', searchParams);
    
    // Navigate to booking page with offer ID in URL for reference
    navigate(`/flights/booking?offerId=${offer.id}`);
    
    // Call the original handler (if provided)
    onOfferSelect?.(offer);
  };

  return (
    <div className="space-y-4">
      {offers.map((offer) => {
        const card = mapOfferToDisplayCard(offer);

        return (
          <div
            key={offer.id}
            className="border rounded-xl p-6 shadow-sm hover:shadow-lg hover:scale-[1.01] hover:opacity-95 transition-all duration-200 ease-in-out cursor-pointer bg-white"
            onClick={() => handleSelectFlight(offer)}
          >
            {/* Main Flight Content */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              
              {/* Left: Airline Info */}
              <div className="flex items-center space-x-4 min-w-0">
                <div className="w-12 h-12 flex items-center justify-center bg-muted rounded-lg flex-shrink-0">
                  <img 
                    src={card.airlineLogo} 
                    alt={card.airlineName}
                    className="h-6 w-auto inline"
                    onError={(e) => {
                      // Fallback to plane icon if image fails
                      e.currentTarget.style.display = 'none';
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                      if (nextElement) nextElement.style.display = 'block';
                    }}
                  />
                  <Plane className={`w-6 h-6 text-primary ${card.airlineLogo !== '/img/default-airline.png' ? 'hidden' : 'block'}`} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center">
                    <p className="font-semibold text-foreground">{card.airlineName}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{card.cabin}</p>
                </div>
              </div>

              {/* Center: Flight Route & Times */}
              <div className="flex-1 w-full sm:mx-8">
                {/* Outbound Flight */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-foreground">{card.departureTime}</div>
                      <div className="text-sm font-medium text-muted-foreground">{card.departureAirport}</div>
                    </div>

                    <div className="flex flex-col items-center px-4 min-w-[120px]">
                      <div className="flex items-center text-muted-foreground mb-2">
                        <Clock className="w-3 h-3 mr-1" />
                        <span className="text-xs">{card.duration}</span>
                      </div>
                      
                      {/* Enhanced Timeline for Stops */}
                      <div className="flex items-center gap-2 w-full">
                        <div className="h-1 bg-blue-200 w-full rounded-full relative">
                          <div className="absolute left-0 top-[-6px] w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div className="absolute right-0 top-[-6px] w-3 h-3 bg-blue-500 rounded-full"></div>
                          {card.stops !== "Non-stop" && (
                            <div className="absolute left-1/2 top-[-4px] w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1/2"></div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">{card.stops}</div>
                    </div>

                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-foreground">{card.arrivalTime}</div>
                      <div className="text-sm font-medium text-muted-foreground">{card.arrivalAirport}</div>
                    </div>
                  </div>
                </div>

                {/* Return Flight (if round-trip) */}
                {card.returnDepartureTime && (
                  <div className="border-t border-muted pt-3">
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-foreground">{card.returnDepartureTime}</div>
                        <div className="text-xs text-muted-foreground">{card.returnDepartureAirport}</div>
                      </div>

                      <div className="flex flex-col items-center px-4 min-w-[120px]">
                        <div className="text-xs text-muted-foreground mb-1">{card.returnDuration}</div>
                        <div className="flex items-center gap-2 w-full">
                          <div className="h-1 bg-gray-300 w-full rounded-full relative">
                            <div className="absolute left-0 top-[-6px] w-3 h-3 bg-gray-500 rounded-full"></div>
                            <div className="absolute right-0 top-[-6px] w-3 h-3 bg-gray-500 rounded-full"></div>
                            {card.returnStops !== "Non-stop" && (
                              <div className="absolute left-1/2 top-[-4px] w-2 h-2 bg-gray-400 rounded-full transform -translate-x-1/2"></div>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{card.returnStops}</div>
                      </div>

                      <div className="text-center">
                        <div className="text-lg font-semibold text-foreground">{card.returnArrivalTime}</div>
                        <div className="text-xs text-muted-foreground">{card.returnArrivalAirport}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Price & Book */}
              <div className="text-center sm:text-right flex-shrink-0">
                {/* Enhanced Price Highlighting */}
                <div className="mb-4">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                    ${card.totalPrice}
                  </div>
                  <div className="text-xs text-gray-500">per person</div>
                </div>

                {/* Deal/Refundable Badge */}
                <div className="space-y-2 mb-4">
                  {card.refundable && (
                    <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full inline-block">
                      <Shield className="w-3 h-3 mr-1 inline" />
                      Refundable
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full mb-2 hover:scale-105 transition-transform duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectFlight(offer);
                  }}
                >
                  Select Flight
                </Button>
                <div onClick={(e) => e.stopPropagation()}>
                  <ViewFlightDetails offer={offer} />
                </div>
              </div>
            </div>

            {/* Additional Features Footer */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-muted mt-4 gap-2">
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
                  {card.baggage}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Expires: {new Date(offer.expires_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
