import React from "react";
import { useSearchParams } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { useTripsFlights } from "../hooks/useTripsFlights";
import { useTripComHotels } from "../hooks/useTripComHotels";
import { useTripComCars } from "../hooks/useTripComCars";
import { SmartImage } from "@/components/SmartImage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GlobalKeilaBubble } from "@/components/GlobalKeilaBubble";

export interface TripsPageProps {
  duffelFlights?: any[];
  origin?: string;
  destination?: string;
  departDate?: string;
  returnDate?: string;
  passengers?: string;
}

export default function Trips(props: TripsPageProps) {
  const [searchParams] = useSearchParams();
  
  // Get parameters from props or URL parameters with fallbacks
  const searchData = {
    origin: props.origin || searchParams.get('origin') || 'FLL',
    destination: props.destination || searchParams.get('destination') || 'STX',
    departDate: props.departDate || searchParams.get('departDate') || '2025-07-26',
    returnDate: props.returnDate || searchParams.get('returnDate') || '2025-08-11',
    passengers: props.passengers || searchParams.get('passengers') || '1'
  };

  // Load unified flights (Duffel + Trip.com)
  const { flights, loading: loadingFlights } = useTripsFlights(searchData);
  
  const { tripComHotels, loading: loadingHotels } = useTripComHotels(
    searchData.destination,
    searchData.departDate,
    searchData.returnDate,
    searchData.passengers
  );
  
  const { tripComCars, loading: loadingCars } = useTripComCars(
    searchData.destination,
    searchData.departDate,
    searchData.returnDate
  );

  const handleBookNow = (flight: any) => {
    if (flight.source === 'Duffel') {
      // Direct booking flow
      window.location.href = `/flight-booking?offer_id=${flight.offerId}`;
    } else if (flight.source === 'Trip.com') {
      // Open affiliate deep link
      window.open(flight.deepLink, '_blank');
    }
  };

  return (
    <>
      <SEOHead 
        title={`Trip to ${searchData.destination} - Compare Flights, Hotels & Cars | Utrippin.ai`}
        description={`Plan your trip from ${searchData.origin} to ${searchData.destination}. Compare flights, hotels and car rentals all in one place. Find the best deals for your ${searchData.departDate} to ${searchData.returnDate} journey.`}
        canonical={`https://utrippin.ai/trips?origin=${searchData.origin}&destination=${searchData.destination}&departDate=${searchData.departDate}&returnDate=${searchData.returnDate}`}
        keywords={`${searchData.destination} travel, ${searchData.origin} to ${searchData.destination} flights, ${searchData.destination} hotels, ${searchData.destination} car rental`}
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "TripPlan",
              "name": `Trip from ${searchData.origin} to ${searchData.destination}`,
              "description": `Complete travel package from ${searchData.origin} to ${searchData.destination}`,
              "startDate": searchData.departDate,
              "endDate": searchData.returnDate,
              "destination": {
                "@type": "Place",
                "name": searchData.destination
              },
              "departureLocation": {
                "@type": "Place", 
                "name": searchData.origin
              }
            },
            {
              "@type": "WebPage",
              "@id": `https://utrippin.ai/trips#webpage`,
              "url": `https://utrippin.ai/trips`,
              "name": `Trip to ${searchData.destination} - Compare Flights, Hotels & Cars | Utrippin.ai`,
              "description": `Plan your trip from ${searchData.origin} to ${searchData.destination}. Compare flights, hotels and car rentals all in one place.`,
              "inLanguage": "en-US"
            }
          ]
        }}
      />
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero / Trip Summary */}
      <div className="bg-cover bg-center h-64 flex items-center justify-center text-white"
           style={{ backgroundImage: "url('https://source.unsplash.com/1600x400/?travel,beach,flight')" }}>
        <div className="bg-black bg-opacity-50 p-4 rounded">
          <h1 className="text-3xl font-bold mb-2">
            Your Trip: {searchData.origin} → {searchData.destination}
          </h1>
          <p>{searchData.departDate} to {searchData.returnDate} • {searchData.passengers} traveler{searchData.passengers !== "1" ? "s" : ""}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-10">
        {/* Unified Flights Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">✈ Flights</h2>
          
          {loadingFlights && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading flights...</p>
            </div>
          )}

          {!loadingFlights && flights.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No flights found for your search.
            </div>
          )}

          {!loadingFlights && flights.length > 0 && (
            <div className="space-y-4">
              {flights.map((flight, idx) => (
                <div key={idx} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-lg">
                        {flight.origin} ➔ {flight.destination}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {flight.passengers} passenger{flight.passengers !== "1" ? "s" : ""}
                      </div>
                      <div className="mt-2">
                        <div>Departure: <strong>{flight.departTime}</strong> {flight.departDate}</div>
                        <div>Return: <strong>{flight.returnTime}</strong> {flight.returnDate}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">${flight.price}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {flight.source === 'Duffel' ? (
                          <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded">
                            ✅ Direct booking with Utrippin
                          </span>
                        ) : (
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            🔗 Powered by Trip.com, official affiliate of Utrippin!
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleBookNow(flight)}
                        className="mt-3 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hotels */}
        {tripComHotels.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">🏨 Hotels in {searchData.destination}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tripComHotels.map((hotel, idx) => (
                <div key={idx} className="border rounded-lg shadow p-4 hover:shadow-lg transition">
                  <SmartImage
                    destination={searchData.destination}
                    description={`luxury hotel in ${searchData.destination}`}
                    tags={["hotel", "accommodation"]}
                    className="rounded mb-3 w-full h-48 object-cover"
                    alt={hotel.hotelName}
                  />
                  <p className="font-semibold">{hotel.hotelName}</p>
                  <p>{hotel.checkIn} - {hotel.checkOut}</p>
                  <p className="text-primary font-bold mt-2">${hotel.price} / night</p>
                  <a
                    href={`https://hotellook.com/?marker=650105`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition"
                  >
                    View Hotels
                  </a>
                  <p className="mt-1 text-xs text-muted-foreground">Powered by Trip.com, official affiliate of Utrippin!</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cars */}
        {tripComCars.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">🚗 Car Rentals in {searchData.destination}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tripComCars.map((car, idx) => (
                <div key={idx} className="border rounded-lg shadow p-4 hover:shadow-lg transition">
                  <SmartImage
                    destination={searchData.destination}
                    description={`car rental in ${searchData.destination}`}
                    tags={["car", "rental", "travel"]}
                    className="rounded mb-3 w-full h-48 object-cover"
                    alt={car.carType}
                  />
                  <p className="font-semibold">{car.carType}</p>
                  <p>{car.pickup} - {car.dropoff}</p>
                  <p className="text-primary font-bold mt-2">${car.price} / day</p>
                  <a
                    href={`https://localrent.com/?marker=650105`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition"
                  >
                    View Cars
                  </a>
                  <p className="mt-1 text-xs text-muted-foreground">Powered by Trip.com, official affiliate of Utrippin!</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
      <GlobalKeilaBubble />
    </div>
    </>
  );
}
