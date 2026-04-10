"use client";

import { useEffect, useRef } from "react";
import { useGame } from "@/lib/game-context";
import { Venue } from "@/lib/types";
import { VenueCard } from "./venue-card";

export function VenueList({ venues: venuesProp }: { venues?: Venue[] }) {
  const game = useGame();
  const venues = venuesProp ?? game.venues;
  const { selectedVenueId, setSelectedVenueId } = game;
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (!selectedVenueId) return;
    const el = itemRefs.current.get(selectedVenueId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedVenueId]);

  return (
    <div
      className="flex h-full flex-col gap-2 overflow-y-auto pr-2"
      role="list"
      aria-label="Venue list"
    >
      {venues.map((venue) => (
        <div
          key={venue.id}
          role="listitem"
          ref={(node) => {
            if (node) {
              itemRefs.current.set(venue.id, node);
            } else {
              itemRefs.current.delete(venue.id);
            }
          }}
        >
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
