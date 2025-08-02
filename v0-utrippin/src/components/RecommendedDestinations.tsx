import { Button } from "@/components/ui/button";
import saintCroixImage from "@/assets/saint-croix-virgin-islands.jpg";
import lasVegasImage from "@/assets/las-vegas-nevada.jpg";
import lakePlacidImage from "@/assets/lake-placid-new-york.jpg";
import orlandoImage from "@/assets/orlando-florida.jpg";
import sanJuanImage from "@/assets/san-juan-puerto-rico.jpg";
import fortLauderdaleImage from "@/assets/fort-lauderdale-florida.jpg";

const destinations = [
  {
    name: "Saint Croix, U.S. Virgin Islands",
    country: "United States Virgin Islands",
    image: saintCroixImage,
    slug: "saint-croix-virgin-islands",
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Saint+Croix%2C+U.S.+Virgin+Islands&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Book Hotels in Saint Croix, U.S. Virgin Islands | UTrippin & Expedia Official",
    seoDescription: "Discover the best hotels in Saint Croix with exclusive Expedia deals. Secure your stay through UTrippin, an official Expedia partner."
  },
  {
    name: "Las Vegas",
    country: "United States",
    image: lasVegasImage,
    slug: "las-vegas-nevada",
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Las+Vegas%2C+Nevada&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Las Vegas Hotels & Resorts | Book with UTrippin + Expedia",
    seoDescription: "Find top hotels in Las Vegas. Stay on the Strip or near Fremont Street. Powered by Expedia & UTrippin."
  },
  {
    name: "Lake Placid",
    country: "United States", 
    image: lakePlacidImage,
    slug: "lake-placid-new-york",
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Lake+Placid%2C+New+York&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Lake Placid Hotels & Cabins | UTrippin Official Partner with Expedia",
    seoDescription: "Book your Lake Placid adventure. Cozy cabins & lakefront stays with Expedia via UTrippin."
  },
  {
    name: "Orlando",
    country: "United States",
    image: orlandoImage,
    slug: "orlando-florida",
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Orlando%2C+Florida&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Orlando Hotels Near Disney & Universal | UTrippin + Expedia",
    seoDescription: "Find the best Orlando hotels for your Disney or Universal trip. Powered by Expedia. Official UTrippin partner."
  },
  {
    name: "San Juan",
    country: "Puerto Rico",
    image: sanJuanImage,
    slug: "san-juan-puerto-rico",
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=San+Juan%2C+Puerto+Rico&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Book Hotels in San Juan, Puerto Rico | UTrippin x Expedia",
    seoDescription: "Explore beachfront hotels & boutique stays in San Juan with UTrippin, an official Expedia partner."
  },
  {
    name: "Fort Lauderdale",
    country: "United States",
    image: fortLauderdaleImage,
    slug: "fort-lauderdale-florida",
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Fort+Lauderdale%2C+Florida&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Fort Lauderdale Beach Hotels | Official UTrippin & Expedia",
    seoDescription: "Book your stay in Fort Lauderdale. Beachfront resorts and family hotels via Expedia + UTrippin."
  },
];

const RecommendedDestinations = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Recommended Destinations for You
          </h2>
          <Button variant="link" className="text-blue-600">
            See more
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {destinations.map((destination, index) => (
            <a
              key={destination.name}
              href={destination.expediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer animate-slide-up block"
              style={{ animationDelay: `${index * 150}ms` }}
              title={destination.seoTitle}
            >
              <div className="relative overflow-hidden rounded-xl mb-4 aspect-[4/3]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${destination.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                    View Hotels
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-600 font-medium">
                  {destination.country}
                </p>
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                  {destination.name}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedDestinations;
