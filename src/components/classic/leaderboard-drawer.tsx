"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InviteButton } from "@/components/invite/invite-button";
import { MapPin } from "lucide-react";

function avatarUrl(seed: string) {
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
}

const LEADERBOARD_DATA = [
  { rank: "1st", name: "J.R.", edits: 456 },
  { rank: "2nd", name: "Jeremy", edits: 291 },
  { rank: "3rd", name: "Dick", edits: 266 },
  { rank: "4th", name: "Joe", edits: 110 },
  { rank: "5th", name: "Jacques", edits: 94 },
  { rank: "6th", name: "Story", edits: 92 },
  { rank: "7th", name: "David", edits: 89 },
  { rank: "8th", name: "Ami", edits: 82 },
  { rank: "9th", name: "Sang", edits: 76 },
  { rank: "10th", name: "Priya", edits: 71 },
];

interface LeaderboardDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite?: () => void;
}

function LeaderboardAvatar({ name }: { name: string }) {
  const [errored, setErrored] = useState(false);
  return (
    <Avatar className="size-8">
      {!errored && (
        <AvatarImage
          src={avatarUrl(name)}
          alt={name}
          onError={() => setErrored(true)}
        />
      )}
      <AvatarFallback className="text-xs">
        {name.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

export function LeaderboardDrawer({ open, onOpenChange, onInvite }: LeaderboardDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-[420px] flex-col sm:max-w-[420px]">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">Leaderboard</SheetTitle>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden="true" />
            San Francisco
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          <div className="grid grid-cols-[40px_1fr_auto] items-center gap-x-3 pb-2 text-sm font-medium text-muted-foreground">
            <span>Place</span>
            <span>Name</span>
            <span>Total Edits</span>
          </div>

          <div className="flex flex-col">
            {LEADERBOARD_DATA.map((entry) => (
              <div
                key={entry.rank}
                className="grid grid-cols-[40px_1fr_auto] items-center gap-x-3 border-t border-border py-3"
              >
                <span className="text-sm text-muted-foreground">{entry.rank}</span>
                <div className="flex items-center gap-3">
                  <LeaderboardAvatar name={entry.name} />
                  <span className="text-sm font-medium text-foreground">{entry.name}</span>
                </div>
                <span className="text-sm tabular-nums text-foreground">{entry.edits}</span>
              </div>
            ))}
          </div>
        </div>

        {onInvite && (
          <div className="border-t border-border p-4">
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground">Climb the leaderboard together!</p>
              <InviteButton variant="primary" onClick={onInvite} className="w-full" />
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
              >
                Join Discord Server
              </a>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
