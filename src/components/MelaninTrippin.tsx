import { Link } from "react-router-dom";

export default function MelaninTrippin() {
  return (
    <section 
      className="relative min-h-[500px] sm:min-h-[600px] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/lovable-uploads/55c9029a-d3a1-4fb1-b1dd-12aefc25a39c.png')"
      }}
    >
      {/* Enhanced dark gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
      
      {/* Container */}
      <div className="relative h-full min-h-[500px] sm:min-h-[600px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bottom Left Corner Layout - Both Mobile and Desktop */}
        <div className="absolute bottom-6 left-4 sm:bottom-8 sm:left-8">
          <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            <div>MELANIN</div>
            <div>&</div>
            <div>TRIPPIN</div>
          </div>
          
          <Link 
            to="/melanin"
            className="inline-block bg-yellow-400 text-black font-bold px-6 py-3 rounded-lg text-base hover:bg-yellow-300 transition-colors"
          >
            LEARN MORE
          </Link>
        </div>
        
      </div>
    </section>
  );
}