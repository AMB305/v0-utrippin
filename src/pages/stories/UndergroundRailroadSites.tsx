import StoryLayout from "../../components/StoryLayout"

export default function UndergroundRailroadSites() {
  return (
    <StoryLayout
      title="Underground Railroad Sites You Can Visit Today"
      excerpt="Educational travel to preserved Underground Railroad stations, safe houses, and freedom routes that helped enslaved people escape to liberty."
      author="Dr. Samuel Davis"
      readTime="12 min read"
      publishDate="January 25, 2025"
      category="History"
      heroImage="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=1200&h=600&fit=crop"
      seoKeywords={["Underground Railroad", "slavery history", "freedom sites", "historical tourism"]}
    >
      <div className="mb-8">
        <p className="text-lg leading-relaxed mb-6 text-gray-800">
          The Underground Railroad was a vast network of secret routes and safe houses that helped enslaved people escape to freedom.
        </p>
      </div>
    </StoryLayout>
  )
}
