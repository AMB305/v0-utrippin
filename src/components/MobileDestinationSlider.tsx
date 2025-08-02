import { Button } from "@/components/ui/button";
import { VecteezyImage } from "@/components/VecteezyImage";
import saintCroixImage from "@/assets/saint-croix-virgin-islands.jpg";
import lasVegasImage from "@/assets/las-vegas-nevada.jpg";
import lakePlacidImage from "@/assets/lake-placid-new-york.jpg";
import orlandoImage from "@/assets/orlando-florida.jpg";
import sanJuanImage from "@/assets/san-juan-puerto-rico.jpg";
import fortLauderdaleImage from "@/assets/fort-lauderdale-florida.jpg";

const destinations = [
  {
    name: "Saint Croix",
    country: "U.S. Virgin Islands",
    image: saintCroixImage,
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Saint+Croix%2C+U.S.+Virgin+Islands&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Book Hotels in Saint Croix, U.S. Virgin Islands | UTrippin & Expedia Official"
  },
  {
    name: "Las Vegas",
    country: "United States",
    image: lasVegasImage,
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Las+Vegas%2C+Nevada&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Las Vegas Hotels & Resorts | Book with UTrippin + Expedia"
  },
  {
    name: "Lake Placid",
    country: "United States", 
    image: lakePlacidImage,
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Lake+Placid%2C+New+York&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Lake Placid Hotels & Cabins | UTrippin Official Partner with Expedia"
  },
  {
    name: "Orlando",
    country: "United States",
    image: orlandoImage,
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Orlando%2C+Florida&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Orlando Hotels Near Disney & Universal | UTrippin + Expedia"
  },
  {
    name: "San Juan",
    country: "Puerto Rico",
    image: sanJuanImage,
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=San+Juan%2C+Puerto+Rico&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Book Hotels in San Juan, Puerto Rico | UTrippin x Expedia"
  },
  {
    name: "Fort Lauderdale",
    country: "United States",
    image: fortLauderdaleImage,
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Fort+Lauderdale%2C+Florida&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Fort Lauderdale Beach Hotels | Official UTrippin & Expedia"
  }
];

const MobileDestinationSlider = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Recommended for You
        </h3>
        <Button variant="link" className="text-blue-600 text-sm p-0">
          See more
        </Button>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        {destinations.map((destination, index) => (
          <a
            key={index}
            href={destination.expediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 block"
            title={destination.seoTitle}
          >
            <div className="relative w-40 h-52 rounded-2xl overflow-hidden mb-3 shadow-lg">
              <VecteezyImage 
                destination={destination.name}
                description={`beautiful travel destination in ${destination.country}`}
                tags={[destination.name.toLowerCase(), destination.country.toLowerCase(), 'travel', 'vacation']}
                fallbackImage={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-sm font-semibold text-white mb-1">
                  {destination.name}
                </p>
                <p className="text-xs text-white/80">
                  {destination.country}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default MobileDestinationSlider;
