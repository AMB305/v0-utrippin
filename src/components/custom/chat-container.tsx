import { cn } from '@/lib/utils';
import { ReactNode, useState, useEffect, Fragment, useRef } from 'react';

export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: ReactNode | string;
  files?: File[];
  reactions?: { [emoji: string]: number };
  pinned?: boolean;
  timestamp?: string;
}

interface ChatMessagesProps {
  messages: Message[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  variant?: 'desktop' | 'mobile';
  enableReactions?: boolean;
  enablePinning?: boolean;
  enableSharing?: boolean;
}

export const ChatContainer = ({ 
  messages, 
  containerRef, 
  variant = 'mobile',
  enableReactions = false,
  enablePinning = false,
  enableSharing = false 
}: ChatMessagesProps) => {
  const [activeMessages, setActiveMessages] = useState<number[]>([]);
  const [showThinking, setShowThinking] = useState(false);
  const [showEmojiPickerFor, setShowEmojiPickerFor] = useState<string | null>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Default desktop messages
  const defaultMessages: Message[] = variant === 'desktop' ? [{
    id: 1,
    role: 'assistant' as const,
    content: 'Welcome to your AI Travel Planner. Ready to explore?',
    timestamp: '07:45 AM',
    reactions: {},
    pinned: false,
  }] : [];

  const displayMessages = messages.length > 0 ? messages : defaultMessages;

  const handleReaction = (messageId: string, emoji: string) => {
    // For desktop variant with reactions enabled
    if (variant === 'desktop' && enableReactions) {
      // This would typically update state or call a parent handler
      console.log(`Reaction ${emoji} added to message ${messageId}`);
    }
    setShowEmojiPickerFor(null);
  };

  const handlePin = (messageId: string) => {
    if (variant === 'desktop' && enablePinning) {
      console.log(`Message ${messageId} pinned`);
    }
  };

  const handleShare = (text: string) => {
    if (variant === 'desktop' && enableSharing) {
      navigator.clipboard.writeText(text);
      alert('Message copied to clipboard!');
    }
  };

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

  // Render desktop variant
  if (variant === 'desktop') {
    return (
      <div className="space-y-4">
        {displayMessages.map((msg, index) => (
          <div key={index} className="bg-zinc-800 p-4 rounded-xl relative text-white">
            <div className="flex justify-between">
              <div>
                <div className="text-xs text-zinc-400 mb-1 font-medium">
                  {msg.role === 'assistant' ? 'Keila Bot' : 'You'}
                </div>
                <div>{msg.content}</div>
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div className="flex mt-3 gap-2 text-xl">
                    {Object.entries(msg.reactions).map(([emoji, count]) => (
                      <span key={emoji}>{emoji} {count}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 text-xs text-zinc-500">
                {enablePinning && (
                  <button onClick={() => handlePin(msg.id.toString())} title="Pin">📌</button>
                )}
                {enableReactions && (
                  <button onClick={() => setShowEmojiPickerFor(msg.id.toString())} title="React">😊</button>
                )}
                {enableSharing && (
                  <button onClick={() => handleShare(msg.content as string)} title="Share">🔗</button>
                )}
              </div>
            </div>
            {msg.pinned && <div className="mt-2 text-xs text-teal-400">📌 Pinned</div>}
          </div>
        ))}
      </div>
    );
  }

  // Render mobile variant (existing logic)
  return (
    <div
      ref={containerRef}
      className={cn(
        `flex flex-col ${displayMessages?.length > 0 ? 'h-full' : ''} gap-7 w-full`
      )}
    >
      {/* Display messages */}
      {displayMessages.map((message, index) => {
        // Only show active messages for mobile
        if (!activeMessages.includes(index)) return null;

        return (
          <div
            key={index}
            ref={index === displayMessages.length - 1 ? lastMessageRef : null}
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