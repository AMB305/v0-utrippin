import StoryLayout from "../../components/StoryLayout"

export default function BlackBeachTowns() {
  return (
    <StoryLayout
      title="Black Beach Towns: Martha's Vineyard to Sag Harbor"
      excerpt="Discover historic Black beach communities along the East Coast that have served as summer retreats, cultural hubs, and safe havens for generations of African American families."
      author="Amara Johnson"
      readTime="10 min read"
      publishDate="January 22, 2025"
      category="Destinations"
      heroImage="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1200&h=600&fit=crop"
      seoKeywords={["Black beach towns", "Martha's Vineyard", "Sag Harbor", "African American vacation spots", "East Coast beaches", "Black summer communities", "Oak Bluffs", "Azurest"]}
    >
      <div className="mb-8">
        <p className="text-lg leading-relaxed mb-6 text-gray-800">
          For over a century, certain coastal communities along the Eastern seaboard have served as cherished summer destinations for Black families seeking respite, recreation, and community.
        </p>
      </div>
    </StoryLayout>
  )
}