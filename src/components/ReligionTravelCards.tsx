import React from 'react';

export const ReligionTravelCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[
        { title: "Bodh Gaya", query: "bodhgaya buddhist temple" },
        { title: "Mecca", query: "mecca hajj pilgrimage" },
        { title: "Amritsar", query: "amritsar golden temple" },
        { title: "Lumbini", query: "lumbini birthplace of buddha" },
        { title: "Vatican City", query: "vatican st peters basilica" },
        { title: "Paro", query: "paro taktsang bhutan" },
        { title: "Tirupati", query: "tirupati balaji temple" },
        { title: "Jerusalem", query: "jerusalem old city religion" },
        { title: "Lourdes", query: "lourdes catholic pilgrimage" },
        { title: "Varanasi", query: "varanasi ganges spirituality" },
        { title: "Mount Kailash", query: "kailash tibet sacred mountain" },
        { title: "Kyoto", query: "kyoto shrines temples" },
        { title: "Angkor Wat", query: "angkor wat temple cambodia" },
        { title: "Golden Temple", query: "sikh golden temple amritsar" },
        { title: "Assisi", query: "assisi st francis italy" },
        { title: "Lalibela", query: "lalibela rock churches ethiopia" },
        { title: "Touba", query: "touba grand mosque senegal" },
        { title: "Salt Lake Temple", query: "salt lake temple utah mormon" },
        { title: "Bagan", query: "bagan myanmar buddhist temples" },
        { title: "Mont-Saint-Michel", query: "mont saint michel france monastery" },
        { title: "Fatima", query: "fatima portugal sanctuary" },
        { title: "Nazareth", query: "nazareth basilica annunciation" },
        { title: "Santiago de Compostela", query: "santiago pilgrimage church" },
        { title: "Chartres", query: "chartres cathedral france" },
        { title: "Kashi Vishwanath", query: "kashi vishwanath temple varanasi" },
        { title: "Uman", query: "uman ukraine hasidic pilgrimage" },
        { title: "Basilica of Guadalupe", query: "guadalupe mexico basilica" },
        { title: "Shwedagon Pagoda", query: "shwedagon pagoda yangon" },
        { title: "Sri Pada", query: "sri pada adam's peak sri lanka" },
        { title: "Tashilhunpo Monastery", query: "tashilhunpo monastery tibet" },
        { title: "Kumbh Mela", query: "kumbh mela hindu festival" },
        { title: "Mount Athos", query: "mount athos monasteries greece" },
        { title: "Canterbury", query: "canterbury cathedral england" },
        { title: "Rila Monastery", query: "rila monastery bulgaria" },
        { title: "Etchmiadzin", query: "etchmiadzin cathedral armenia" },
        { title: "St. Catherine's Monastery", query: "saint catherine monastery sinai" },
        { title: "Sarnath", query: "sarnath buddha sermon site" },
        { title: "Ajmer Sharif", query: "ajmer sharif dargah india" },
        { title: "Haifa Bahai", query: "bahai gardens haifa israel" },
        { title: "Potala Palace", query: "potala palace lhasa tibet" }
      ].map(({ title, query }, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 bg-white"
        >
          <div className="aspect-[4/3] bg-gray-200">
            {/* Image will be injected by Lovable from Envato using the query */}
            <img
              src={`/images/religion/${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.jpg`}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
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