import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CreditCard, XCircle, Info } from 'lucide-react';

interface HotelPolicy {
  metapolicy_struct?: {
    checkin_time?: string;
    checkout_time?: string;
    cancellation_policy?: string;
    payment_policy?: string;
  };
  metapolicy_extra_info?: {
    pet_policy?: string;
    smoking_policy?: string;
    age_restriction?: string;
    additional_fees?: string;
  };
  cancellation_penalties?: {
    policies?: Array<{
      charge_type: string;
      charge_amount: number;
      currency: string;
      from_date: string;
      to_date: string;
      description: string;
    }>;
  };
  check_in?: string;
  check_out?: string;
}

interface TaxFee {
  name: string;
  amount: number;
  currency: string;
  included_by_supplier: boolean;
  per_night?: boolean;
  per_person?: boolean;
}

interface HotelPolicyDisplayProps {
  policies: HotelPolicy;
  taxes_and_fees?: TaxFee[];
  className?: string;
}

export function HotelPolicyDisplay({ policies, taxes_and_fees, className }: HotelPolicyDisplayProps) {
  const checkInTime = policies?.metapolicy_struct?.checkin_time || policies?.check_in || 'Contact hotel';
  const checkOutTime = policies?.metapolicy_struct?.checkout_time || policies?.check_out || 'Contact hotel';

  // Separate included and non-included fees
  const includedFees = taxes_and_fees?.filter(fee => fee.included_by_supplier) || [];
  const nonIncludedFees = taxes_and_fees?.filter(fee => !fee.included_by_supplier) || [];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Check-in/Check-out Times */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" />
            Check-in & Check-out
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-sm text-muted-foreground">Check-in</p>
              <p className="text-base">{checkInTime}</p>
            </div>
            <div>
              <p className="font-medium text-sm text-muted-foreground">Check-out</p>
              <p className="text-base">{checkOutTime}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancellation Policies */}
      {(policies?.metapolicy_struct?.cancellation_policy || policies?.cancellation_penalties?.policies) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <XCircle className="h-5 w-5" />
              Cancellation Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {policies.metapolicy_struct?.cancellation_policy && (
              <p className="text-sm">{policies.metapolicy_struct.cancellation_policy}</p>
            )}
            
            {policies.cancellation_penalties?.policies && (
              <div className="space-y-2">
                <p className="font-medium text-sm">Cancellation Fees:</p>
                {policies.cancellation_penalties.policies.map((policy, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-muted/50">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-xs">
                        {policy.charge_type}
                      </Badge>
                      <span className="font-medium">
                        {policy.charge_amount} {policy.currency}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {new Date(policy.from_date).toLocaleDateString()} - {new Date(policy.to_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm">{policy.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Hotel Policies */}
      {policies?.metapolicy_extra_info && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="h-5 w-5" />
              Hotel Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {policies.metapolicy_extra_info.pet_policy && (
              <div>
                <p className="font-medium text-sm">Pet Policy</p>
                <p className="text-sm text-muted-foreground">{policies.metapolicy_extra_info.pet_policy}</p>
              </div>
            )}
            {policies.metapolicy_extra_info.smoking_policy && (
              <div>
                <p className="font-medium text-sm">Smoking Policy</p>
                <p className="text-sm text-muted-foreground">{policies.metapolicy_extra_info.smoking_policy}</p>
              </div>
            )}
            {policies.metapolicy_extra_info.age_restriction && (
              <div>
                <p className="font-medium text-sm">Age Restrictions</p>
                <p className="text-sm text-muted-foreground">{policies.metapolicy_extra_info.age_restriction}</p>
              </div>
            )}
            {policies.metapolicy_extra_info.additional_fees && (
              <div>
                <p className="font-medium text-sm">Additional Information</p>
                <p className="text-sm text-muted-foreground">{policies.metapolicy_extra_info.additional_fees}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Taxes and Fees */}
      {taxes_and_fees && taxes_and_fees.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5" />
              Taxes & Fees
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {includedFees.length > 0 && (
              <div>
                <p className="font-medium text-sm mb-2 text-green-600">Included in Total Price</p>
                <div className="space-y-1">
                  {includedFees.map((fee, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{fee.name}</span>
                      <span>{fee.amount} {fee.currency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {nonIncludedFees.length > 0 && (
              <div>
                <p className="font-medium text-sm mb-2 text-orange-600">Not Included - Pay at Hotel</p>
                <div className="space-y-1">
                  {nonIncludedFees.map((fee, index) => (
                    <div key={index} className="flex justify-between items-center text-sm border-l-2 border-orange-200 pl-2">
                      <span className="text-muted-foreground">
                        {fee.name}
                        {fee.per_night && ' (per night)'}
                        {fee.per_person && ' (per person)'}
                      </span>
                      <span className="font-medium">{fee.amount} {fee.currency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}