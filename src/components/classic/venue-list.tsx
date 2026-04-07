"use client";

import { useGame } from "@/lib/game-context";
import { VenueCard } from "./venue-card";

export function VenueList() {
  const { venues, selectedVenueId, setSelectedVenueId } = useGame();

  return (
    <div
      className="flex h-full flex-col gap-2 overflow-y-auto pr-2"
      role="list"
      aria-label="Venue list"
    >
      {venues.map((venue) => (
        <div key={venue.id} role="listitem">
          <VenueCard
            venue={venue}
            isSelected={selectedVenueId === venue.id}
            onClick={() => setSelectedVenueId(selectedVenueId === venue.id ? null : venue.id)}
          />
        </div>
      ))}
    </div>
  );
}
