import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FareCard, FareOption } from "@/components/ui/fare-card";
import { DuffelOffer } from "@/lib/duffel";
import { formatPrice } from "@/utils/flightDataHelpers";
import { Tag } from "lucide-react";

interface FareSelectionProps {
  offer: DuffelOffer;
  onFareSelected: (fareId: string, fareData: FareOption) => void;
  className?: string;
}

export function FareSelection({ offer, onFareSelected, className }: FareSelectionProps) {
  const [selectedFareId, setSelectedFareId] = useState<string>("basic");

  // Generate fare options based on the offer
  const generateFareOptions = (baseOffer: DuffelOffer): FareOption[] => {
    const basePrice = parseFloat(baseOffer.total_amount);
    const currency = baseOffer.total_currency;
    
    return [
      {
        id: "basic",
        name: "Basic",
        description: "Essential travel with carry-on",
        price: formatPrice(baseOffer.total_amount, currency),
        included: [
          "Personal item",
          "Carry-on bag", 
          "Seat selection at check-in"
        ],
        excluded: [
          "Checked bag",
          "Advanced seat selection",
          "Changes and cancellations"
        ]
      },
      {
        id: "standard",
        name: "Standard", 
        description: "More flexibility and comfort",
        price: formatPrice((basePrice * 1.15).toFixed(2), currency),
        originalPrice: formatPrice((basePrice * 1.25).toFixed(2), currency),
        savings: formatPrice((basePrice * 0.10).toFixed(2), currency),
        popular: true,
        included: [
          "Personal item",
          "Carry-on bag",
          "1 checked bag (up to 50lbs)",
          "Standard seat selection",
          "Changes allowed (fees apply)"
        ],
        excluded: [
          "Priority boarding",
          "Extra legroom seats"
        ]
      },
      {
        id: "flex",
        name: "Flex",
        description: "Maximum flexibility and premium perks",
        price: formatPrice((basePrice * 1.35).toFixed(2), currency),
        included: [
          "Personal item", 
          "Carry-on bag",
          "2 checked bags (up to 50lbs each)",
          "Premium seat selection",
          "Priority boarding",
          "Free changes and cancellations",
          "Extra legroom available"
        ]
      }
    ];
  };

  const fareOptions = generateFareOptions(offer);

  const handleFareSelect = (fareId: string) => {
    setSelectedFareId(fareId);
    const selectedFare = fareOptions.find(fare => fare.id === fareId);
    if (selectedFare) {
      onFareSelected(fareId, selectedFare);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-primary" />
          Choose Your Fare
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select the fare option that best suits your travel needs
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {fareOptions.map((fare) => (
            <FareCard
              key={fare.id}
              fare={fare}
              selected={selectedFareId === fare.id}
              onSelect={handleFareSelect}
            />
          ))}
        </div>
        
        {/* Fare Comparison Note */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Prices shown include all taxes and fees. 
            Fare rules and restrictions apply. Changes and cancellations may incur additional fees.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}