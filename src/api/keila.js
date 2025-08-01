// src/api/keila.js
export async function sendChat(prompt) {
  const res = await fetch('https://api.utrippin.ai/keila/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error('Chat API error');
  return res.json(); // { text, itinerary? }
}

export async function sendSpeech(blob) {
  const form = new FormData();
  form.append('file', blob, 'voice.wav');
  const res = await fetch('https://api.utrippin.ai/keila/speech', {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error('Speech API error');
  return res.json(); // { text }
}

export async function fetchInspiration() {
  const res = await fetch('https://api.utrippin.ai/keila/inspiration', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Inspiration API error');
  const data = await res.json();
  return data.prompts || []; // Return array of prompt strings
}