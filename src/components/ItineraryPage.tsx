import React, { useState } from "react";
import { motion } from "framer-motion";

interface TripData {
  title: string;
  date: string;
  heroImage: {
    src: string;
    alt: string;
  };
  introMessage: string;
  bookingButtons: Array<{
    label: string;
    link: string;
  }>;
  summary: string;
  dailyPlan: Array<{
    day: string;
    sections: Array<{
      time: string;
      activities: string[];
    }>;
  }>;
  hotelOptions: {
    prompt: string;
    recommendation: string[];
  };
  attractions: Array<{
    name: string;
    image: string;
    description: string;
  }>;
  budgetBreakdown: {
    table: Array<{
      category: string;
      estimatedCost: string;
    }>;
    total: string;
  };
  keilaTips: string[];
}

interface ItineraryPageProps {
  trip: TripData;
}

export default function ItineraryPage({ trip }: ItineraryPageProps) {
  const [activeTab, setActiveTab] = useState("itinerary");

  return (
    <div className="bg-background min-h-screen text-foreground font-sans">
      <header className="relative w-full h-64 overflow-hidden">
        <img
          src={trip.heroImage.src}
          alt={trip.heroImage.alt}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            {trip.title}
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <motion.p
          className="text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {trip.introMessage}
        </motion.p>

        <div className="flex gap-4">
          {trip.bookingButtons.map((btn, idx) => (
            <a
              key={idx}
              href={btn.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition"
            >
              {btn.label}
            </a>
          ))}
        </div>

        <div className="flex gap-4 mt-6 border-b border-border">
          {["itinerary", "attractions", "budget", "tips"].map(tab => (
            <button
              key={tab}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === tab 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "itinerary" && (
          <div className="space-y-4">
            {trip.dailyPlan.map((day, i) => (
              <div key={i}>
                <h2 className="text-xl font-semibold mb-4">{day.day}</h2>
                <div className="space-y-3">
                  {day.sections.map((section, j) => (
                    <motion.div
                      key={j}
                      className="p-4 bg-card rounded-lg shadow border"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: j * 0.1 }}
                    >
                      <h3 className="font-medium text-card-foreground mb-2">{section.time}</h3>
                      <ul className="list-disc ml-6 text-sm mt-2 space-y-1">
                        {section.activities.map((activity, k) => (
                          <li key={k} dangerouslySetInnerHTML={{ __html: activity }} />
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "attractions" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trip.attractions.map((place, i) => (
              <motion.div
                key={i}
                className="rounded-lg overflow-hidden shadow border bg-card"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <img src={place.image} alt={place.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h4 className="font-semibold text-card-foreground">{place.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{place.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "budget" && (
          <motion.div 
            className="bg-card p-6 rounded-lg shadow border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold mb-4">Budget Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 font-medium">Category</th>
                    <th className="text-left py-3 font-medium">Estimated Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {trip.budgetBreakdown.table.map((row, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-2">{row.category}</td>
                      <td className="py-2 font-medium">{row.estimatedCost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="font-semibold text-lg">Total: {trip.budgetBreakdown.total}</p>
            </div>
          </motion.div>
        )}

        {activeTab === "tips" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold mb-4">Keila's Tips</h3>
            <ul className="space-y-3">
              {trip.keilaTips.map((tip, i) => (
                <motion.li 
                  key={i} 
                  className="flex items-start gap-3 p-3 bg-card rounded-lg border"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="text-primary font-medium">💡</span>
                  <span className="text-sm">{tip}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
}