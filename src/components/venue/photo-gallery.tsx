"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const PHOTO_SETS: Record<string, string[]> = {
  default: [
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=480&h=320&fit=crop",
    "https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=480&h=320&fit=crop",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=480&h=320&fit=crop",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=480&h=320&fit=crop",
    "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=480&h=320&fit=crop",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=480&h=320&fit=crop",
  ],
  v2: [
    "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=480&h=320&fit=crop",
    "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=480&h=320&fit=crop",
    "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=480&h=320&fit=crop",
    "https://images.unsplash.com/photo-1463797221720-6b07e6426c24?w=480&h=320&fit=crop",
    "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=480&h=320&fit=crop",
    "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=480&h=320&fit=crop",
  ],
  v3: [
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=480&h=320&fit=crop",
    "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=480&h=320&fit=crop",
    "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=480&h=320&fit=crop",
    "https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=480&h=320&fit=crop",
    "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=480&h=320&fit=crop",
    "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=480&h=320&fit=crop",
  ],
};

export function PhotoGallery({ venueId }: { venueId?: string }) {
  const photos = (venueId && PHOTO_SETS[venueId]) || PHOTO_SETS.default;
  const [offset, setOffset] = useState(0);
  const visibleCount = 6;
  const canPrev = offset > 0;
  const canNext = offset + visibleCount < photos.length;

  return (
    <div className="relative flex h-48 w-full overflow-x-auto snap-x snap-mandatory sm:overflow-hidden">
      {photos.slice(offset, offset + visibleCount).map((src, i) => (
        <div key={i} className="relative h-48 min-w-[75vw] snap-center overflow-hidden sm:min-w-0 sm:flex-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`Venue photo ${i + 1}`}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
      {canPrev && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-3 top-1/2 z-10 hidden size-10 -translate-y-1/2 rounded-md bg-background/90 backdrop-blur-sm sm:flex sm:size-8"
          onClick={() => setOffset((o) => Math.max(0, o - 1))}
        >
          <ChevronLeft className="size-4" />
        </Button>
      )}
      {canNext && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-3 top-1/2 z-10 hidden size-10 -translate-y-1/2 rounded-md bg-background/90 backdrop-blur-sm sm:flex sm:size-8"
          onClick={() => setOffset((o) => o + 1)}
        >
          <ChevronRight className="size-4" />
        </Button>
      )}
    </div>
  );
}
