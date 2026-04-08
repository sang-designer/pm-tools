"use client";

import { useParams, useRouter } from "next/navigation";
import { MOCK_VENUES } from "@/lib/mock-data";
import { GlobalNav } from "@/components/global-nav";
import { PhotoGallery } from "@/components/venue/photo-gallery";
import { VenueInfoCard } from "@/components/venue/venue-info-card";
import { DetailsTable } from "@/components/venue/details-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Search,
  BookOpen,
  SquarePen,
  Share2,
  History,
  Unplug,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

function VisitorDots({ count, max = 5, filled = true }: { count: number; max?: number; filled?: boolean }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < count ? (filled ? "text-primary" : "text-primary/40") : "text-muted-foreground/30"}>
          📍
        </span>
      ))}
    </span>
  );
}

export default function VenueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const venueId = params.id as string;
  const venue = MOCK_VENUES.find((v) => v.id === venueId);
  const [infoOpen, setInfoOpen] = useState(true);

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

  const d = venue.detail;
  const allVenueIds = MOCK_VENUES.map((v) => v.id);
  const currentIndex = allVenueIds.indexOf(venueId);
  const nextId = currentIndex < allVenueIds.length - 1 ? allVenueIds[currentIndex + 1] : null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav activeTab="Home" />

      <PhotoGallery venueId={venueId} />

      <div className="mx-auto w-full max-w-[1500px] py-6 px-3 sm:px-10">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {venue.name}
          </h1>
          <span className="inline-flex size-5 items-center justify-center rounded bg-green-500 text-xs text-white">✓</span>
        </div>
        <p className="mt-2 text-base text-foreground">
          {venue.category} | {venue.address}
        </p>

        {d && (
          <div className="mt-3 hidden flex-col gap-1 text-base text-foreground sm:flex sm:flex-row sm:flex-wrap sm:gap-0">
            <span>Unique Visitors: <VisitorDots count={d.uniqueVisitors ?? 0} /></span>
            <span className="hidden sm:inline">{" | "}</span>
            <span>Total check-ins: <VisitorDots count={d.totalCheckins ?? 0} /></span>
            <span className="hidden sm:inline">{" | "}</span>
            <span>Visited last 60 days: <VisitorDots count={d.visitedLast60Days ?? 0} filled={false} /></span>
          </div>
        )}

        <div className="mt-6 hidden flex-wrap items-center gap-4 sm:flex">
          <ActionLink icon={<Search className="size-4" />} label="Search the web" />
          <ActionLink icon={<BookOpen className="size-4" />} label="Best practices" />
          <ActionLink icon={<SquarePen className="size-4" />} label="View/Edit this place" />
          <ActionLink icon={<Share2 className="size-4" />} label="Share this place" />
          <ActionLink icon={<History className="size-4" />} label="Edit history" />
          <ActionLink icon={<Unplug className="size-4" />} label="Connect to OSM">
            <ChevronDown className="size-4" />
          </ActionLink>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col gap-4 sm:gap-8 lg:flex-row">
          <div className="flex-1 min-w-0">
            <div className="hidden sm:block">
              <Tabs defaultValue="reviews">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 overflow-x-auto">
                    <TabsList className="w-auto">
                      <TabsTrigger value="reviews">Reviews</TabsTrigger>
                      <TabsTrigger value="photos">Photos (67)</TabsTrigger>
                      <TabsTrigger value="admin">Admin</TabsTrigger>
                    </TabsList>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
                      <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
                      <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" />
                      <line x1="17" y1="16" x2="23" y2="16" />
                    </svg>
                    Filter
                  </Button>
                </div>
              </Tabs>
            </div>

            <div className="sm:mt-6">
              <DetailsTable venue={venue} />
            </div>
          </div>

          <div className="lg:block">
            <Collapsible open={infoOpen} onOpenChange={setInfoOpen}>
              <CollapsibleTrigger className="mb-2 flex w-full items-center gap-2 sm:hidden">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Venue info
                </h2>
                <ChevronDown className={`size-5 text-muted-foreground transition-transform ${infoOpen ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="sm:!block sm:!h-auto sm:!overflow-visible">
                <VenueInfoCard venue={venue} />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>

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
    </div>
  );
}

function ActionLink({ icon, label, children }: { icon: React.ReactNode; label: string; children?: React.ReactNode }) {
  return (
    <button className="flex min-h-[44px] items-center gap-1 text-sm font-medium text-primary hover:opacity-80 sm:min-h-0">
      {icon}
      <span>{label}</span>
      {children}
    </button>
  );
}
