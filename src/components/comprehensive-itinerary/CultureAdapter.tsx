// src/components/comprehensive-itinerary/CultureAdapter.tsx

import React from 'react';
import { Globe, Info } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CultureTip } from '@/lib/schemas';

interface CultureAdapterProps {
  tips: CultureTip[];
}

export const CultureAdapter: React.FC<CultureAdapterProps> = ({ tips }) => {
  const groupedTips = tips.reduce((acc, tip) => {
    if (!acc[tip.category]) acc[tip.category] = [];
    acc[tip.category].push(tip);
    return acc;
  }, {} as Record<string, CultureTip[]>);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Globe className="h-5 w-5" />
          Culture & Local Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {Object.entries(groupedTips).map(([category, categoryTips]) => (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  <span className="capitalize font-medium">{category}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {categoryTips.map((tip, index) => (
                    <div key={index} className="border-l-4 border-primary/20 pl-4">
                      <h5 className="font-medium text-primary mb-2">{tip.title}</h5>
                      <p className="text-muted-foreground leading-relaxed">
                        {tip.content}
                      </p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};