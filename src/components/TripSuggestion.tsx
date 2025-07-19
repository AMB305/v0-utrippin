import React from "react";
import { Plane, Hotel, Car, Search } from "lucide-react";

interface Trip {
  name: string;
  summary: string;
  flights_url?: string;
  hotels_url?: string;
  cars_url?: string;
}

export const TripSuggestion = ({
  trip,
  camref,
  onSelect,
}: {
  trip: Trip;
  camref: string;
  onSelect: () => void;
}) => {
  const buildExpediaUrl = (type: string, location: string, camref: string) =>
    `https://www.expedia.com/${type}?CAMREF=${camref}&destination=${encodeURIComponent(location)}`;

  const location = trip.name;

  return (
    <div className="bg-slate-800/40 rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/40 shadow-xl hover:shadow-2xl transition-all duration-300">
      <h3 className="text-white text-lg font-semibold mb-2">{trip.name}</h3>
      <p className="text-slate-100 mb-4 line-clamp-3">{trip.summary}</p>
      <div className="flex gap-3 items-center">
        <a
          href={buildExpediaUrl("Flights", location, camref)}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-3 transition-colors shadow-lg hover:shadow-blue-500/25"
          title="Flights"
        >
          <Plane className="h-5 w-5" />
        </a>
        <a
          href={buildExpediaUrl("Hotels", location, camref)}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-700 hover:bg-slate-600 text-white rounded-xl p-3 transition-colors shadow-lg hover:shadow-blue-500/25"
          title="Hotels"
        >
          <Hotel className="h-5 w-5" />
        </a>
        <a
          href={buildExpediaUrl("Cars", location, camref)}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-700 hover:bg-slate-600 text-white rounded-xl p-3 transition-colors shadow-lg hover:shadow-blue-500/25"
          title="Cars"
        >
          <Car className="h-5 w-5" />
        </a>
        <button
          onClick={onSelect}
          className="bg-slate-600 hover:bg-slate-500 text-white rounded-xl p-3 transition-colors shadow-lg hover:shadow-blue-500/25"
          title="View Trip Details"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};