"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { GlobalNav } from "@/components/global-nav";
import { useGame } from "@/lib/game-context";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, List, Loader2 } from "lucide-react";

function MapLoadingFallback() {
  return (
    <div className="flex h-[calc(100vh-128px)] w-full items-center justify-center bg-muted">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  );
}

const ClassicView = dynamic(
  () => import("@/components/classic/classic-view").then((m) => m.ClassicView),
  { ssr: false, loading: MapLoadingFallback }
);
const QuestView = dynamic(
  () => import("@/components/quest/quest-view").then((m) => m.QuestView),
  { ssr: false, loading: MapLoadingFallback }
);

function ModeSwitch({ mode, onSwitch, floating }: { mode: string; onSwitch: (v: string) => void; floating?: boolean }) {
  return (
    <div className={floating
      ? "absolute left-1/2 top-[72px] z-40 -translate-x-1/2"
      : "flex items-center justify-center gap-4 border-b border-border bg-background px-4 py-3 sm:px-12"
    }>
      <Tabs value={mode} onValueChange={onSwitch}>
        <TabsList
          className={`grid w-[320px] grid-cols-2 sm:w-[360px] ${
            floating ? "shadow-lg backdrop-blur-sm" : ""
          }`}
          role="tablist"
          aria-label="View mode"
        >
          <TabsTrigger value="classic" className="gap-2" aria-label="Classic Review mode">
            <List className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Classic Review</span>
            <span className="sm:hidden">Classic</span>
          </TabsTrigger>
          <TabsTrigger value="quest" className="gap-2" aria-label="Map Quest mode">
            <Map className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Map Quest ⭐</span>
            <span className="sm:hidden">Quest ⭐</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

export default function Home() {
  const { mode, switchMode } = useGame();
  const handleSwitch = (v: string) => switchMode(v as "classic" | "quest");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav activeTab="Home" />

      {mode === "classic" && <ModeSwitch mode={mode} onSwitch={handleSwitch} />}
      {mode === "quest" && <ModeSwitch mode={mode} onSwitch={handleSwitch} floating />}

      <main className="flex-1" role="main">
        <Suspense fallback={<MapLoadingFallback />}>
          {mode === "classic" ? <ClassicView /> : <QuestView />}
        </Suspense>
      </main>
    </div>
  );
}
