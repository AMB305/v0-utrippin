import React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

export default function PriceTracking({ alerts = [] }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <TrendingUp className="mx-auto h-12 w-12 mb-2 text-gray-300" />
        <p>No price alerts set</p>
        <p className="text-sm">Set up alerts to track price changes!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.slice(0, 3).map((alert) => (
        <div key={alert.id} className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">{alert.route}</div>
              <div className="text-xs text-gray-500">{alert.date}</div>
            </div>
            <div className="flex items-center gap-2">
              {alert.trend === 'down' ? (
                <TrendingDown className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-600" />
              )}
              <span className="font-bold text-sm">${alert.price}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}