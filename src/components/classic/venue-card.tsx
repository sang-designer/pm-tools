"use client";

import { Venue } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface VenueCardProps {
  venue: Venue;
  isSelected?: boolean;
  onClick?: () => void;
}

export function VenueCard({ venue, isSelected, onClick }: VenueCardProps) {
  const router = useRouter();

  const handleClick = () => {
    onClick?.();
    router.push(`/venue/${venue.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full rounded-2xl border bg-card p-4 text-left transition-all hover:shadow-md",
        isSelected
          ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20"
          : "border-border"
      )}
    >
      <div className="mb-1 text-base font-medium text-foreground">{venue.name}</div>
      <p className="mb-3 text-sm text-muted-foreground">{venue.address}</p>
      <div className="flex flex-wrap gap-1">
        {venue.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </button>
  );
}
