"use client";

import { Venue } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const TAG_COLORS: Record<string, string> = {
  Details: "bg-[rgba(130,232,219,0.2)] dark:bg-[rgba(130,232,219,0.15)]",
  Flagged: "bg-[rgba(255,133,199,0.2)] dark:bg-[rgba(255,133,199,0.15)]",
  Categories: "bg-[#f2eefb] dark:bg-[rgba(156,159,239,0.2)]",
  Chains: "bg-gray-300 dark:bg-gray-600",
  Attributes: "bg-[rgba(255,218,175,0.5)] dark:bg-[rgba(255,218,175,0.2)]",
};

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
        isSelected ? "border-primary shadow-md" : "border-border"
      )}
    >
      <div className="mb-1 text-base font-medium text-foreground">{venue.name}</div>
      <p className="mb-3 text-sm text-muted-foreground">{venue.address}</p>
      <div className="flex flex-wrap gap-1">
        {venue.tags.map((tag) => (
          <span
            key={tag}
            className={cn(
              "rounded px-2 py-1 text-xs text-foreground",
              TAG_COLORS[tag] || "bg-muted"
            )}
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
