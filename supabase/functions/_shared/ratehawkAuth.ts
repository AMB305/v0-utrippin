// RateHawk API authentication utility
export function getRatehawkAuthHeader(): Headers {
  const keyId = Deno.env.get('RATEHAWK_KEY_ID');
  const apiKey = Deno.env.get('RATEHAWK_API_KEY');

  if (!keyId || !apiKey) {
    throw new Error("RateHawk API credentials are not set in environment variables.");
  }

  const encoded = btoa(`${keyId}:${apiKey}`);
  
  const headers = new Headers();
  headers.append("Authorization", `Basic ${encoded}`);
  headers.append("Content-Type", "application/json");

  return headers;
}