import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Info, X, RefreshCw } from 'lucide-react';

export interface Message {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface EnhancedMessagingProps {
  messages: Message[];
  onDismiss: (id: string) => void;
  className?: string;
}

const EnhancedMessaging = ({ messages, onDismiss, className = "" }: EnhancedMessagingProps) => {
  const { toast } = useToast();

  useEffect(() => {
    // Auto-dismiss non-persistent messages
    messages.forEach(message => {
      if (!message.persistent && message.duration !== 0) {
        const timer = setTimeout(() => {
          onDismiss(message.id);
        }, message.duration || 5000);

        return () => clearTimeout(timer);
      }
    });
  }, [messages, onDismiss]);

  const getIcon = (type: Message['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-600" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getVariant = (type: Message['type']) => {
    switch (type) {
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  if (messages.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {messages.map((message) => (
        <Alert key={message.id} variant={getVariant(message.type)} className="relative">
          <div className="flex items-start gap-3">
            {getIcon(message.type)}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium">{message.title}</h4>
              {message.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {message.description}
                </p>
              )}
              {message.action && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={message.action.onClick}
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  {message.action.label}
                </Button>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1"
              onClick={() => onDismiss(message.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Alert>
      ))}
    </div>
  );
};

// Global message manager
class MessageManager {
  private messages: Message[] = [];
  private listeners: ((messages: Message[]) => void)[] = [];

  addMessage(message: Omit<Message, 'id'>) {
    const newMessage: Message = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    this.messages.push(newMessage);
    this.notifyListeners();
    
    return newMessage.id;
  }

  removeMessage(id: string) {
    this.messages = this.messages.filter(m => m.id !== id);
    this.notifyListeners();
  }

  clearAll() {
    this.messages = [];
    this.notifyListeners();
  }

  subscribe(listener: (messages: Message[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.messages]));
  }
}

export const messageManager = new MessageManager();

// Hook for using the message system
export const useEnhancedMessaging = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    return messageManager.subscribe(setMessages);
  }, []);

  const addMessage = (message: Omit<Message, 'id'>) => {
    return messageManager.addMessage(message);
  };

  const removeMessage = (id: string) => {
    messageManager.removeMessage(id);
  };

  const clearAll = () => {
    messageManager.clearAll();
  };

  // Helper methods for common message types
  const showSuccess = (title: string, description?: string, options?: Partial<Message>) => {
    return addMessage({ type: 'success', title, description, ...options });
  };

  const showError = (title: string, description?: string, options?: Partial<Message>) => {
    return addMessage({ 
      type: 'error', 
      title, 
      description, 
      persistent: true, // Errors should be persistent by default
      ...options 
    });
  };

  const showWarning = (title: string, description?: string, options?: Partial<Message>) => {
    return addMessage({ type: 'warning', title, description, ...options });
  };

  const showInfo = (title: string, description?: string, options?: Partial<Message>) => {
    return addMessage({ type: 'info', title, description, ...options });
  };

  return {
    messages,
    addMessage,
    removeMessage,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default EnhancedMessaging;
