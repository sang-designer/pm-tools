"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MOCK_VENUES } from "@/lib/mock-data";
import { GlobalNav } from "@/components/global-nav";
import { PhotoGallery } from "@/components/venue/photo-gallery";
import { VenueInfoCard } from "@/components/venue/venue-info-card";
import { DetailsTable } from "@/components/venue/details-table";
import { CategoriesSection } from "@/components/venue/categories-section";
import { VenuePhotos } from "@/components/venue/venue-photos";
import { VenueAdmin } from "@/components/venue/venue-admin";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FilterDrawer, FilterState } from "@/components/classic/filter-drawer";
import { toast } from "sonner";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Search,
  BookOpen,
  SquarePen,
  Share2,
  History,
  ChevronDown,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

export default function VenueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const venueId = params.id as string;
  const venue = MOCK_VENUES.find((v) => v.id === venueId);
  const [infoOpen, setInfoOpen] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ selected: new Set() });

  if (!venue) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <GlobalNav activeTab="Home" />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Venue not found.</p>
        </div>
      </div>
    );
  }

  const allVenueIds = MOCK_VENUES.map((v) => v.id);
  const currentIndex = allVenueIds.indexOf(venueId);
  const nextId = currentIndex < allVenueIds.length - 1 ? allVenueIds[currentIndex + 1] : null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav activeTab="Home" />

      <PhotoGallery venueId={venueId} />

      <div className="mx-auto w-full max-w-[1500px] px-3 py-6 sm:px-10">
        {/* Compact header */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {venue.name}
          </h1>
          <span className="inline-flex size-5 items-center justify-center rounded bg-green-500 text-xs text-white">
            ✓
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {venue.category} | {venue.address}
        </p>
        {venue.parentVenue && (
          <p className="mt-1 text-sm text-muted-foreground">
            At:{" "}
            <Link
              href={`/venue/${venue.parentVenue.id}`}
              className="font-medium text-primary hover:underline"
            >
              {venue.parentVenue.name}
            </Link>
          </p>
        )}

        {/* Action links row */}
        <div className="mt-4 hidden flex-wrap items-center gap-4 sm:flex">
          <ActionLink icon={<Search className="size-3.5" />} label="Search the Web" />
          <ActionLink icon={<BookOpen className="size-3.5" />} label="Best Practices" />
          <ActionLink icon={<SquarePen className="size-3.5" />} label="View/Edit this Place" />
          <ActionLink icon={<History className="size-3.5" />} label="Edit History" />
          <ActionLink icon={<Share2 className="size-3.5" />} label="Share this Place" />
        </div>

        {/* Main content area */}
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:gap-10">
          {/* Left: tabbed content */}
          <div className="min-w-0 flex-1">
            <Tabs defaultValue="reviews">
              {/* Tab bar + Filter */}
              <div className="mb-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="min-w-0 overflow-x-auto">
                    <TabsList variant="line" className="w-auto">
                      <TabsTrigger value="reviews" className="px-3 py-2 text-sm font-medium">Details</TabsTrigger>
                      <TabsTrigger value="photos" className="px-3 py-2 text-sm font-medium">Photos (67)</TabsTrigger>
                      <TabsTrigger value="admin" className="px-3 py-2 text-sm font-medium">Admin</TabsTrigger>
                    </TabsList>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto shrink-0 gap-2"
                    onClick={() => setFilterOpen(true)}
                  >
                    <SlidersHorizontal className="size-4" />
                    Filters
                    {filters.selected.size > 0 && (
                      <span className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {filters.selected.size}
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              {/* Reviews / Details tab */}
              <TabsContent value="reviews" className="mt-0">
                <DetailsTable venue={venue} />
                <div className="mt-6">
                  <CategoriesSection venue={venue} />
                </div>
              </TabsContent>

              {/* Photos tab */}
              <TabsContent value="photos" className="mt-0">
                <VenuePhotos venue={venue} />
              </TabsContent>

              {/* Admin tab */}
              <TabsContent value="admin" className="mt-0">
                <VenueAdmin venue={venue} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: sidebar */}
          <div className="lg:block">
            <Collapsible open={infoOpen} onOpenChange={setInfoOpen}>
              <CollapsibleTrigger className="mb-2 flex w-full items-center gap-2 sm:hidden">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Venue info
                </h2>
                <ChevronDown
                  className={`size-5 text-muted-foreground transition-transform ${infoOpen ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="sm:!block sm:!h-auto sm:!overflow-visible">
                <VenueInfoCard venue={venue} />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="sticky bottom-0 z-30 border-t border-border bg-background px-3 py-4 sm:px-10">
        <div className="mx-auto flex max-w-[1500px] items-center justify-end">
          <Button
            className="h-12 gap-2 sm:h-10"
            onClick={() => {
              toast.success("Submitted! We'll review your changes shortly.");
              if (nextId) {
                setTimeout(() => router.push(`/venue/${nextId}`), 1200);
              }
            }}
            disabled={!nextId}
          >
            Save and go to next place
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
      {/* Filter drawer */}
      <FilterDrawer
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={filters}
        onApply={setFilters}
      />
    </div>
  );
}

function ActionLink({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
      {icon}
      <span>{label}</span>
    </button>
  );
}
