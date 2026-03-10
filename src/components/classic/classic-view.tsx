"use client";

import { UserProfileCard } from "@/components/user-profile-card";
import { VenueList } from "./venue-list";
import { SearchFilters } from "./search-filters";
import { MapPanel } from "./map-panel";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";

export function ClassicView() {
  return (
    <div className="px-4 py-4 sm:px-8 lg:px-12">
      <h1 className="mb-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
        Welcome, Sang
      </h1>

      <div className="mb-6 flex flex-col gap-6 lg:flex-row">
        <div className="flex-1">
          <UserProfileCard />
        </div>
        <div className="w-full shrink-0 lg:w-[304px]">
          <div className="mb-2 py-2 lg:px-4 lg:py-4">
            <h3 className="text-base font-medium text-foreground">Quick Links</h3>
          </div>
          <nav className="flex gap-4 lg:flex-col lg:gap-2 lg:px-4" aria-label="Quick links">
            <a href="#" className="text-sm text-primary hover:underline">Add a new place</a>
            <a href="#" className="text-sm text-primary hover:underline">My suggestions</a>
            <a href="#" className="text-sm text-primary hover:underline">Leaderboard</a>
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
        <SearchFilters />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-0" style={{ minHeight: "400px", height: "calc(100vh - 480px)" }}>
        <div className="w-full shrink-0 lg:w-[476px]">
          <VenueList />
        </div>
        <div className="hidden flex-1 overflow-hidden rounded-2xl lg:block">
          <MapPanel />
        </div>
      </div>
    </div>
  );
}
