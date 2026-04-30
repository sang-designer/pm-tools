import { Skeleton } from "@/components/ui/skeleton";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export default function ConceptALoading() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav activeTab="Concept A" />
      
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        {/* Identity Header Skeleton */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        </div>

        {/* Split-Screen Cards Skeleton */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[500px]">
            <Skeleton className="h-full rounded-lg" />
            <Skeleton className="h-full rounded-lg" />
          </div>
        </div>

        {/* Location Intelligence Skeleton */}
        <div className="sticky bottom-4">
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}