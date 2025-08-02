import { cn } from '@/lib/utils';
import { ReactNode, useState, useEffect, Fragment, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Heart, Pin, Share2, Smile, Send, Users } from 'lucide-react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: ReactNode | string;
  sender_id?: string;
  receiver_id?: string;
  group_id?: string;
  files?: File[];
  reactions?: { [emoji: string]: number };
  pinned?: boolean;
  timestamp?: string;
  sent_at?: string;
}

interface ChatContainerProps {
  userId?: string;
  buddyId?: string;
  groupId?: string;
  variant?: 'desktop' | 'mobile';
  enableReactions?: boolean;
  enablePinning?: boolean;
  enableSharing?: boolean;
  messages?: Message[];
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export const ChatContainer = ({ 
  userId = 'mock-user-1',
  buddyId,
  groupId,
  variant = 'mobile',
  enableReactions = false,
  enablePinning = false,
  enableSharing = false,
  messages: propMessages = [],
  containerRef
}: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>(propMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showThinking, setShowThinking] = useState(false);
  const [showEmojiPickerFor, setShowEmojiPickerFor] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock user data for display
  const mockUsers = {
    'mock-user-1': { name: 'You', avatar: '👤' },
    'mock-user-2': { name: 'Alex', avatar: '🧑‍🎤' },
    'mock-user-3': { name: 'Maria', avatar: '👩‍💼' },
    'mock-user-4': { name: 'James', avatar: '🧑‍🚀' }
  };

  // Default messages for demo
  const defaultMessages: Message[] = [
    {
      id: '1',
      role: 'assistant',
      content: groupId ? 'Welcome to the group chat! Plan your trip together.' : 'Hey! Ready to plan an amazing trip together?',
      sender_id: buddyId || 'mock-user-2',
      receiver_id: groupId ? undefined : userId,
      group_id: groupId,
      timestamp: '10:30 AM',
      reactions: {},
      pinned: false,
    },
    ...(groupId ? [{
      id: '2',
      role: 'user' as const,
      content: 'Perfect! I was thinking about Southeast Asia. What do you all think?',
      sender_id: 'mock-user-3',
      group_id: groupId,
      timestamp: '10:32 AM',
      reactions: { '👍': 2, '🔥': 1 },
      pinned: false,
    }] : [])
  ];

  const displayMessages = messages.length > 0 ? messages : defaultMessages;

  // Real-time message subscription
  useEffect(() => {

    const channel = supabase
      .channel('travel-chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'travel_chat',
          filter: groupId 
            ? `group_id=eq.${groupId}`
            : `or(and(sender_id.eq.${userId},receiver_id.eq.${buddyId}),and(sender_id.eq.${buddyId},receiver_id.eq.${userId}))`
        },
        (payload) => {
          const newMessage: Message = {
            id: payload.new.id,
            role: payload.new.sender_id === userId ? 'user' : 'assistant',
            content: payload.new.message,
            sender_id: payload.new.sender_id,
            receiver_id: payload.new.receiver_id,
            group_id: payload.new.group_id,
            reactions: payload.new.reactions || {},
            pinned: payload.new.pinned || false,
            sent_at: payload.new.sent_at,
          };
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, buddyId, groupId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      sender_id: userId,
      receiver_id: groupId ? null : buddyId,
      group_id: groupId || null,
      message: newMessage.trim(),
      reactions: {},
      pinned: false
    };

    // Add message optimistically
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: newMessage.trim(),
      sender_id: userId,
      receiver_id: buddyId,
      group_id: groupId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: {},
      pinned: false,
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');

    // Send to Supabase
    try {
      await supabase
        .from('travel_chat')
        .insert([messageData]);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    // Simulate bot response for demo
    if (!groupId) {
      setTimeout(() => {
        const botResponse: Message = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: 'That sounds amazing! I can help you plan the perfect itinerary. What dates are you thinking?',
          sender_id: buddyId || 'mock-user-2',
          receiver_id: userId,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reactions: {},
          pinned: false,
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!enableReactions) return;

    // Update local state optimistically
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions };
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        return { ...msg, reactions };
      }
      return msg;
    }));

    // Update in database
    try {
      const message = messages.find(m => m.id === messageId);
      if (message) {
        const reactions = { ...message.reactions };
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        
        await supabase
          .from('travel_chat')
          .update({ reactions })
          .eq('id', messageId);
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
    }

    setShowEmojiPickerFor(null);
  };

  const handlePin = async (messageId: string) => {
    if (!enablePinning) return;

    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, pinned: !msg.pinned } : msg
    ));

    try {
      const message = messages.find(m => m.id === messageId);
      await supabase
        .from('travel_chat')
        .update({ pinned: !message?.pinned })
        .eq('id', messageId);
    } catch (error) {
      console.error('Error updating pin status:', error);
    }
  };

  const handleShare = (text: string) => {
    if (!enableSharing) return;
    navigator.clipboard.writeText(text as string);
    // You could add a toast notification here
  };

  const getUserInfo = (senderId: string) => {
    return mockUsers[senderId as keyof typeof mockUsers] || { name: 'Unknown', avatar: '👤' };
  };

  // Desktop variant
  if (variant === 'desktop') {
    return (
      <div className="flex flex-col h-full bg-backgroundDark">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-tinderOrange to-uttippPurple flex items-center justify-center text-white font-bold">
            {groupId ? <Users className="w-5 h-5" /> : getUserInfo(buddyId || 'mock-user-2').avatar}
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {groupId ? 'Group Chat' : getUserInfo(buddyId || 'mock-user-2').name}
            </h3>
            <p className="text-gray-400 text-sm">
              {groupId ? '3 members online' : 'Online now'}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {displayMessages.map((msg, index) => {
            const userInfo = getUserInfo(msg.sender_id || 'mock-user-2');
            const isCurrentUser = msg.sender_id === userId;
            
            return (
              <div key={msg.id || index} className={cn(
                "flex gap-3",
                isCurrentUser && "flex-row-reverse"
              )}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-tinderOrange to-uttippPurple flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {userInfo.avatar}
                </div>
                <div className={cn(
                  "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl",
                  isCurrentUser 
                    ? "bg-gradient-to-r from-tinderOrange to-uttippPurple text-white" 
                    : "bg-gray-800 text-white"
                )}>
                  {groupId && !isCurrentUser && (
                    <p className="text-xs opacity-70 mb-1">{userInfo.name}</p>
                  )}
                  <p className="text-sm">{msg.content}</p>
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {Object.entries(msg.reactions).map(([emoji, count]) => (
                        <span key={emoji} className="text-xs bg-black/20 px-2 py-1 rounded-full">
                          {emoji} {count}
                        </span>
                      ))}
                    </div>
                  )}
                  {msg.pinned && (
                    <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
                      <Pin className="w-3 h-3" /> Pinned
                    </div>
                  )}
                </div>
                {(enableReactions || enablePinning || enableSharing) && (
                  <div className="flex flex-col gap-1 opacity-0 hover:opacity-100 transition-opacity">
                    {enableReactions && (
                      <button
                        onClick={() => setShowEmojiPickerFor(msg.id)}
                        className="p-1 text-gray-400 hover:text-white rounded"
                      >
                        <Smile className="w-4 h-4" />
                      </button>
                    )}
                    {enablePinning && (
                      <button
                        onClick={() => handlePin(msg.id)}
                        className="p-1 text-gray-400 hover:text-white rounded"
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                    )}
                    {enableSharing && (
                      <button
                        onClick={() => handleShare(msg.content as string)}
                        className="p-1 text-gray-400 hover:text-white rounded"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Emoji picker */}
        {showEmojiPickerFor && (
          <div className="absolute bottom-20 left-4 bg-gray-800 rounded-lg p-2 flex gap-2 shadow-lg border border-gray-700">
            {['❤️', '👍', '😂', '😍', '🔥', '👏'].map(emoji => (
              <button
                key={emoji}
                onClick={() => handleReaction(showEmojiPickerFor, emoji)}
                className="p-2 hover:bg-gray-700 rounded text-lg hover:scale-110 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-full border border-gray-700 focus:border-tinderOrange focus:outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-tinderOrange to-uttippPurple text-white flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mobile variant
  return (
    <div className="flex flex-col h-full bg-backgroundDark text-white">
      {/* Mobile header */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-tinderOrange to-uttippPurple flex items-center justify-center text-white text-sm font-bold">
          {groupId ? <Users className="w-4 h-4" /> : getUserInfo(buddyId || 'mock-user-2').avatar}
        </div>
        <h3 className="text-white font-medium">
          {groupId ? 'Group Chat' : getUserInfo(buddyId || 'mock-user-2').name}
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {displayMessages.map((msg, index) => {
          const isCurrentUser = msg.sender_id === userId;
          const userInfo = getUserInfo(msg.sender_id || 'mock-user-2');
          
          return (
            <div key={msg.id || index} className={cn(
              "flex gap-2",
              isCurrentUser && "flex-row-reverse"
            )}>
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-tinderOrange to-uttippPurple flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {userInfo.avatar}
              </div>
              <div className={cn(
                "max-w-[75%] px-3 py-2 rounded-2xl",
                isCurrentUser 
                  ? "bg-gradient-to-r from-tinderOrange to-uttippPurple text-white" 
                  : "bg-gray-800 text-white"
              )}>
                {groupId && !isCurrentUser && (
                  <p className="text-xs opacity-70 mb-1">{userInfo.name}</p>
                )}
                <p className="text-sm">{msg.content}</p>
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {Object.entries(msg.reactions).map(([emoji, count]) => (
                      <span key={emoji} className="text-xs bg-black/20 px-2 py-1 rounded-full">
                        {emoji} {count}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Mobile input */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-full border border-gray-700 focus:border-tinderOrange focus:outline-none text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-tinderOrange to-uttippPurple text-white flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
