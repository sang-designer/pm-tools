"use client";

import { Venue } from "@/lib/types";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ShieldAlert,
  ImageOff,
  Ban,
  Skull,
  Scale,
  Unlink,
  CheckCircle2,
  Check,
  X,
} from "lucide-react";

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

const FLAG_ACTIONS = [
  { label: "Spam / Scam", icon: ShieldAlert },
  { label: "Blurry / Low Quality", icon: ImageOff },
  { label: "Nudity", icon: Ban },
  { label: "Hate / Violence", icon: Skull },
  { label: "Illegal", icon: Scale },
  { label: "Unrelated", icon: Unlink },
] as const;

interface VenuePhotosProps {
  venue: Venue;
  photos?: string[];
}

const PAGE_SIZE = 15;

export function VenuePhotos({ venue, photos }: VenuePhotosProps) {
  const allPhotos = photos ?? MOCK_PHOTOS;
  const totalPhotos = allPhotos.length;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [reviewed, setReviewed] = useState<Set<number>>(new Set());

  const visiblePhotos = allPhotos.slice(0, visibleCount);
  const hasSelection = selected.size > 0;

  const toggleSelect = (idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleFlag = useCallback(
    () => {
      setReviewed((prev) => {
        const next = new Set(prev);
        selected.forEach((idx) => next.add(idx));
        return next;
      });
      setSelected(new Set());
    },
    [selected]
  );

  const clearSelection = useCallback(() => {
    setSelected(new Set());
  }, []);

  return (
    <div className={cn(hasSelection && "pb-24 sm:pb-20")}>
      <h2 className="mb-4 text-lg font-bold tracking-tight text-foreground sm:text-xl">
        {totalPhotos} Photos
      </h2>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
        {visiblePhotos.map((src, i) => {
          const isSelected = selected.has(i);
          const isReviewed = reviewed.has(i);

          return (
            <button
              key={i}
              type="button"
              className={cn(
                "group relative aspect-square overflow-hidden rounded-md bg-muted ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected && "ring-2 ring-primary ring-offset-2",
                isReviewed && "cursor-default"
              )}
              onClick={() => !isReviewed && toggleSelect(i)}
              aria-pressed={isSelected}
              aria-label={isReviewed ? `Photo ${i + 1} reviewed` : `${isSelected ? "Deselect" : "Select"} photo ${i + 1}`}
              aria-disabled={isReviewed}
            >
              <img
                src={src}
                alt={`${venue.name} photo ${i + 1}`}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
                draggable={false}
              />

              {isSelected && (
                <div className="absolute inset-0 bg-primary/10" />
              )}

              {!isReviewed && (
                <div className="absolute right-1.5 top-1.5">
                  <div
                    className={cn(
                      "flex size-5 items-center justify-center rounded-[4px] border transition-colors",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-white/80 bg-black/30"
                    )}
                  >
                    {isSelected && <Check className="size-3.5" strokeWidth={3} />}
                  </div>
                </div>
              )}

              {isReviewed && (
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-black/50 py-1.5 backdrop-blur-sm">
                  <Badge
                    variant="secondary"
                    className="gap-1 border-0 bg-emerald-500/90 px-2.5 py-0.5 text-xs font-medium text-white hover:bg-emerald-500/90"
                  >
                    <CheckCircle2 className="size-3" />
                    Reviewed
                  </Badge>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {visibleCount < totalPhotos && (
        <Button
          variant="outline"
          className="mt-6 w-full"
          onClick={() =>
            setVisibleCount((c) => Math.min(c + PAGE_SIZE, totalPhotos))
          }
        >
          Load more
        </Button>
      )}

      {hasSelection && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-3 py-3 shadow-lg backdrop-blur-sm sm:px-6">
          <div className="mx-auto flex max-w-[1500px] items-center gap-3">
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={clearSelection}
                aria-label="Clear selection"
              >
                <X className="size-4" />
              </Button>
              <span className="text-sm font-medium text-foreground">
                {selected.size} selected
              </span>
            </div>

            <div className="flex flex-1 flex-wrap items-center gap-2 sm:justify-end">
              {FLAG_ACTIONS.map(({ label }) => (
                <Button
                  key={label}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs sm:text-sm"
                  onClick={() => handleFlag()}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
