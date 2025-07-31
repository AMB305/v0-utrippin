import React from 'react';

export const MountainTravelCards = () => {
  const mountainDestinations = [
    { title: "Swiss Alps", query: "swiss alps mountains snow peaks hiking" },
    { title: "Rocky Mountains", query: "rocky mountains colorado hiking skiing" },
    { title: "Banff", query: "banff canada lake louise mountain view" },
    { title: "Dolomites", query: "dolomites italy alpine peaks" },
    { title: "Patagonia", query: "patagonia argentina mountains trekking" },
    { title: "Himalayas", query: "himalayas nepal everest trekking" },
    { title: "Mount Fuji", query: "mount fuji japan snow peak" },
    { title: "Blue Ridge Mountains", query: "blue ridge mountains north carolina fall" },
    { title: "Mount Rainier", query: "mount rainier washington national park" },
    { title: "Tatra Mountains", query: "tatra mountains poland slovakia" },
    { title: "Andes", query: "andes mountains peru chile" },
    { title: "Sierra Nevada", query: "sierra nevada california tahoe" },
    { title: "Great Smoky Mountains", query: "smoky mountains tennessee north carolina" },
    { title: "Mount Kilimanjaro", query: "mount kilimanjaro tanzania africa" },
    { title: "Whistler", query: "whistler canada ski mountain village" },
    { title: "Appalachian Mountains", query: "appalachian trail mountains east coast" },
    { title: "Jasper", query: "jasper national park canada mountains" },
    { title: "Chamonix", query: "chamonix france mont blanc" },
    { title: "Telluride", query: "telluride colorado mountain town" },
    { title: "Aspen", query: "aspen colorado ski resort" },
    { title: "Mont Blanc", query: "mont blanc alps france snow summit" },
    { title: "Mount Cook", query: "aoraki mount cook new zealand" },
    { title: "Zermatt", query: "zermatt matterhorn switzerland mountain" },
    { title: "Lake Tahoe", query: "lake tahoe california nevada mountain" },
    { title: "Snowdonia", query: "snowdonia national park wales" },
    { title: "Lofoten Islands", query: "lofoten islands norway mountains fjord" },
    { title: "Revelstoke", query: "revelstoke british columbia mountains ski" },
    { title: "Alpspitze", query: "alpspitze bavaria germany mountain" },
    { title: "Big Sky", query: "big sky montana ski mountain" },
    { title: "Mount Hood", query: "mount hood oregon snow hiking" },
    { title: "Cradle Mountain", query: "cradle mountain tasmania australia" },
    { title: "Snowmass", query: "snowmass aspen colorado skiing" },
    { title: "Queenstown", query: "queenstown new zealand adventure mountains" },
    { title: "Bryce Canyon", query: "bryce canyon utah hoodoo formations" },
    { title: "Seoraksan", query: "seoraksan national park korea mountain hike" },
    { title: "Mount Elbrus", query: "mount elbrus russia tallest peak" },
    { title: "Crested Butte", query: "crested butte colorado mountain resort" },
    { title: "Pyrenees", query: "pyrenees france spain border mountains" },
    { title: "Catlins", query: "catlins new zealand cliffs forest" },
    { title: "Trentino", query: "trentino alto adige italy mountain escape" },
    { title: "Mount Washington", query: "mount washington new hampshire" },
    { title: "Val Gardena", query: "val gardena dolomites italy ski" },
    { title: "Vail", query: "vail colorado ski resort" },
    { title: "Garmisch", query: "garmisch partenkirchen germany alps" },
    { title: "Teton Range", query: "teton range grand teton national park" },
    { title: "Bansko", query: "bansko bulgaria mountain ski town" },
    { title: "Chattanooga", query: "chattanooga tennessee lookout mountain" },
    { title: "Rila Mountains", query: "rila mountains bulgaria monastery hiking" },
    { title: "Bariloche", query: "bariloche argentina lakes mountains" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {mountainDestinations.map(({ title, query }, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 bg-white"
        >
          <div className="aspect-[4/3] bg-gray-200">
            <img
              src={`/public/images/mountains/${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.jpg`}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 text-center">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};