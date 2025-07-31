import React, { useState } from "react";
import { motion } from "framer-motion";
import { ComprehensiveItinerary } from "@/lib/schemas";

interface ItineraryPageProps {
  trip: ComprehensiveItinerary;
}

export default function ItineraryPage({ trip }: ItineraryPageProps) {
  const [activeTab, setActiveTab] = useState("itinerary");

  return (
    <div className="bg-background min-h-screen text-foreground font-sans">
      <header className="relative w-full h-64 overflow-hidden">
        <img
          src={trip.imageCollageUrls[0] || "/placeholder.svg"}
          alt={trip.destinationCity}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            {trip.tripTitle}
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <motion.p
          className="text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {trip.introductoryMessage}
        </motion.p>

        <div className="flex gap-4">
          {Object.entries(trip.bookingModules).map(([type, module], idx) => (
            <a
              key={idx}
              href={module.defaultUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition capitalize"
            >
              Book {type}
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
                <h2 className="text-xl font-semibold mb-4">{day.day} - {day.title}</h2>
                <div className="space-y-3">
                  {day.events.map((event, j) => (
                    <motion.div
                      key={j}
                      className="p-4 bg-card rounded-lg shadow border"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: j * 0.1 }}
                    >
                      <h3 className="font-medium text-card-foreground mb-2">{event.time} - {event.title}</h3>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      )}
                      {event.location && (
                        <p className="text-xs text-muted-foreground">📍 {event.location}</p>
                      )}
                      {event.cost && (
                        <p className="text-xs text-primary font-medium">💰 {event.cost}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "attractions" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trip.additionalInfo.categoryBasedRecommendations.map((category, i) => (
              category.items.map((item, j) => (
                <motion.div
                  key={`${i}-${j}`}
                  className="rounded-lg overflow-hidden shadow border bg-card"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: j * 0.1 }}
                >
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover" />
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-card-foreground">{item.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    {item.location && (
                      <p className="text-xs text-muted-foreground mt-2">📍 {item.location}</p>
                    )}
                    {item.cost && (
                      <p className="text-xs text-primary font-medium mt-1">💰 {item.cost}</p>
                    )}
                  </div>
                </motion.div>
              ))
            ))}
          </div>
        )}

        {activeTab === "budget" && (
          <motion.div 
            className="bg-card p-6 rounded-lg shadow border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold mb-4">Estimated Costs</h3>
            <div className="space-y-4">
              {trip.dailyPlan.map((day, i) => (
                day.totalEstimatedCost && (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-border/50">
                    <span>{day.day}</span>
                    <span className="font-medium">{day.totalEstimatedCost}</span>
                  </div>
                )
              ))}
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Booking Modules:</span>
                  <div className="text-right">
                    {Object.entries(trip.bookingModules).map(([type, module]) => (
                      <div key={type} className="text-sm text-muted-foreground">
                        {module.title}: See options above
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "tips" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold mb-4">Cultural Tips & Insights</h3>
            <ul className="space-y-3">
              {trip.additionalInfo.cultureAdapter.map((tip, i) => (
                <motion.li 
                  key={i} 
                  className="p-4 bg-card rounded-lg border"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-medium">💡</span>
                    <div>
                      <h4 className="font-medium text-card-foreground mb-1">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground">{tip.content}</p>
                      <span className="text-xs text-primary mt-2 inline-block">{tip.category}</span>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
}