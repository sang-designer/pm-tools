"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MOCK_VENUES } from "@/lib/mock-data";
import { GlobalNav } from "@/components/global-nav";
import { PhotoGallery, PHOTO_SETS } from "@/components/venue/photo-gallery";
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
import { useGame } from "@/lib/game-context";
import {
  Search,
  BookOpen,
  SquarePen,
  Share2,
  History,
  ChevronDown,
  ArrowRight,
  SlidersHorizontal,
  MapPin,
  ArrowLeft,
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
  const { getVenueState } = useGame();

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
  const nextId = currentIndex < allVenueIds.length - 1 ? allVenueIds[currentIndex + 1] : allVenueIds[0];

  const venueState = getVenueState(venueId);
  const hasPendingTasks = venue.tasks.length > 0 && venueState !== "completed" && venueState !== "completed_globally";
  const venuePhotos = PHOTO_SETS[venueId] || PHOTO_SETS.default;

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
                <div className="mb-6 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="min-w-0 overflow-x-auto">
                      <TabsList variant="line" className="w-auto">
                        <TabsTrigger value="reviews" className="px-3 py-2 text-sm font-medium">Details</TabsTrigger>
                        <TabsTrigger value="photos" className="px-3 py-2 text-sm font-medium">Photos ({venuePhotos.length})</TabsTrigger>
                        <TabsTrigger value="admin" className="px-3 py-2 text-sm font-medium">Admin</TabsTrigger>
                      </TabsList>
                    </div>
                    {hasPendingTasks && (
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
                    )}
                  </div>
                </div>

                <TabsContent value="reviews" className="mt-0">
                  {hasPendingTasks ? (
                    <>
                      <DetailsTable venue={venue} />
                      <div className="mt-6">
                        <CategoriesSection venue={venue} />
                      </div>
                    </>
                  ) : (
                    <VenueEmptyState
                      venueName={venue.name}
                      onBackToHome={() => router.push("/")}
                    />
                  )}
                </TabsContent>
                <TabsContent value="photos" className="mt-0">
                  <VenuePhotos venue={venue} photos={venuePhotos} />
                </TabsContent>
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
          {hasPendingTasks ? (
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
          ) : (
            <Button
              className="h-12 gap-2 sm:h-10"
              onClick={() => router.push(`/venue/${nextId}`)}
            >
              <MapPin className="size-4" />
              Explore nearby places
              <ArrowRight className="size-4" />
            </Button>
          )}
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

function CelebrationIllustration() {
  return (
    <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto" aria-hidden="true">
      {/* Ground shadow */}
      <ellipse cx="90" cy="130" rx="55" ry="7" className="fill-muted/50" />

      {/* Storefront body */}
      <rect x="45" y="52" width="90" height="78" rx="4" className="fill-primary/10 stroke-primary/25" strokeWidth="1.5" />

      {/* Awning */}
      <path d="M40 52 L90 38 L140 52Z" className="fill-primary/15 stroke-primary/25" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M40 52 Q52 62 65 52 Q77 62 90 52 Q102 62 115 52 Q127 62 140 52" className="stroke-primary/30" strokeWidth="1.5" fill="none" />

      {/* Store sign */}
      <rect x="65" y="56" width="50" height="14" rx="3" className="fill-primary/20 stroke-primary/25" strokeWidth="1" />
      <line x1="74" y1="63" x2="106" y2="63" className="stroke-primary/40" strokeWidth="2" strokeLinecap="round" />

      {/* Display windows */}
      <rect x="52" y="76" width="30" height="28" rx="2" className="fill-background stroke-primary/20" strokeWidth="1" />
      <rect x="98" y="76" width="30" height="28" rx="2" className="fill-background stroke-primary/20" strokeWidth="1" />

      {/* Window shelves */}
      <line x1="54" y1="90" x2="80" y2="90" className="stroke-primary/15" strokeWidth="0.75" />
      <line x1="100" y1="90" x2="126" y2="90" className="stroke-primary/15" strokeWidth="0.75" />

      {/* Door */}
      <rect x="84" y="108" width="12" height="22" rx="2" className="fill-primary/20 stroke-primary/30" strokeWidth="1" />
      <circle cx="93" cy="120" r="1.5" className="fill-primary/50" />

      {/* Confetti */}
      <rect x="22" y="18" width="5" height="5" rx="1" className="fill-primary/60" transform="rotate(30 24 20)">
        <animateTransform attributeName="transform" type="rotate" from="0 24 20" to="360 24 20" dur="4s" repeatCount="indefinite" />
      </rect>
      <rect x="148" y="24" width="4" height="4" rx="1" className="fill-orange-400/70" transform="rotate(-20 150 26)">
        <animateTransform attributeName="transform" type="rotate" from="0 150 26" to="-360 150 26" dur="5s" repeatCount="indefinite" />
      </rect>
      <circle cx="35" cy="38" r="2.5" className="fill-amber-400/60">
        <animate attributeName="cy" values="38;33;38" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="145" cy="46" r="2" className="fill-primary/50">
        <animate attributeName="cy" values="46;41;46" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <rect x="40" y="8" width="4" height="7" rx="1" className="fill-green-400/50" transform="rotate(15 42 11)">
        <animateTransform attributeName="transform" type="rotate" from="15 42 11" to="375 42 11" dur="6s" repeatCount="indefinite" />
      </rect>
      <rect x="132" y="10" width="4" height="4" rx="4" className="fill-pink-400/60">
        <animate attributeName="cy" values="10;5;10" dur="3s" repeatCount="indefinite" />
      </rect>

      {/* Sparkle stars */}
      <path d="M158 60 L160 56 L162 60 L166 62 L162 64 L160 68 L158 64 L154 62Z" className="fill-amber-400/70">
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M18 55 L20 51 L22 55 L26 57 L22 59 L20 63 L18 59 L14 57Z" className="fill-primary/40">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

function VenueEmptyState({
  venueName,
  onBackToHome,
}: {
  venueName: string;
  onBackToHome: () => void;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-10 text-center sm:px-12 sm:py-12">
      <CelebrationIllustration />

      <h2 className="mt-6 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        No pending tasks for {venueName}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        This place is all set — the community has verified everything. Head back to the map or jump to another spot that needs your help.
      </p>

      <div className="mt-8">
        <Button variant="outline" className="gap-2" onClick={onBackToHome}>
          <ArrowLeft className="size-4" />
          Back to main page
        </Button>
      </div>
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
