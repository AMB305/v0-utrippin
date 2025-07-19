import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductLayout from "@/components/ProductLayout";
import FilterLayout from "@/components/FilterLayout";
import ExperienceSearchBar from "@/components/ExperienceSearchBar";
import ExperienceFilters from "@/components/ExperienceFilters";
import ExperienceResultCard from "@/components/ExperienceResultCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for experience results
const mockExperienceResults = [
  {
    id: "1",
    title: "Skip-the-Line Louvre Museum Tour",
    location: "Paris, France",
    images: ["/placeholder.svg", "/placeholder.svg"],
    rating: 4.8,
    reviewCount: 2341,
    duration: "3 hours",
    groupSize: "Small group (max 15)",
    category: "Cultural",
    difficulty: "Easy",
    highlights: ["Skip-the-line access", "Expert guide", "Mona Lisa viewing"],
    included: ["Professional guide", "Skip-the-line tickets", "Audio headsets"],
    languages: ["English", "French", "Spanish"],
    price: 45,
    originalPrice: 60,
    currency: "$",
    discount: 25,
    availability: "Available today",
    instantConfirmation: true,
    freeCancellation: true,
    badge: "BESTSELLER",
    provider: "Paris Tours Co."
  },
  {
    id: "2",
    title: "Authentic Sushi Making Class",
    location: "Tokyo, Japan",
    images: ["/placeholder.svg"],
    rating: 4.9,
    reviewCount: 892,
    duration: "2.5 hours",
    groupSize: "Small group (max 8)",
    category: "Food & Drink",
    difficulty: "Easy",
    highlights: ["Hands-on cooking", "Traditional techniques", "Fresh ingredients"],
    included: ["All ingredients", "Cooking tools", "Sake tasting"],
    languages: ["English", "Japanese"],
    price: 85,
    currency: "$",
    availability: "Available tomorrow",
    instantConfirmation: true,
    freeCancellation: true,
    provider: "Tokyo Culinary School"
  }
];

const ExperienceResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState<typeof mockExperienceResults>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExperience, setSelectedExperience] = useState<typeof mockExperienceResults[0] | undefined>();

  const searchData = {
    location: searchParams.get('location') || '',
    date: searchParams.get('date') ? new Date(searchParams.get('date')!) : null,
    groupSize: parseInt(searchParams.get('groupSize') || '2'),
    category: searchParams.get('category') || 'any',
    duration: searchParams.get('duration') || 'any',
    timeOfDay: searchParams.get('timeOfDay') || 'any'
  };

  useEffect(() => {
    setTimeout(() => {
      setExperiences(mockExperienceResults);
      setLoading(false);
    }, 1500);
  }, []);

  const handleExperienceSelect = (experience: typeof mockExperienceResults[0]) => {
    setSelectedExperience(experience);
    const bookingParams = new URLSearchParams({
      experienceId: experience.id,
      ...Object.fromEntries(searchParams.entries())
    });
    navigate(`/experiences/booking?${bookingParams.toString()}`);
  };

  const breadcrumbs = [
    { label: "Experiences", href: "/experiences" },
    { label: "Search Results", isActive: true }
  ];

  const resultsHeader = {
    title: `Experiences in ${searchData.location}`,
    subtitle: searchData.date ? `${searchData.date.toLocaleDateString()} • ${searchData.groupSize} people` : `${searchData.groupSize} people`,
    count: experiences.length,
    sortInfo: "Sorted by popularity"
  };

  const renderResults = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {experiences.map((experience) => (
          <ExperienceResultCard
            key={experience.id}
            experience={experience}
            onSelect={handleExperienceSelect}
            selected={selectedExperience?.id === experience.id}
          />
        ))}
      </div>
    );
  };

  return (
    <ProductLayout breadcrumbs={breadcrumbs}>
      <FilterLayout
        searchBar={
          <ExperienceSearchBar 
            onSearch={() => {}}
            loading={loading}
            initialData={searchData}
            compact={true}
          />
        }
        filters={<ExperienceFilters />}
        results={renderResults()}
        resultsHeader={resultsHeader}
      />
    </ProductLayout>
  );
};

export default ExperienceResults;