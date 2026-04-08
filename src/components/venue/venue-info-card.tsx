"use client";

import { Venue } from "@/lib/types";
import { Copy, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface VenueInfoCardProps {
  venue: Venue;
}

export function VenueInfoCard({ venue }: VenueInfoCardProps) {
  const d = venue.detail;
  const [copied, setCopied] = useState(false);

  const copyFsqId = () => {
    if (d?.fsqPlaceId) {
      navigator.clipboard.writeText(d.fsqPlaceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full shrink-0 overflow-hidden rounded-2xl border border-border bg-card lg:w-[400px]">
      <div className="relative h-52 w-full overflow-hidden bg-muted">
        <iframe
          title="Map preview"
          className="h-full w-full border-0 pointer-events-none"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${venue.lng - 0.005}%2C${venue.lat - 0.003}%2C${venue.lng + 0.005}%2C${venue.lat + 0.003}&layer=mapnik&marker=${venue.lat}%2C${venue.lng}`}
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">[{venue.name}]</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-5">
              {venue.address?.split(",").map((part, i) => (
                <span key={i}>
                  {part.trim()}
                  {i < venue.address.split(",").length - 1 && <>,<br /></>}
                </span>
              ))}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-primary">
            Edit <SquarePen className="size-4" />
          </Button>
        </div>

        <Separator className="my-4" />

        {d?.hours && d.hours.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground">Hours</h4>
            <p className="mt-1 text-sm text-green-600">Open until 5:00 PM</p>
            <button className="mt-1 text-sm font-medium text-primary hover:underline">
              Show more
            </button>
          </div>
        )}

        {d?.phone && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground">Phone number</h4>
            <p className="mt-1 text-sm text-muted-foreground">{d.phone}</p>
          </div>
        )}

        {d?.website && (
          <div className="mb-4 hidden sm:block">
            <h4 className="text-sm font-semibold text-foreground">Website</h4>
            <a href={d.website} target="_blank" rel="noopener noreferrer" className="mt-1 text-sm text-primary hover:underline">
              {d.website}
            </a>
          </div>
        )}

        {d?.facebook && (
          <div className="mb-4 hidden sm:block">
            <h4 className="text-sm font-semibold text-foreground">Facebook</h4>
            <p className="mt-1 text-sm text-primary">{d.facebook}</p>
          </div>
        )}

        {d?.instagram && (
          <div className="mb-4 hidden sm:block">
            <h4 className="text-sm font-semibold text-foreground">Instagram</h4>
            <p className="mt-1 text-sm text-primary">{d.instagram}</p>
          </div>
        )}

        {d?.features && d.features.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground">Feature</h4>
            {d.features.map((f, i) => (
              <p key={i} className="mt-1 text-sm text-muted-foreground">{f}</p>
            ))}
          </div>
        )}

        {d?.fsqPlaceId && (
          <div className="hidden sm:block">
            <h4 className="text-sm font-semibold text-foreground">FSQ Place ID</h4>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 rounded-md border border-input bg-background px-3 py-2">
                <p className="text-sm text-muted-foreground truncate">{d.fsqPlaceId}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="size-10 shrink-0 border-primary sm:size-9"
                onClick={copyFsqId}
              >
                <Copy className="size-4" />
                <span className="sr-only">{copied ? "Copied" : "Copy FSQ Place ID"}</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
