import StoryLayout from "../../components/StoryLayout"

export default function GreatMigrationRoutes() {
  return (
    <StoryLayout
      title="The Great Migration Routes: Tracing Our Ancestors' Journey"
      excerpt="Between 1910 and 1970, approximately six million African Americans moved from the rural South to urban areas in the North, Midwest, and West. Today, travelers can follow these historic routes and visit significant sites that tell the story of this transformative period in American history."
      author="Dr. Keisha Brown"
      readTime="8 min read"
      publishDate="January 15, 2025"
      category="History"
      heroImage="/lovable-uploads/e6e67b89-c174-45b9-87cd-97149d2bf90a.png"
      seoKeywords={["Great Migration", "African American history", "travel routes", "historical tourism", "Black heritage", "migration patterns", "civil rights", "historical sites"]}
    >
      {/* Introduction with contextual image */}
      <div className="mb-8">
        <img 
          src="https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=400&fit=crop"
          alt="Historical pathway representing the Great Migration journey"
          className="w-full h-64 object-cover rounded-lg mb-6 shadow-md"
        />
        <p className="text-lg leading-relaxed mb-6">
          The Great Migration stands as one of the most significant demographic shifts in American history. From the cotton fields of Mississippi to the steel mills of Pittsburgh, from the rural landscapes of Alabama to the bustling streets of Chicago, millions of African Americans embarked on journeys that would reshape not only their own lives but the entire cultural and economic landscape of the United States.
        </p>
        <p className="text-lg leading-relaxed">
          Today, understanding these migration patterns offers travelers a unique opportunity to connect with this pivotal chapter in American history while exploring some of the nation's most vibrant cities and meaningful historical sites.
        </p>
      </div>

      {/* Historical Context Section */}
      <div className="bg-blue-50 p-8 rounded-xl mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Historical Context: Why They Left</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-blue-800">Push Factors</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Jim Crow laws and systemic segregation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Economic exploitation and sharecropping system</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Racial violence and lynching</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Limited educational and economic opportunities</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-green-800">Pull Factors</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Industrial job opportunities in Northern cities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Better educational opportunities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Greater personal freedom and civil rights</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Established Black communities in destination cities</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* The Three Major Routes */}
      <h2 className="text-3xl font-bold text-gray-900 mb-8">The Three Major Migration Routes</h2>
      
      {/* Northern Route */}
      <div className="mb-12">
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-semibold text-blue-800 mb-4">The Northern Route</h3>
            <p className="text-lg leading-relaxed mb-4">
              This route primarily carried migrants from Mississippi, Alabama, and Tennessee to the industrial cities of the Midwest. The Illinois Central Railroad became known as the "freedom train," carrying hope-filled families northward to cities where factories promised steady wages and better lives.
            </p>
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-3">Key Statistics:</h4>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Peak Years:</strong> 1916-1930, 1940-1970</li>
                <li><strong>Primary Origins:</strong> Mississippi Delta, Alabama Black Belt, Tennessee</li>
                <li><strong>Main Destinations:</strong> Chicago, Detroit, Cleveland, Milwaukee</li>
                <li><strong>Estimated Migrants:</strong> 1.5 million people</li>
              </ul>
            </div>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop"
              alt="Chicago skyline representing Northern migration destination"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="text-xl font-semibold mb-4 text-blue-800">Must-Visit Northern Route Sites:</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-gray-900">Chicago, Illinois</h5>
              <ul className="text-gray-700 space-y-1 text-sm mt-1">
                <li>• Bronzeville neighborhood historic district</li>
                <li>• Chicago Defender newspaper building</li>
                <li>• DuSable Museum of African American History</li>
                <li>• Ida B. Wells-Barnett House</li>
                <li>• South Side Community Art Center</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900">Detroit, Michigan</h5>
              <ul className="text-gray-700 space-y-1 text-sm mt-1">
                <li>• Charles H. Wright Museum</li>
                <li>• Historic Black Bottom neighborhood sites</li>
                <li>• Ford Rouge Factory tours</li>
                <li>• Hitsville U.S.A. (Motown Museum)</li>
                <li>• Second Baptist Church</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Eastern Route */}
      <div className="mb-12">
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400&h=300&fit=crop"
              alt="Eastern cities representing migration destinations"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="md:col-span-2">
            <h3 className="text-2xl font-semibold text-green-800 mb-4">The Eastern Route</h3>
            <p className="text-lg leading-relaxed mb-4">
              Migrants from Georgia, South Carolina, North Carolina, and Florida headed to the bustling cities of the Eastern seaboard. Many found work in shipyards, steel mills, and emerging industries while building vibrant communities that would become cultural powerhouses.
            </p>
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-3">Key Statistics:</h4>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Peak Years:</strong> 1910-1940, 1950-1970</li>
                <li><strong>Primary Origins:</strong> Georgia, Carolinas, Florida, Virginia</li>
                <li><strong>Main Destinations:</strong> New York, Philadelphia, Boston, Washington D.C.</li>
                <li><strong>Estimated Migrants:</strong> 2.3 million people</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="text-xl font-semibold mb-4 text-green-800">Must-Visit Eastern Route Sites:</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-gray-900">New York City</h5>
              <ul className="text-gray-700 space-y-1 text-sm mt-1">
                <li>• Harlem Historic District</li>
                <li>• Apollo Theater</li>
                <li>• Schomburg Center for Research</li>
                <li>• Abyssinian Baptist Church</li>
                <li>• Marcus Garvey Park</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900">Philadelphia, Pennsylvania</h5>
              <ul className="text-gray-700 space-y-1 text-sm mt-1">
                <li>• African American Museum</li>
                <li>• Mother Bethel AME Church</li>
                <li>• Historic Germantown</li>
                <li>• John Coltrane House</li>
                <li>• Eastern State Penitentiary</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Western Route */}
      <div className="mb-12">
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-semibold text-purple-800 mb-4">The Western Route</h3>
            <p className="text-lg leading-relaxed mb-4">
              The western migration took people from Texas, Louisiana, and Arkansas to California and the Pacific Northwest. World War II defense industry jobs drew thousands to shipyards and aircraft factories, creating entirely new Black communities on the West Coast.
            </p>
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-3">Key Statistics:</h4>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Peak Years:</strong> 1940-1970</li>
                <li><strong>Primary Origins:</strong> Texas, Louisiana, Arkansas, Oklahoma</li>
                <li><strong>Main Destinations:</strong> Los Angeles, Oakland, Seattle, Portland</li>
                <li><strong>Estimated Migrants:</strong> 1.4 million people</li>
              </ul>
            </div>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop"
              alt="Western landscape representing migration to California"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="text-xl font-semibold mb-4 text-purple-800">Must-Visit Western Route Sites:</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-gray-900">Los Angeles, California</h5>
              <ul className="text-gray-700 space-y-1 text-sm mt-1">
                <li>• Central Avenue Jazz Historic District</li>
                <li>• California African American Museum</li>
                <li>• Dunbar Hotel</li>
                <li>• Watts Towers</li>
                <li>• Leimert Park cultural district</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900">Oakland, California</h5>
              <ul className="text-gray-700 space-y-1 text-sm mt-1">
                <li>• Oakland Museum of California</li>
                <li>• West Oakland Historic District</li>
                <li>• Bobby Hutton Park</li>
                <li>• Pullman porters memorial</li>
                <li>• Linden Street Brewery district</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Planning Your Journey */}
      <div className="bg-gray-50 p-8 rounded-xl mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Planning Your Great Migration Journey</h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Recommended Itineraries</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-blue-700">7-Day Northern Route</h4>
                <p className="text-sm text-gray-600 mt-1">Chicago → Detroit → Cleveland → Pittsburgh</p>
                <p className="text-sm text-gray-700 mt-2">Focus on industrial heritage and urban development</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-green-700">10-Day Eastern Route</h4>
                <p className="text-sm text-gray-600 mt-1">Washington D.C. → Philadelphia → New York → Boston</p>
                <p className="text-sm text-gray-700 mt-2">Explore cultural institutions and civil rights history</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-purple-700">5-Day Western Route</h4>
                <p className="text-sm text-gray-600 mt-1">Los Angeles → Oakland → Seattle</p>
                <p className="text-sm text-gray-700 mt-2">Discover West Coast Black communities and culture</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Travel Tips & Resources</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">1</span>
                <div>
                  <strong>Start with the National Museum:</strong> Begin in Washington D.C. at the National Museum of African American History and Culture for comprehensive context.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">2</span>
                <div>
                  <strong>Use the Green Book App:</strong> Download apps that show historic Black-owned businesses and safe travel routes.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">3</span>
                <div>
                  <strong>Connect with Local Communities:</strong> Reach out to historical societies and community organizations for personal stories.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">4</span>
                <div>
                  <strong>Document Your Journey:</strong> Create a photo journal or blog to share your discoveries and connect with other heritage travelers.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modern Impact */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">The Lasting Impact Today</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Cultural Renaissance</h3>
            <p className="text-gray-700 text-sm">
              Migration destinations became centers of Black culture, producing jazz, blues, literature, and art that influenced American culture nationwide.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Economic Development</h3>
            <p className="text-gray-700 text-sm">
              Black entrepreneurship flourished in Northern and Western cities, creating business districts that remain important economic centers today.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Political Power</h3>
            <p className="text-gray-700 text-sm">
              Concentrated populations in urban areas led to increased political representation and the foundation for the modern civil rights movement.
            </p>
          </div>
        </div>
      </div>

      {/* Conclusion */}
      <div className="border-l-4 border-blue-500 pl-6 bg-blue-50 py-6 rounded-r-lg">
        <p className="text-lg leading-relaxed text-gray-800">
          The Great Migration represents more than just a movement of people—it was a revolution that reshaped American society. By retracing these routes today, we honor our ancestors' courage and determination while gaining a deeper understanding of how their journeys continue to influence American culture, politics, and identity. Each city along these migration routes tells a story of hope, struggle, and triumph that remains relevant and inspiring today.
        </p>
      </div>
    </StoryLayout>
  )
}