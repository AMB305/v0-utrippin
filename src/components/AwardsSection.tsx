import React from 'react';

const AwardsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
              "UTRIPPIN PRIDES ITSELF ON MEETING CUSTOMERS EVERY BUDGET NEED OR DESIRE"
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Budget Traveller</h3>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
              "TRAVEL EXPERT VOTED AS A TOP BUDGET TRAVEL MASTER IN 2024"
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Travel Report</h3>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
              "A TOP 10 BUDGET OPERATOR IN TRAVEL + LEISURE WORLD'S BEST AWARDS 2024"
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">TRAVEL+ LEISURE</h3>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
              "VOTED AS ONE OF THE BEST BUDGET SPECIALISTS IN THE 2024 READERS' CHOICE AWARDS"
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Budget Traveller</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;