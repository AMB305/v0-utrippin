import React from 'react';

const AwardsSection = () => {
  const awards = [
    {
      text: "UTRIPPIN PRIDES ITSELF ON MEETING CUSTOMERS EVERY BUDGET NEED OR DESIRE",
      publication: "Budget Traveller"
    },
    {
      text: "TRAVEL EXPERT VOTED AS A TOP BUDGET TRAVEL MASTER IN 2024",
      publication: "Travel Report"
    },
    {
      text: "A TOP 10 BUDGET OPERATOR IN TRAVEL + LEISURE WORLD'S BEST AWARDS 2024",
      publication: "TRAVEL+ LEISURE"
    },
    {
      text: "VOTED AS ONE OF THE BEST BUDGET SPECIALISTS IN THE 2024 READERS' CHOICE AWARDS",
      publication: "Budget Traveller"
    }
  ];

  return (
    <section className="budget-travel-section py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {awards.map((award, index) => (
            <div key={index} className="text-center">
              <p className="text-xs text-gray-600 font-medium mb-4 leading-relaxed">
                "{award.text}"
              </p>
              <div className="text-lg font-light text-gray-900">
                {award.publication}
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination dots */}
        <div className="flex justify-center mt-12 gap-2">
          <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default AwardsSection; 