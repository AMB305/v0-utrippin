import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Badge } from './badge';
import { useSupabase } from '../../hooks/useSupabase';

export default function NotificationBadge({ className }) {
  const [count, setCount] = useState(0);
  const { user, supabase } = useSupabase();
  
  useEffect(() => {
    if (!user) return;
    
    // Initial fetch of notification count
    const fetchNotificationCount = async () => {
      try {
        const { data, error } = await supabase.rpc(
          'get_unread_notification_count',
          { user_id: user.id }
        );
        
        if (error) throw error;
        setCount(data || 0);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    
    fetchNotificationCount();
    
    // Subscribe to notification changes
    const channel = supabase
      .channel('notification_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'travel_buddy_notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchNotificationCount();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase]);
  
  if (count === 0) {
    return (
      <Bell className={`h-5 w-5 ${className || ''}`} />
    );
  }
  
  return (
    <div className="relative">
      <Bell className={`h-5 w-5 ${className || ''}`} />
      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[1.25rem] h-5 flex items-center justify-center rounded-full px-1">
        {count > 99 ? '99+' : count}
      </Badge>
    </div>
  );
}