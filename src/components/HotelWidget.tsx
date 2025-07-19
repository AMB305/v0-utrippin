import { useEffect } from "react";

export default function HotelWidget() {
  useEffect(() => {
    // Remove any existing hotel widget scripts
    const existingScripts = document.querySelectorAll('script[src*="tpwgts.com"]');
    existingScripts.forEach(script => {
      if (script.getAttribute('src')?.includes('promo_id=4038')) {
        script.remove();
      }
    });
    
    // Clear any existing widget content
    const container = document.getElementById("hotel-widget-container");
    if (container) {
      container.innerHTML = '';
    }
    
    // GA4 tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'widget_view', {
        event_category: 'tripcom_widget',
        event_label: 'HotelWidget'
      });
    }
    
    // Wait a moment then load the hotel widget script
    setTimeout(() => {
      const script = document.createElement("script");
      script.src = "https://tpwgts.com/content?trs=435440&shmarker=650105&lang=www&layout=S10391&powered_by=false&campaign_id=121&promo_id=4038";
      script.async = true;
      script.charset = "utf-8";
      
      const container = document.getElementById("hotel-widget-container");
      if (container && !container.querySelector('script')) {
        container.appendChild(script);
      }
    }, 100);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow">
      <div 
        id="hotel-widget-container" 
        className="bg-white rounded-lg overflow-hidden [&>div]:!p-0 [&>div]:!m-0 [&_.tpwl-widget]:!p-1 [&>iframe]:!border-0 [&_*]:!outline-0 [&_*[title*='Trip.com']]:!hidden [&_*[alt*='Trip.com']]:!hidden [&_*:has-text('Trip.com')]:!hidden [&_img[src*='trip.com']]:!hidden [&_a[href*='trip.com']]:!hidden [&_*:contains('Trip.com')]:!hidden [&_form]:!max-w-none [&_form]:!w-auto [&_table]:!max-w-none [&_td]:!px-1 [&_td]:!py-1 [&_.tpwl-widget_table]:!max-w-none [&_.tpwl-widget_td]:!px-1"
      ></div>
      
      {/* Partner Badge */}
      <div className="text-center text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100">
        Powered by <span className="font-semibold">Trip.com</span> — Official Utrippin Affiliate Partner
      </div>
    </div>
  );
}