import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface HorizontalCardScrollProps {
  title: string;
  children: React.ReactNode;
  showViewAll?: boolean;
  onViewAll?: () => void;
  tags?: string[];
  className?: string;
}

export const HorizontalCardScroll: React.FC<HorizontalCardScrollProps> = ({
  title,
  children,
  showViewAll = false,
  onViewAll,
  tags = [],
  className = ""
}) => {
  return (
    <div className={`mb-10 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-4">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Button 
                  key={tag} 
                  className="rounded-full text-xs h-auto px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                  variant="ghost"
                >
                  {tag}
                </Button>
              ))}
            </div>
          )}
          {showViewAll && (
            <Button 
              variant="ghost" 
              className="text-orange-500 flex items-center gap-1"
              onClick={onViewAll}
            >
              View All <ArrowRight size={16} />
            </Button>
          )}
        </div>
      </div>
      <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
        {children}
      </div>
    </div>
  );
};