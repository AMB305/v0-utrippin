import { cn } from '@/lib/utils';
import { ReactNode, useState, useEffect, Fragment, useRef } from 'react';

export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: ReactNode | string;
  files?: File[];
}

interface ChatMessagesProps {
  messages: Message[];
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatContainer = ({ messages, containerRef }: ChatMessagesProps) => {
  const [activeMessages, setActiveMessages] = useState<number[]>([]);
  const [showThinking, setShowThinking] = useState(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, containerRef]);

  useEffect(() => {
    // Keep existing active messages and add new user messages
    setActiveMessages(prev => {
      const newActiveMessages = [...prev];
      messages.forEach((msg, index) => {
        if (!newActiveMessages.includes(index)) {
          newActiveMessages.push(index);
        }
      });
      return newActiveMessages;
    });
    
    // Show "AI thinking" only if the last message is from user
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
      setShowThinking(true);
      
      setTimeout(() => {
        setShowThinking(false);
      }, 2000);
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className={cn(
        `flex flex-col ${messages?.length > 0 ? 'h-full' : ''} gap-7 w-full`
      )}
    >
      {/* Display messages */}
      {messages.map((message, index) => {
        // Only show active messages
        if (!activeMessages.includes(index)) return null;

        return (
          <div
            key={index}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            className={cn(
              'flex w-full',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                index === 0 && 'mt-4',
                message.role === 'user' ? 'sm:w-full md:w-[420px]' : 'w-full',
                message.role === 'user' ? 'px-4 py-2' : 'px-0 py-0',
                'rounded-2xl',
                'text-foreground/70',
                message.role === 'user' ? 'bg-primary/10' : 'bg-transparent'
              )}
            >
              {message.role === 'assistant' ? (
                typeof message.content === 'string' ? (
                  <Fragment key={`content-${index}`}>
                    {message.content}
                  </Fragment>
                ) : (
                  <div className="transition-opacity duration-500 opacity-100">
                    {message.content}
                  </div>
                )
              ) : (
                // Normal render for user messages
                <p className='text-foreground/70 text-sm'>{message.content}</p>
              )}
            </div>
          </div>
        );
      })}

      {/* Show thinking message */}
      {showThinking && (
        <div className="flex w-full justify-start">
          <div className="px-0 py-0 rounded-2xl text-foreground/70 bg-transparent">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="text-sm text-foreground/50">Keila is thinking...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 