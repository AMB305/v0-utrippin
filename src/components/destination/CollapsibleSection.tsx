import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  open?: boolean;
  className?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  children, 
  open = true,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(open);

  return (
    <Card className={`rounded-xl p-4 shadow-sm mb-4 ${className}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full text-lg font-semibold hover:text-primary transition-colors"
      >
        {title}
        <span className="text-xl font-bold text-muted-foreground">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </Card>
  );
};