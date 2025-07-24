// ChatContainer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessage {
  id: string;
  message: string;
  sender_id: string;
  receiver_id: string;
  sent_at: string;
  pinned?: boolean;
  reactions?: any;
  created_at?: string;
}

interface Props {
  userId?: string;
  buddyId?: string;
  variant?: 'mobile' | 'desktop';
  enableReactions?: boolean;
  enablePinning?: boolean;
  enableSharing?: boolean;
}

import { useAuth } from '@/hooks/useAuth';
import { KeilaThinking } from '@/components/KeilaThinking';

// Keila AI Assistant ID (fixed for all users)
const KEILA_AI_ID = '00000000-0000-0000-0000-000000000002';

export const ChatContainer = ({
  userId,
  buddyId = KEILA_AI_ID,
  variant = 'desktop',
  enableReactions = true,
  enablePinning = true,
  enableSharing = true
}: Props) => {
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Use authenticated user ID or provided userId
  const currentUserId = userId || user?.id;

  useEffect(() => {
    if (!currentUserId) return;
    
    loadMessages();

    const channel = supabase
      .channel('chat-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'travel_chat',
        filter: `receiver_id=eq.${currentUserId}`
      }, payload => {
        const newMsg = payload.new as ChatMessage;
        if (newMsg.sender_id === buddyId) {
          setMessages(prev => [...prev, newMsg]);
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [currentUserId, buddyId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadMessages() {
    if (!currentUserId) return;
    
    console.log('🔄 Loading messages for userId:', currentUserId, 'buddyId:', buddyId);
    
    const { data, error } = await supabase
      .from('travel_chat')
      .select('*')
      .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
      .order('sent_at', { ascending: true });

    console.log('📨 Raw messages from DB:', data);
    console.log('❌ Load messages error:', error);

    if (!error && data) {
      const filtered = data.filter(
        (m: ChatMessage) =>
          (m.sender_id === currentUserId && m.receiver_id === buddyId) ||
          (m.receiver_id === currentUserId && m.sender_id === buddyId)
      );
      console.log('✅ Filtered messages:', filtered);
      setMessages(filtered);
    } else if (error) {
      console.error('Error loading messages:', error);
    }
  }

  async function sendMessage() {
    console.log('🚀 SEND MESSAGE FUNCTION CALLED!');
    if (!newMessage.trim() || !currentUserId) return;

    const userText = newMessage.trim();
    console.log('📤 Sending message:', userText);
    console.log('👤 User ID:', currentUserId);
    console.log('🤖 Buddy ID:', buddyId);
    
    setNewMessage(''); // Clear input immediately

    try {
      // 1️⃣ Insert user message
      console.log('💾 Attempting to insert user message...');
      const { data: insertData, error: userError } = await supabase.from('travel_chat').insert({
        sender_id: currentUserId,
        receiver_id: buddyId,
        message: userText
      }).select();

      console.log('💾 Insert result:', { insertData, userError });

      if (userError) {
        console.error('❌ Error sending user message:', userError);
        setNewMessage(userText);
        return;
      }

      // Immediately reload messages to show user message
      console.log('🔄 Loading messages after user insert...');
      await loadMessages();

      // 2️⃣ Show "Keila is thinking..." 
      setIsLoading(true);

      // 3️⃣ Call the AI endpoint
      console.log('🤖 Calling AI endpoint...');
      const response = await supabase.functions.invoke('ai-travel-chat', {
        body: { 
          message: userText,
          sessionId: `${currentUserId}-${buddyId}` 
        }
      });

      console.log('🤖 AI response:', response);

      let aiReply = "I'm sorry, I'm having trouble responding right now. Please try again later!";
      
      if (response.data && !response.error) {
        console.log('🤖 Processing AI response data:', response.data);
        
        // Handle structured response from ai-travel-chat
        if (typeof response.data === 'string') {
          aiReply = response.data;
        } else if (response.data.response) {
          // Main response field from ai-travel-chat
          aiReply = response.data.response;
        } else if (response.data.detailedItinerary) {
          // Detailed itinerary response
          const itinerary = response.data.detailedItinerary;
          if (itinerary.summary) {
            aiReply = itinerary.summary;
          } else if (itinerary.title) {
            aiReply = `${itinerary.title}\n\n${itinerary.recommendations?.map(r => 
              `${r.category_name}: ${r.places?.map(p => p.name).join(', ') || 'Various options'}`
            ).join('\n') || 'Recommendations available'}`;
          }
        } else if (response.data.trips && response.data.trips.length > 0) {
          // Trip recommendations
          const trip = response.data.trips[0];
          aiReply = `Great! I found some options for you:\n\n${trip.name}\n${trip.summary}`;
        } else if (response.data.message) {
          // Generic message field
          aiReply = response.data.message;
        } else if (response.data.summary) {
          aiReply = response.data.summary;
        } else if (response.data.title) {
          aiReply = response.data.title;
        } else {
          // Log the structure for debugging
          console.warn('🤖 Unhandled AI response structure:', Object.keys(response.data));
          aiReply = "I received your message but I'm having trouble formatting my response. Let me try again - what would you like to know about travel?";
        }
      } else {
        console.error('AI response error:', response.error);
        aiReply = "I'm experiencing some technical difficulties. Please try asking your question again!";
      }

      console.log('🤖 AI reply to insert:', aiReply);

      // 4️⃣ Insert Keila's reply back into Supabase
      const { data: aiInsertData, error: aiError } = await supabase.from('travel_chat').insert({
        sender_id: buddyId, // Keila's response
        receiver_id: currentUserId,
        message: aiReply
      }).select();

      console.log('🤖 AI insert result:', { aiInsertData, aiError });

      if (aiError) {
        console.error('Error sending AI reply:', aiError);
      }

      // 5️⃣ Hide loading and refresh messages
      setIsLoading(false);
      console.log('🔄 Final message reload...');
      await loadMessages();

    } catch (error) {
      console.error('💥 Unexpected error in sendMessage:', error);
      setIsLoading(false);
      setNewMessage(userText);
    }
  }

  const containerStyles = variant === 'mobile'
    ? 'h-[60vh] overflow-y-auto px-4 pt-4'
    : 'h-[30vh] overflow-y-auto px-4 pt-2';

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="flex flex-col bg-zinc-900 rounded-xl border border-white/10 shadow-xl">
        <div className={containerStyles}>
          <div className="flex items-center justify-center h-full">
            <div className="text-white/60">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="flex flex-col bg-zinc-900 rounded-xl border border-white/10 shadow-xl">
        <div className={containerStyles}>
          <div className="flex items-center justify-center h-full text-center px-4">
            <div className="text-white/80">
              <p className="mb-2">Please sign in to chat with Keila</p>
              <a href="/auth" className="text-blue-400 hover:text-blue-300 underline">
                Sign In
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-zinc-900 rounded-xl border border-white/10 shadow-xl">
      <div className={containerStyles}>
        {messages.map((msg, index) => (
          <div key={msg.id}>
            <div className={`mb-3 flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}>
              <div className={`relative max-w-sm px-4 py-2 rounded-lg text-sm whitespace-pre-wrap shadow-md ${msg.sender_id === currentUserId ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-white'}`}>
                {msg.message}
                <div className="text-[10px] text-right mt-1 text-gray-400">
                  {formatDistanceToNow(new Date(msg.sent_at), { addSuffix: true })}
                </div>
                <div className="absolute -top-2 -right-2 flex gap-1">
                  {enablePinning && <button title="Pin" className="text-xs bg-zinc-700 px-1 rounded">📌</button>}
                  {enableReactions && <button title="React" className="text-xs bg-zinc-700 px-1 rounded">😊</button>}
                  {enableSharing && <button title="Share" className="text-xs bg-zinc-700 px-1 rounded">🔗</button>}
                </div>
              </div>
            </div>
            
            {/* Show AI quick replies and buttons only for AI messages */}
            {msg.sender_id !== currentUserId && msg.message.includes('would you like to travel') && (
              <div className="mb-3 flex flex-wrap gap-2 justify-start ml-2">
                {['Plan a weekend getaway', 'Plan a week-long vacation', 'Inspire me with destinations', 'Budget-friendly trip', 'Luxury travel'].map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => setNewMessage(reply)}
                    className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded-full transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Show clarifying question quick replies for destination-specific responses */}
            {msg.sender_id !== currentUserId && msg.message.includes('To create the perfect itinerary') && (
              <div className="mb-3 flex flex-wrap gap-2 justify-start ml-2">
                {['1-3 days', '4-7 days', '1-2 weeks', 'Budget-friendly', 'Mid-range', 'Luxury'].map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => setNewMessage(reply)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-full transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Show follow-up action buttons */}
            {msg.sender_id !== currentUserId && index === messages.length - 1 && (
              <div className="mb-3 flex flex-wrap gap-2 justify-start ml-2">
                <button
                  onClick={() => setNewMessage('Tell me about nightlife options')}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded-full transition-colors"
                >
                  Nightlife & Entertainment
                </button>
                <button
                  onClick={() => setNewMessage('What movies are playing and where are the malls?')}
                  className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded-full transition-colors"
                >
                  Movies & Shopping
                </button>
                <button
                  onClick={() => setNewMessage('Add travel buddy')}
                  className="px-3 py-1 bg-orange-600 hover:bg-orange-500 text-white text-xs rounded-full transition-colors"
                >
                  Add Travel Buddy
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Keila is thinking... indicator */}
        {isLoading && <KeilaThinking />}

        <div ref={chatEndRef} />
      </div>

      <div className="border-t border-white/10 p-4 flex gap-2">
        <input
          className="flex-1 bg-zinc-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          onClick={() => {
            console.log('🔘 BUTTON CLICKED!');
            sendMessage();
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};