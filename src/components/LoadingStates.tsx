import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Plane, MapPin, Calendar } from 'lucide-react';

export const CardSkeleton = () => (
  <Card className="w-full">
    <CardContent className="p-6">
      <div className="space-y-4">
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const ExperienceCardSkeleton = () => (
  <Card className="w-full">
    <CardContent className="p-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-4">
          <Skeleton className="h-64 lg:h-56 w-full rounded-l-lg" />
        </div>
        <div className="lg:col-span-8 p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-18" />
            </div>
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-8 w-20" />
              </div>
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const SearchLoadingSpinner = ({ message = "Searching..." }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <div className="relative">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <Plane className="h-4 w-4 text-blue-500 absolute -top-1 -right-1" />
    </div>
    <p className="text-lg font-medium text-muted-foreground">{message}</p>
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <MapPin className="h-4 w-4" />
      <span>Finding the best experiences for you...</span>
    </div>
  </div>
);

export const GridLoadingSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <CardSkeleton key={index} />
    ))}
  </div>
);

export const ListLoadingSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-6">
    {Array.from({ length: count }).map((_, index) => (
      <ExperienceCardSkeleton key={index} />
    ))}
  </div>
);

export const FilterLoadingSkeleton = () => (
  <div className="space-y-6">
    {Array.from({ length: 6 }).map((_, index) => (
      <Card key={index}>
        <CardContent className="p-4">
          <Skeleton className="h-5 w-24 mb-3" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const PageSkeleton = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-24" />
    </div>
    <div className="flex gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-20" />
      ))}
    </div>
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export const PageLoadingWrapper = ({ children, loading }: { children: React.ReactNode, loading: boolean }) => {
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <FilterLoadingSkeleton />
            </div>
            <div className="lg:col-span-3">
              <ListLoadingSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Export all components as a namespace for easier importing
export const LoadingStates = {
  CardSkeleton,
  ExperienceCardSkeleton,
  SearchLoadingSpinner,
  GridLoadingSkeleton,
  ListLoadingSkeleton,
  FilterLoadingSkeleton,
  PageSkeleton,
  PageLoadingWrapper,
};