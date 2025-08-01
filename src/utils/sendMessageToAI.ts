// src/utils/sendMessageToAI.ts
import { supabase } from '@/integrations/supabase/client';

export async function sendMessageToAI(message: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('ask-keila', {
      body: { prompt: message }
    });

    if (error) {
      console.error('Supabase function error:', error);
      return "I'm having trouble connecting right now. Please try again!";
    }

    return data?.reply || "I'm here to help with your travel plans! What would you like to know?";
  } catch (error) {
    console.error('Error sending message to AI:', error);
    return "Sorry, I'm having trouble responding right now. Please try again.";
  }
}