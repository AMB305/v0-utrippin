import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DollarSign, Euro, PoundSterling, CircleDollarSign } from 'lucide-react';

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', icon: DollarSign },
  { code: 'EUR', name: 'Euro', symbol: '€', icon: Euro },
  { code: 'GBP', name: 'British Pound', symbol: '£', icon: PoundSterling },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', icon: CircleDollarSign },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', icon: DollarSign },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', icon: DollarSign }
];

interface CurrencySelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  value = 'USD', 
  onValueChange,
  className = '' 
}) => {
  const { t } = useTranslation();
  
  const selectedCurrency = currencies.find(c => c.code === value) || currencies[0];
  const Icon = selectedCurrency.icon;

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={`w-auto gap-2 ${className}`}>
        <div className="flex items-center gap-1">
          <span>{selectedCurrency.symbol}</span>
          <span className="hidden sm:inline">{selectedCurrency.code}</span>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-background border border-border shadow-elegant z-[100]">
        {currencies.map((currency) => {
          const CurrencyIcon = currency.icon;
          return (
            <SelectItem key={currency.code} value={currency.code}>
              <div className="flex items-center gap-2">
                <CurrencyIcon className="w-4 h-4" />
                <span>{currency.symbol}</span>
                <span>{t(`currency.${currency.code.toLowerCase()}`)}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

// Hook for currency conversion (placeholder for now)
export const useCurrencyConverter = () => {
  const convertPrice = (amount: number, fromCurrency: string, toCurrency: string): number => {
    // Placeholder conversion rates - in production, this would fetch real rates
    const rates: Record<string, number> = {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110,
      AUD: 1.35,
      CAD: 1.25
    };
    
    const usdAmount = amount / (rates[fromCurrency] || 1);
    return usdAmount * (rates[toCurrency] || 1);
  };

  const formatPrice = (amount: number, currency: string): string => {
    const selectedCurrency = currencies.find(c => c.code === currency) || currencies[0];
    return `${selectedCurrency.symbol}${amount.toFixed(2)}`;
  };

  return { convertPrice, formatPrice };
};
