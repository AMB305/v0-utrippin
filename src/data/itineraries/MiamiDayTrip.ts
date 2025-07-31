// itineraries/MiamiDayTrip.ts
export const miamiDayTrip = {
  title: "🌴 Miami Day Trip – Budget Friendly Adventure",
  date: "July 31, 2025",
  heroImage: {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    alt: "South Beach, Miami"
  },
  introMessage:
    "Hey there! ✨ Here's how to explore Miami for a day and have an amazing time. Whether you're in for just the sunshine or thinking about staying overnight, Keila's got you covered!",
  bookingButtons: [
    { label: "Book Flights", link: "https://utrippin.ai/flights" },
    { label: "Book Hotels", link: "https://utrippin.ai/hotels" }
  ],
  summary:
    "A quick, sunny escape to Miami — packed with beaches, art, culture, and good eats. Customize it your way: stay the night or make it a one-day splash.",
  dailyPlan: [
    {
      day: "Day 1 – Miami in a Flash!",
      sections: [
        {
          time: "☀️ Morning",
          activities: [
            "✈️ Arrive at MIA (Miami International Airport) around 8–9 AM.",
            "☕ Grab Cuban coffee at **La Colada Gourmet** (Little Havana, $).",
            "🌊 Head to **South Beach** – walk Ocean Drive, relax by the beach, people-watch."
          ]
        },
        {
          time: "🍴 Lunch",
          activities: [
            "🍽️ Dine at **Versailles Restaurant** in Little Havana – classic Cuban eats on a budget (~$15–$20)."
          ]
        },
        {
          time: "🎨 Afternoon",
          activities: [
            "🖼️ Explore **Wynwood Walls** – famous for colorful street art and galleries.",
            "🛍️ Visit **Bayside Marketplace** for shopping, dining, and waterfront views."
          ]
        },
        {
          time: "🌆 Evening",
          activities: [
            "🌇 Sunset stroll along South Pointe Park or Brickell Key.",
            "✈️ Depart from MIA or check into a hotel if staying overnight."
          ]
        }
      ]
    }
  ],
  hotelOptions: {
    prompt: "Thinking of extending your adventure with an overnight stay?",
    recommendation: [
      "🏨 Choose hotels in **South Beach** for beach vibes, or near **MIA** for convenience.",
      "🔗 [Search hotels on Utrippin](https://utrippin.ai/hotels)"
    ]
  },
  attractions: [
    {
      name: "South Beach",
      image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b",
      description: "Iconic beachfront with art deco buildings, cafes, and white sands."
    },
    {
      name: "Wynwood Walls",
      image: "https://images.unsplash.com/photo-1570498839593-e565b39455f4",
      description: "A vibrant open-air museum of street art in the Wynwood district."
    },
    {
      name: "Bayside Marketplace",
      image: "https://images.unsplash.com/photo-1549924231-f129b911e442",
      description: "Shopping and dining destination with waterfront views and live music."
    },
    {
      name: "Versailles Restaurant",
      image: "https://images.unsplash.com/photo-1598511727563-00855f2b4d95",
      description: "Famous Cuban eatery in Little Havana serving authentic dishes since 1971."
    }
  ],
  budgetBreakdown: {
    table: [
      { category: "Flights", estimatedCost: "$100 - $300" },
      { category: "Hotel (optional)", estimatedCost: "$75 - $150" },
      { category: "Food", estimatedCost: "$40 - $75" },
      { category: "Activities", estimatedCost: "$20 - $40" },
      { category: "Transport", estimatedCost: "$30 - $50" }
    ],
    total: "$190 - $615 (with hotel)"
  },
  keilaTips: [
    "🎒 Pack light: A small backpack with sunscreen, water, and a hat is all you need.",
    "🚌 Use public transport like Metrorail or ride-shares to stay budget-friendly.",
    "☕ Cafecito break: Grab a Cuban espresso shot in Little Havana for a local experience.",
    "📸 Photo tip: Best light for South Beach shots is around 9–10 AM or 6 PM sunset."
  ]
};