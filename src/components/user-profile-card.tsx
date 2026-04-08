"use client";

import { useGame } from "@/lib/game-context";
import { getLevelFromPoints } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export function UserProfileCard() {
  const { totalPoints, proposedCount, approvedCount } = useGame();
  const { levelName, progress } = getLevelFromPoints(totalPoints);

  return (
    <div className="rounded-lg bg-card p-4 shadow-md sm:p-6" role="region" aria-label="User profile">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3 sm:gap-4">
          <div
            className="size-12 shrink-0 rounded-full border-2 border-background bg-gradient-to-br from-blue-400 to-purple-500 shadow-sm sm:size-16"
            role="img"
            aria-label="User avatar"
          />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-foreground">Sang Yeo</span>
              <span className="text-base" aria-label="Placemaker badge">🏅</span>
            </div>
            <div className="group/status relative flex flex-wrap items-center gap-2">
              <span className="rounded bg-primary/15 px-2 py-1 text-xs text-foreground">
                {levelName}
              </span>
              <Progress value={progress * 100} className="h-2 w-20 sm:w-28" aria-label={`${Math.round(progress * 100)}% progress to next level`} />
              <span className="hidden text-xs text-muted-foreground sm:inline">
                You&apos;re {Math.round(100 - progress * 100)}% away from leveling up
              </span>
              <div
                role="tooltip"
                className="pointer-events-none absolute -top-2 left-0 z-50 -translate-y-full opacity-0 transition-opacity group-hover/status:opacity-100"
              >
                <div className="max-w-xs rounded-lg bg-foreground px-3 py-2 text-sm text-background shadow-lg">
                  Continue reviewing places that need your review to progress
                </div>
                <div className="ml-6 size-0 border-x-[6px] border-t-[6px] border-x-transparent border-t-foreground" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground sm:text-sm">
              You&apos;re currently helping us fix places near San Francisco, CA, United States
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 self-start" data-guide="stats">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-normal text-foreground sm:text-3xl">{proposedCount || "—"}</span>
            <span className="text-xs text-muted-foreground">Proposed</span>
          </div>
          <Separator orientation="vertical" className="h-10 sm:h-12" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-normal text-foreground sm:text-3xl">{approvedCount || "—"}</span>
            <span className="text-xs text-muted-foreground">Approved</span>
          </div>
        </div>
      </div>
    </div>
  );
}
