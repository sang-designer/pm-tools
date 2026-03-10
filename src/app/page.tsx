"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { GlobalNav } from "@/components/global-nav";
import { useGame } from "@/lib/game-context";
import { Loader2 } from "lucide-react";

function MapLoadingFallback() {
  return (
    <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-muted">
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

export default function Home() {
  const { mode, switchMode } = useGame();
  const handleSwitch = (v: string) => switchMode(v as "classic" | "quest");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav activeTab="Home" mode={mode} onModeSwitch={handleSwitch} />

      <main className="flex-1" role="main">
        <Suspense fallback={<MapLoadingFallback />}>
          {mode === "classic" ? <ClassicView /> : <QuestView />}
        </Suspense>
      </main>
    </div>
  );
}
