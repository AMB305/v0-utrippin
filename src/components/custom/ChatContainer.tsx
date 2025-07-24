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

const MOCK_USER = '00000000-0000-0000-0000-000000000001';
const MOCK_BUDDY = '00000000-0000-0000-0000-000000000002';

export const ChatContainer = ({
  userId = MOCK_USER,
  buddyId = MOCK_BUDDY,
  variant = 'desktop',
  enableReactions = true,
  enablePinning = true,
  enableSharing = true
}: Props) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();

    const channel = supabase
      .channel('chat-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'travel_chat',
        filter: `receiver_id=eq.${userId}`
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
  }, [userId, buddyId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadMessages() {
    const { data, error } = await supabase
      .from('travel_chat')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('sent_at', { ascending: true });

    if (!error && data) {
      const filtered = data.filter(
        (m: ChatMessage) =>
          (m.sender_id === userId && m.receiver_id === buddyId) ||
          (m.receiver_id === userId && m.sender_id === buddyId)
      );
      setMessages(filtered);
    }
  }

  async function sendMessage() {
    if (!newMessage.trim()) return;

    const userText = newMessage.trim();
    setNewMessage('');

    try {
      // 1️⃣ Insert user message
      const { error: userError } = await supabase.from('travel_chat').insert({
        sender_id: userId,
        receiver_id: buddyId,
        message: userText
      });

      if (userError) {
        console.error('Error sending user message:', userError);
        return;
      }

      // 2️⃣ Show "Keila is thinking..." 
      setIsLoading(true);

      // 3️⃣ Call the AI endpoint
      const response = await supabase.functions.invoke('ai-travel-chat', {
        body: { 
          message: userText,
          sessionId: `${userId}-${buddyId}` 
        }
      });

      let aiReply = "I'm sorry, I'm having trouble responding right now. Please try again later!";
      
      if (response.data && !response.error) {
        // Try to extract a simple text response from the AI
        if (typeof response.data === 'string') {
          aiReply = response.data;
        } else if (response.data.response) {
          aiReply = response.data.response;
        } else if (response.data.summary) {
          aiReply = response.data.summary;
        } else if (response.data.title) {
          aiReply = response.data.title;
        }
      } else {
        console.error('AI response error:', response.error);
      }

      // 4️⃣ Insert Keila's reply back into Supabase
      const { error: aiError } = await supabase.from('travel_chat').insert({
        sender_id: buddyId, // Keila's response
        receiver_id: userId,
        message: aiReply
      });

      if (aiError) {
        console.error('Error sending AI reply:', aiError);
      }

      // 5️⃣ Hide loading and refresh messages
      setIsLoading(false);
      loadMessages(); // Reload to show both messages

    } catch (error) {
      console.error('Error in sendMessage:', error);
      setIsLoading(false);
    }
  }

  const containerStyles = variant === 'mobile'
    ? 'h-[60vh] overflow-y-auto px-4 pt-4'
    : 'h-[30vh] overflow-y-auto px-4 pt-2';

  return (
    <div className="flex flex-col bg-zinc-900 rounded-xl border border-white/10 shadow-xl">
      <div className={containerStyles}>
        {messages.map(msg => (
          <div key={msg.id} className={`mb-3 flex ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative max-w-sm px-4 py-2 rounded-lg text-sm whitespace-pre-wrap shadow-md ${msg.sender_id === userId ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-white'}`}>
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
        ))}

        {/* Keila is thinking... indicator */}
        {isLoading && (
          <div className="mb-3 flex justify-start">
            <div className="bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm italic text-gray-400">
              Keila is thinking...
            </div>
          </div>
        )}

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
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};