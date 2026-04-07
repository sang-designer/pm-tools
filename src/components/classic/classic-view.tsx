"use client";

import { useState } from "react";
import { UserProfileCard } from "@/components/user-profile-card";
import { VenueList } from "./venue-list";
import { VenueTable } from "./venue-table";
import { SearchFilters } from "./search-filters";
import { MapPanel } from "./map-panel";
import { LeaderboardDrawer } from "./leaderboard-drawer";
import { InviteButton } from "@/components/invite/invite-button";
import { InviteModal } from "@/components/invite/invite-modal";
import { RewardBanner } from "@/components/invite/reward-banner";
import { ContextualInviteBanner } from "@/components/invite/contextual-invite-banner";
import { useInviteTrigger } from "@/lib/invite-context";
import { Button } from "@/components/ui/button";
import { Settings2, List, Map } from "lucide-react";

export function ClassicView() {
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [needsReviewOnly, setNeedsReviewOnly] = useState(false);
  const { showTrigger, triggerMessage, dismissTrigger } = useInviteTrigger();

  return (
    <div className="relative px-4 py-4 sm:px-8 lg:px-12">
      <RewardBanner />

      <h1 className="mb-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
        Welcome, Sang
      </h1>

      <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-stretch" data-guide="profile">
        <div className="flex-1 h-32">
          <UserProfileCard />
        </div>
        <div className="flex w-full shrink-0 flex-col lg:w-[304px] -mt-4">
          <div className="lg:px-4">
            <h3 className="my-1 text-base font-medium text-foreground">Quick Links</h3>
          </div>
          <nav className="flex flex-1 gap-4 lg:flex-col lg:gap-1.5 lg:px-4" aria-label="Quick links">
            <a href="/add-place" className="text-sm text-primary hover:underline">Add a new place</a>
            <a href="#" className="text-sm text-primary hover:underline">My suggestions</a>
            <button onClick={() => setLeaderboardOpen(true)} className="text-sm text-primary hover:underline text-left">Leaderboard</button>
            <div>
              <InviteButton variant="inline" onClick={() => setInviteOpen(true)} />
            </div>
          </nav>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Foursquare Places
        </h2>
        <Button variant="outline" className="gap-2 border-primary text-primary">
          <Settings2 className="size-4" aria-hidden="true" />
          Filter
        </Button>
      </div>

      <div className="mb-4">
        <SearchFilters needsReviewOnly={needsReviewOnly} onNeedsReviewChange={setNeedsReviewOnly} />
      </div>

      <div className="relative">
        {viewMode === "map" ? (
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-0" style={{ minHeight: "400px", height: "calc(100vh - 340px)" }}>
            <div className="w-full shrink-0 lg:w-[476px]" data-guide="venue-list">
              <VenueList />
            </div>
            <div className="hidden flex-1 overflow-hidden rounded-2xl lg:block relative z-0" data-guide="map">
              <MapPanel needsReviewOnly={needsReviewOnly} />
            </div>
          </div>
        ) : (
          <div style={{ minHeight: "400px" }}>
            <p className="mb-4 text-sm text-muted-foreground">
              Click on a place below to start voting on other users&apos; edits, or provide feedback about a specific place by using the search bar above.
            </p>
            <VenueTable />
          </div>
        )}

        <div className="pointer-events-none sticky bottom-6 z-10 flex justify-center">
          <button
            onClick={() => setViewMode(viewMode === "map" ? "list" : "map")}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-sm text-background shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            {viewMode === "map" ? (
              <>
                <List className="size-4" aria-hidden="true" />
                List view
              </>
            ) : (
              <>
                <Map className="size-4" aria-hidden="true" />
                Map view
              </>
            )}
          </button>
        </div>
      </div>

      <ContextualInviteBanner
        visible={showTrigger}
        message={triggerMessage}
        onInvite={() => { dismissTrigger(); setInviteOpen(true); }}
        onDismiss={dismissTrigger}
      />

      <LeaderboardDrawer open={leaderboardOpen} onOpenChange={setLeaderboardOpen} onInvite={() => { setLeaderboardOpen(false); setInviteOpen(true); }} />
      <InviteModal open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
}
