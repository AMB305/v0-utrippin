import { useState, useEffect } from "react";
import extraTrips from "@/data/extraTrips.json";

interface Trip {
  name: string;
  description: string;
  link: string;
  image: string;
  category: string;
}

interface ExtraTripsData {
  usaTrips: Trip[];
  worldTrips: Trip[];
  funExperiences: Trip[];
}

export const useExtraTrips = (): ExtraTripsData => {
  const [tripsData, setTripsData] = useState<ExtraTripsData>({
    usaTrips: [],
    worldTrips: [],
    funExperiences: []
  });

  useEffect(() => {
    // Filter trips by category
    const usaTrips = extraTrips.filter(trip => trip.category === "usa");
    const worldTrips = extraTrips.filter(trip => trip.category === "world");
    const funExperiences = extraTrips.filter(trip => trip.category === "fun");

    setTripsData({
      usaTrips,
      worldTrips,
      funExperiences
    });
  }, []);

  return tripsData;
};
