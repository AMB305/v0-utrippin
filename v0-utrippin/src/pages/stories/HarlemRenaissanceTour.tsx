import StoryLayout from "../../components/StoryLayout"

export default function HarlemRenaissanceTour() {
  return (
    <StoryLayout
      title="Harlem Renaissance Walking Tour"
      excerpt="Step into the vibrant world of the Harlem Renaissance, where jazz filled the air, literary genius flourished, and Black culture experienced an unprecedented creative explosion. These walking tours bring history to life on the very streets where it happened."
      author="Marcus Williams"
      readTime="6 min read"
      publishDate="January 18, 2025"
      category="Culture"
      heroImage="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=1200&h=600&fit=crop"
      seoKeywords={["Harlem Renaissance", "walking tour", "jazz history", "African American culture", "Harlem NYC", "literary tour", "cultural heritage", "Black history"]}
    >
      {/* Introduction */}
      <div className="mb-8">
        <img 
          src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=400&fit=crop"
          alt="Historic Harlem street scene"
          className="w-full h-64 object-cover rounded-lg mb-6 shadow-md"
        />
        <p className="text-lg leading-relaxed mb-6 text-gray-800">
          The Harlem Renaissance of the 1920s and 1930s represents one of the most significant cultural movements in American history. This "New Negro Movement" transformed a neighborhood in upper Manhattan into the cultural capital of Black America, producing legendary artists, writers, musicians, and intellectuals whose influence continues today.
        </p>
      </div>

      {/* Tour Routes */}
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Explore Harlem's Cultural Legacy</h2>
      
      {/* Literary Route */}
      <div className="mb-12">
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-semibold text-blue-800 mb-4">The Literary Route</h3>
            <p className="text-lg leading-relaxed mb-4 text-gray-800">
              Follow in the footsteps of literary giants who called Harlem home. This route takes you to the residences, gathering places, and institutions where some of America's greatest writers crafted works that changed literature forever.
            </p>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">Key Literary Sites:</h4>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Langston Hughes House:</strong> 20 East 127th Street - Former home of the celebrated poet</li>
                <li><strong>Schomburg Center:</strong> Research library preserving Black history and culture</li>
                <li><strong>Countee Cullen Library:</strong> Named after the Renaissance poet</li>
                <li><strong>Zora Neale Hurston Way:</strong> Street honoring the "Their Eyes Were Watching God" author</li>
              </ul>
            </div>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop"
              alt="Literary heritage sites in Harlem"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Jazz Route */}
      <div className="mb-12">
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop"
              alt="Jazz venues and music heritage"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="md:col-span-2">
            <h3 className="text-2xl font-semibold text-green-800 mb-4">Jazz and Music Heritage</h3>
            <p className="text-lg leading-relaxed mb-4 text-gray-800">
              Experience the birthplace of legendary jazz venues where Duke Ellington, Count Basie, and Billie Holiday performed. Many of these historic sites still host live music today.
            </p>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">Historic Music Venues:</h4>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Apollo Theater:</strong> Legendary venue where stars were born</li>
                <li><strong>Cotton Club site:</strong> Famous jazz club location (142nd & Lenox)</li>
                <li><strong>Minton's Playhouse:</strong> Birthplace of bebop jazz</li>
                <li><strong>Savoy Ballroom site:</strong> "Home of Happy Feet" dance hall</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tour Guide */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-xl mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Tour Options & Experiences</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-purple-800">Guided Tour Options</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h4 className="font-semibold text-gray-900">Harlem Heritage Tours</h4>
                <p className="text-sm text-gray-600 mt-1">Local historian-led walks with family stories</p>
                <p className="text-sm text-blue-600 mt-2 font-semibold">$25-35 per person</p>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h4 className="font-semibold text-gray-900">Big Onion Walking Tours</h4>
                <p className="text-sm text-gray-600 mt-1">Academic-style historical tours</p>
                <p className="text-sm text-blue-600 mt-2 font-semibold">$20-30 per person</p>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h4 className="font-semibold text-gray-900">Harlem Spirituals</h4>
                <p className="text-sm text-gray-600 mt-1">Music-focused gospel and jazz tours</p>
                <p className="text-sm text-blue-600 mt-2 font-semibold">$45-65 per person</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Best Times to Visit</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">1</span>
                <div>
                  <strong className="text-gray-900">Sunday Mornings:</strong> Experience authentic gospel church services at historic churches
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="text-gray-900">Weekend Afternoons:</strong> Vibrant street life and community activities
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="text-gray-900">Evening Tours:</strong> Experience current jazz venues and nightlife
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Dining Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Authentic Harlem Dining</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600&h=300&fit=crop"
              alt="Soul food and Harlem restaurants"
              className="w-full h-48 object-cover rounded-lg shadow-md mb-4"
            />
            <p className="text-lg leading-relaxed text-gray-800">
              Complete your cultural journey with authentic Harlem soul food at legendary establishments that have fed the community for generations.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Must-Try Restaurants:</h4>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h5 className="font-semibold text-gray-900">Sylvia's Restaurant</h5>
                <p className="text-sm text-gray-600">Soul food institution since 1962</p>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h5 className="font-semibold text-gray-900">Amy Ruth's</h5>
                <p className="text-sm text-gray-600">Famous for chicken and waffles</p>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h5 className="font-semibold text-gray-900">Red Rooster</h5>
                <p className="text-sm text-gray-600">Modern Harlem classics by Marcus Samuelsson</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conclusion */}
      <div className="border-l-4 border-purple-500 pl-6 bg-purple-50 py-6 rounded-r-lg">
        <p className="text-lg leading-relaxed text-gray-800">
          Walking through Harlem today, you'll find a neighborhood that honors its Renaissance legacy while continuing to evolve. These tours offer more than sightseeing—they provide a chance to connect with a pivotal moment in American cultural history and understand how the Harlem Renaissance continues to influence art, music, literature, and social justice movements worldwide.
        </p>
      </div>
    </StoryLayout>
  )
}
