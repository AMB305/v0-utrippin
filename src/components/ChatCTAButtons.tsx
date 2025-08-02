import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CTA {
  text: string;
  action: string;
}

interface ChatCTAButtonsProps {
  ctas: CTA[];
  onContinueChat?: () => void;
}

export const ChatCTAButtons: React.FC<ChatCTAButtonsProps> = ({ ctas, onContinueChat }) => {
  const navigate = useNavigate();

  const handleCTAClick = (action: string) => {
    if (action === 'CONTINUE_CHAT') {
      onContinueChat?.();
    } else if (action.startsWith('/')) {
      navigate(action);
    } else if (action.startsWith('http')) {
      window.open(action, '_blank');
    }
  };

  if (!ctas || ctas.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 mt-4">
      {ctas.map((cta, index) => (
        <Button
          key={index}
          onClick={() => handleCTAClick(cta.action)}
          variant={index === 0 ? "default" : "outline"}
          className={
            index === 0 
              ? "bg-blue-600 hover:bg-blue-700 text-white border-none" 
              : "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
          }
          size="sm"
        >
          {cta.text}
        </Button>
      ))}
    </div>
  );
};
