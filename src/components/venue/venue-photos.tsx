"use client";

import { Venue } from "@/lib/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const MOCK_PHOTOS = [
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1521302200778-33500795e544?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1497515114889-11a5be05e29e?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=300&h=300&fit=crop",
];

const SOURCES = ["foursquare", "yelp", "google", "user"];

interface VenuePhotosProps {
  venue: Venue;
}

const PAGE_SIZE = 15;

export function VenuePhotos({ venue }: VenuePhotosProps) {
  const totalPhotos = MOCK_PHOTOS.length;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const visiblePhotos = MOCK_PHOTOS.slice(0, visibleCount);

  const toggleSelect = (idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const getSource = (idx: number) => SOURCES[idx % SOURCES.length];

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold tracking-tight text-foreground sm:text-xl">
        {totalPhotos} Photos
      </h2>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
        {visiblePhotos.map((src, i) => (
          <div key={i} className="group relative aspect-square overflow-hidden rounded-md bg-muted">
            <img
              src={src}
              alt={`${venue.name} photo ${i + 1}`}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute right-1.5 top-1.5">
              <Checkbox
                checked={selected.has(i)}
                onCheckedChange={() => toggleSelect(i)}
                className="size-5 border-white/80 bg-black/30 data-checked:border-primary data-checked:bg-primary"
                aria-label={`Select photo ${i + 1}`}
              />
            </div>
            <div className="absolute bottom-1.5 left-1.5">
              <Badge
                variant="secondary"
                className="bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white hover:bg-black/60"
              >
                {getSource(i)}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < totalPhotos && (
        <Button
          variant="outline"
          className="mt-6 w-full"
          onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, totalPhotos))}
        >
          Load more
        </Button>
      )}
    </div>
  );
}
