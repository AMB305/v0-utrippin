import { useNavigate } from "react-router-dom";
import ProductLayout from "@/components/ProductLayout";
import FilterLayout from "@/components/FilterLayout";
import HotelSearchBar from "@/components/HotelSearchBar";
import HotelFilters from "@/components/HotelFilters";
import HotelResultsHeader from "@/components/HotelResultsHeader";
import HotelResultsLoading from "@/components/HotelResultsLoading";
import HotelResultsEmpty from "@/components/HotelResultsEmpty";
import HotelResultsList from "@/components/HotelResultsList";
import { SearchPreview } from "@/components/SearchPreview";
import { useHotelSearch } from "@/hooks/useHotelSearch";
import HotelCertificationMonitor from "@/components/HotelCertificationMonitor";

const HotelResults = () => {
  const navigate = useNavigate();
  const {
    hotels,
    loading,
    selectedHotel,
    searchData,
    searchHotels,
    handleHotelSelect,
    getDurationInNights,
    getGuestSummary,
    apiStatus
  } = useHotelSearch();

  const handleNewSearch = (newSearchData: any) => {
    const newSearchParams = new URLSearchParams({
      destination: newSearchData.destination,
      checkInDate: newSearchData.checkInDate.toISOString(),
      checkOutDate: newSearchData.checkOutDate.toISOString(),
      adults: newSearchData.guests.adults.toString(),
      children: newSearchData.guests.children.toString(),
      rooms: newSearchData.guests.rooms.toString()
    });
    
    navigate(`/hotels/results?${newSearchParams.toString()}`);
    searchHotels();
  };

  const handleHotelSelectWithNavigation = async (hotel: any) => {
    const result = await handleHotelSelect(hotel);
    
    if (result.success) {
      const bookingParams = new URLSearchParams({
        hotelId: hotel.id,
        ...(result.rateKey && { rateKey: result.rateKey }),
        destination: searchData.destination,
        checkInDate: searchData.checkInDate?.toISOString() || '',
        checkOutDate: searchData.checkOutDate?.toISOString() || '',
        adults: searchData.guests.adults.toString(),
        children: searchData.guests.children.toString(),
        rooms: searchData.guests.rooms.toString()
      });
      navigate(`/hotels/booking?${bookingParams.toString()}`);
    }
  };

  const breadcrumbs = [
    { label: "Hotels", href: "/hotels" },
    { label: "Search Results", isActive: true }
  ];

  const resultsHeader = {
    title: `Hotels in ${searchData.destination}`,
    subtitle: `${searchData.checkInDate?.toLocaleDateString()} - ${searchData.checkOutDate?.toLocaleDateString()} • ${getDurationInNights()} night${getDurationInNights() > 1 ? 's' : ''} • ${getGuestSummary()}`,
    count: hotels.length,
    sortInfo: "Sorted by our recommendations",
    apiStatus
  };

  const renderResults = () => {
    if (loading) {
      return <HotelResultsLoading />;
    }

    if (hotels.length === 0) {
      return <HotelResultsEmpty onNewSearch={() => navigate('/hotels')} />;
    }

    return (
      <HotelResultsList
        hotels={hotels}
        onSelect={handleHotelSelectWithNavigation}
        selectedHotel={selectedHotel}
      />
    );
  };

  return (
    <ProductLayout breadcrumbs={breadcrumbs}>
      <FilterLayout
        searchBar={
          <HotelSearchBar 
            onSearch={handleNewSearch} 
            loading={loading}
            initialData={searchData}
            compact={true}
          />
        }
        filters={<HotelFilters />}
        results={
          <div>
            <SearchPreview
              destination={searchData.destination}
              checkInDate={searchData.checkInDate}
              checkOutDate={searchData.checkOutDate}
              adults={searchData.guests.adults}
              children={searchData.guests.children}
              rooms={searchData.guests.rooms}
              category={searchData.category}
              dealType={searchData.dealType}
              priceRange={searchData.priceRange}
            />
            <HotelCertificationMonitor 
              hotelData={hotels}
              searchParams={searchData}
              className="mb-4"
            />
            {renderResults()}
          </div>
        }
        resultsHeader={resultsHeader}
      />
    </ProductLayout>
  );
};

export default HotelResults;