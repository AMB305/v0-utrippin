import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Luggage, Briefcase } from "lucide-react";

interface BaggageOption {
  id: string;
  type: 'checked' | 'carry_on';
  name: string;
  description: string;
  price: number;
  maxQuantity: number;
}

interface BaggageSelectionProps {
  onBaggageSelected: (baggage: Array<{ type: string; quantity: number; price: number }>, totalPrice: number) => void;
}

export function BaggageSelection({ onBaggageSelected }: BaggageSelectionProps) {
  // Mock baggage options - in real implementation, these would come from the offer
  const baggageOptions: BaggageOption[] = [
    {
      id: 'checked_23kg',
      type: 'checked',
      name: 'Checked Bag (23kg)',
      description: 'Standard checked baggage up to 23kg',
      price: 35,
      maxQuantity: 3
    },
    {
      id: 'checked_32kg',
      type: 'checked',
      name: 'Heavy Checked Bag (32kg)',
      description: 'Heavy checked baggage up to 32kg',
      price: 55,
      maxQuantity: 2
    },
    {
      id: 'carry_on_extra',
      type: 'carry_on',
      name: 'Extra Carry-on',
      description: 'Additional carry-on bag',
      price: 25,
      maxQuantity: 1
    }
  ];

  const [selectedBaggage, setSelectedBaggage] = useState<Record<string, number>>({});

  const updateQuantity = (optionId: string, change: number) => {
    const option = baggageOptions.find(opt => opt.id === optionId);
    if (!option) return;

    const currentQuantity = selectedBaggage[optionId] || 0;
    const newQuantity = Math.max(0, Math.min(option.maxQuantity, currentQuantity + change));
    
    const updatedBaggage = { ...selectedBaggage };
    if (newQuantity === 0) {
      delete updatedBaggage[optionId];
    } else {
      updatedBaggage[optionId] = newQuantity;
    }
    
    setSelectedBaggage(updatedBaggage);
    updateParent(updatedBaggage);
  };

  const updateParent = (baggage: Record<string, number>) => {
    const selectedItems = Object.entries(baggage).map(([optionId, quantity]) => {
      const option = baggageOptions.find(opt => opt.id === optionId)!;
      return {
        type: option.type,
        quantity,
        price: option.price * quantity
      };
    });

    const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);
    onBaggageSelected(selectedItems, totalPrice);
  };

  const getTotalPrice = () => {
    return Object.entries(selectedBaggage).reduce((total, [optionId, quantity]) => {
      const option = baggageOptions.find(opt => opt.id === optionId);
      return total + (option ? option.price * quantity : 0);
    }, 0);
  };

  const getTotalItems = () => {
    return Object.values(selectedBaggage).reduce((sum, quantity) => sum + quantity, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Luggage className="h-5 w-5" />
          Add Extra Baggage
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your flight includes standard carry-on and personal item. Add extra baggage below.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {baggageOptions.map((option) => {
            const quantity = selectedBaggage[option.id] || 0;
            
            return (
              <div key={option.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {option.type === 'checked' ? (
                      <Luggage className="h-5 w-5 mt-1 text-muted-foreground" />
                    ) : (
                      <Briefcase className="h-5 w-5 mt-1 text-muted-foreground" />
                    )}
                    <div>
                      <h3 className="font-medium">{option.name}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">${option.price}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Max {option.maxQuantity}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(option.id, -1)}
                      disabled={quantity === 0}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(option.id, 1)}
                      disabled={quantity >= option.maxQuantity}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {quantity > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between text-sm">
                      <span>{quantity} × ${option.price}</span>
                      <span className="font-medium">${option.price * quantity}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {getTotalItems() > 0 && (
          <>
            <Separator className="my-4" />
            <div className="bg-accent/50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Extra Baggage Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    {getTotalItems()} item{getTotalItems() > 1 ? 's' : ''} selected
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg">${getTotalPrice()}</div>
                  <div className="text-xs text-muted-foreground">Total baggage fees</div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-between items-center mt-6">
          <Button 
            variant="outline"
            onClick={() => {
              setSelectedBaggage({});
              onBaggageSelected([], 0);
            }}
          >
            No Extra Baggage
          </Button>
          <Button onClick={() => updateParent(selectedBaggage)}>
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
