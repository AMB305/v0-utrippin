import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const HotelResultsLoading = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <Card key={index}>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-4">
                <Skeleton className="h-48 w-full rounded-l-lg" />
              </div>
              <div className="lg:col-span-8 p-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HotelResultsLoading;