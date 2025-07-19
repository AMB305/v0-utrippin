// Legacy search redirect for flights with Expedia affiliate links
export const handleLegacySearch = ({
  from,
  to,
  departDate,
  returnDate,
  adults = 1,
}: {
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  adults?: number;
}) => {
  const url = new URL("https://www.expedia.com/Flights-Search");
  url.searchParams.append("trip", "roundtrip");
  url.searchParams.append(
    "leg1",
    `from:${from},to:${to},departure:${departDate}`
  );
  url.searchParams.append(
    "leg2", 
    `from:${to},to:${from},departure:${returnDate}`
  );
  url.searchParams.append("passengers", `adults:${adults}`);
  url.searchParams.append("mode", "search");
  url.searchParams.append("affcid", "network.cj.101486313");
  url.searchParams.append("aid", "15754452");
  url.searchParams.append("camref", "1101l5dQSW");
  window.open(url.toString(), "_blank");
};

// Hotel search redirect with Expedia affiliate links
export const handleHotelSearch = ({
  destination,
  checkin,
  checkout,
  adults = 1,
}: {
  destination: string;
  checkin: string;
  checkout: string;
  adults?: number;
}) => {
  const url = new URL("https://www.expedia.com/Hotel-Search");
  url.searchParams.append("destination", destination);
  url.searchParams.append("startDate", checkin);
  url.searchParams.append("endDate", checkout);
  url.searchParams.append("adults", adults.toString());
  url.searchParams.append("affcid", "network.cj.101486313");
  url.searchParams.append("aid", "15754452");
  url.searchParams.append("camref", "1101l5dQSW");
  window.open(url.toString(), "_blank");
};