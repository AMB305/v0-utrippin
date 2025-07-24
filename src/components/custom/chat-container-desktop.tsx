import React, { useState } from 'react';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  reactions: { [emoji: string]: number };
  pinned: boolean;
}

interface ChatContainerProps {
  variant?: 'desktop' | 'mobile';
  enableReactions?: boolean;
  enablePinning?: boolean;
  enableSharing?: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  variant = 'mobile',
  enableReactions = false,
  enablePinning = false,
  enableSharing = false,
}) => {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    sender: 'Keila Bot',
    text: 'Welcome to your AI Travel Planner. Ready to explore?',
    timestamp: '07:45 AM',
    reactions: {},
    pinned: false,
  }]);

  const [showEmojiPickerFor, setShowEmojiPickerFor] = useState<string | null>(null);

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? {
            ...msg,
            reactions: {
              ...msg.reactions,
              [emoji]: (msg.reactions[emoji] || 0) + 1,
            },
          }
        : msg
    ));
    setShowEmojiPickerFor(null);
  };

  const handlePin = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, pinned: !msg.pinned } : msg
      )
    );
  };

  const handleShare = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Message copied to clipboard!');
  };

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div key={msg.id} className="bg-zinc-800 p-4 rounded-xl /* large rounded corners */ relative text-white /* main text color: white */">
          <div className="flex justify-between">
            <div>
              <div className="text-xs text-zinc-400 /* muted timestamp or helper text */ mb-1 font-medium">{msg.sender}</div>
              <div>{msg.text}</div>
              {Object.keys(msg.reactions).length > 0 && (
                <div className="flex mt-3 gap-2 text-xl">
                  {Object.entries(msg.reactions).map(([emoji, count]) => (
                    <span key={emoji}>{emoji} {count}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 text-xs text-zinc-500">
              {enablePinning && (
                <button onClick={() => handlePin(msg.id)} title="Pin">📌</button>
              )}
              {enableReactions && (
                <button onClick={() => setShowEmojiPickerFor(msg.id)} title="React">😊</button>
              )}
              {enableSharing && (
                <button onClick={() => handleShare(msg.text)} title="Share">🔗</button>
              )}
            </div>
          </div>
          {msg.pinned && <div className="mt-2 text-xs text-teal-400 /* accent text color */">📌 Pinned</div>}
        </div>
      ))}
    </div>
  );
};