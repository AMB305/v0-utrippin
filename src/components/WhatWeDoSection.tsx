import React from 'react';

const WhatWeDoSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-bold mb-6 text-gray-900">WHAT WE DO AND<br/>WHY WE DO IT</h2>
            <p className="text-sm text-gray-500 mb-8 uppercase tracking-wide">EMPOWERING ACCESSIBLE TRAVEL FOR ALL</p>
            
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                At Utrippin, we believe that travel should be accessible to everyone, regardless of their budget or background. We built this platform specifically for the underserved community, breaking down barriers that have traditionally kept people from exploring the world.
              </p>
              <p>
                Our mission is simple yet powerful: to show everyone that they can travel, no matter their financial situation. Through innovative AI-powered deal discovery, community support, and expert guidance, we're democratizing travel one trip at a time.
              </p>
              <p>
                We understand that travel isn't just about luxury - it's about connection, growth, and the transformative power of experiencing different cultures and perspectives. That's why we're committed to making these experiences accessible to all.
              </p>
            </div>
            
            <button className="mt-8 bg-black text-white px-8 py-3 text-sm font-medium tracking-wider hover:bg-gray-800 transition-colors">
              LEARN MORE ABOUT US
            </button>
          </div>
          <div className="relative">
            <div 
              className="h-96 bg-cover bg-center"
              style={{
                backgroundImage: `url('/lovable-uploads/877d1de4-ac1f-4e83-b4e7-daa282840b44.png')`
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;