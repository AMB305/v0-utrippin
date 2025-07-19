import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DuffelOffer {
  id: string;
  slices: { origin: { iata_code: string }, destination: { iata_code: string }}[];
  total_amount: string;
  total_currency: string;
}

interface DuffelOrder {
  id: string;
  booking_reference: string;
  payment_status?: string;
}

export default function DuffelFlightsTest() {
  const [offers, setOffers] = useState<DuffelOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<DuffelOffer | null>(null);
  const [order, setOrder] = useState<DuffelOrder | null>(null);
  const [error, setError] = useState<string>("");

  const searchFlights = async () => {
    setLoading(true);
    setError("");
    setOrder(null);
    setSelectedOffer(null);

    try {
      const { data, error } = await supabase.functions.invoke('duffel-test', {
        body: {
          action: 'search_flights',
          data: {
            origin: 'JFK',
            destination: 'LHR',
            departure_date: '2025-08-15'
          }
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setOffers(data.offers || []);
    } catch (err: any) {
      setError("Failed to fetch flights. Check console.");
      console.error("Duffel search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const createOrderHold = async (offerId: string) => {
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const { data, error } = await supabase.functions.invoke('duffel-test', {
        body: {
          action: 'create_order',
          data: {
            offer_id: offerId
          }
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      console.log("Duffel order created:", data.order);
      setOrder({
        id: data.order.id,
        booking_reference: data.order.booking_reference || "awaiting_payment",
        payment_status: "pending"
      });
    } catch (err: any) {
      setError("Failed to create order. Check console.");
      console.error("Duffel order error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto bg-card shadow-soft rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-foreground">Duffel Flights Test (Hold Only)</h1>

          <button
            className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary-hover transition-colors font-medium"
            onClick={searchFlights}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search Flights JFK → LHR"}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          <div className="mt-8 space-y-4">
            {offers.map((offer) => {
              const basePrice = parseFloat(offer.total_amount);
              const connectionFee = 25;
              const totalPrice = basePrice + connectionFee;
              
              return (
                <div key={offer.id} className="border border-border rounded-lg p-6 bg-card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-lg font-semibold text-foreground mb-2">
                        {offer.slices[0].origin.iata_code} → {offer.slices[0].destination.iata_code}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          Flight: {basePrice.toFixed(2)} {offer.total_currency}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Utrippin Ticketing: {connectionFee.toFixed(2)} {offer.total_currency}
                        </div>
                        <div className="text-2xl font-bold text-primary border-t pt-2">
                          Total: {totalPrice.toFixed(2)} {offer.total_currency}
                        </div>
                      </div>
                    </div>
                    <button
                      className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors"
                      onClick={() => createOrderHold(offer.id)}
                      disabled={loading}
                    >
                      Hold this flight
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {order && (
            <div className="mt-8 p-6 border border-secondary rounded-lg bg-secondary/10">
              <h2 className="text-xl font-bold mb-4 text-foreground">Order Created Successfully</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Status:</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {order.booking_reference}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Order ID:</span>
                  <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{order.id}</span>
                </div>
                {order.payment_status && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Payment Status:</span>
                    <span>{order.payment_status}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  This is a hold only. No ticket issued yet. Check the console for the full order object.
                </p>
              </div>
            </div>
          )}

          {offers.length === 0 && !loading && !error && (
            <div className="mt-8 text-center py-8 text-muted-foreground">
              Click "Search Flights" to start testing the Duffel API integration.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}