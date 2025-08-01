// src/utils/sendMessageToAI.ts
import { sendChat } from '@/api/keila';

export async function sendMessageToAI(message: string): Promise<string> {
  try {
    const response = await sendChat(message);
    return response.text || "I'm here to help with your travel plans!";
  } catch (error) {
    console.error('Error sending message to AI:', error);
    return "Sorry, I'm having trouble responding right now. Please try again.";
  }
}