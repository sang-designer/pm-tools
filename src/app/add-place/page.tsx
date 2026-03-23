"use client";

import { GlobalNav } from "@/components/global-nav";
import { useGame } from "@/lib/game-context";
import { AddPlaceForm } from "@/components/add-place/add-place-form";

export default function AddPlacePage() {
  const { mode, switchMode } = useGame();
  const handleSwitch = (v: string) => switchMode(v as "classic" | "quest");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav activeTab="Home" mode={mode} onModeSwitch={handleSwitch} />
      <main className="flex-1" role="main">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
          <AddPlaceForm />
        </div>
      </main>
    </div>
  );
}
