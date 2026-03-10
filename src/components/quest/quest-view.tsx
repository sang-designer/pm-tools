"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { QuestMap, QuestMapHandle, PinPosition } from "./quest-map";
import { TaskCard } from "./task-card";
import { PointsDisplay } from "./points-display";
import { QuestProgress, useQuestCompletion } from "./quest-progress";
import { StreakBanner } from "./streak-banner";
import { MyWorldOverlay } from "./my-world-overlay";
import { CelebrationOverlay } from "./celebration-overlay";
import { useGame } from "@/lib/game-context";
import { POINTS } from "@/lib/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Navigation, Globe } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export function QuestView() {
  const {
    currentStreak,
    lastStreakBonus,
    lastPointsAwarded,
    venues,
    venueProgress,
    getNextVenue,
    setSelectedVenueId,
    selectedVenueId,
    addMoreVenues,
  } = useGame();
  const [showStreakBanner, setShowStreakBanner] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [showMyWorld, setShowMyWorld] = useState(false);
  const [pinPos, setPinPos] = useState<PinPosition | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const mapRef = useRef<QuestMapHandle>(null);
  const { pct } = useQuestCompletion();
  const prevPct = useRef(pct);

  if (pct >= 100 && prevPct.current < 100) {
    setShowCelebration(true);
  }
  prevPct.current = pct;

  const refreshPinPos = useCallback(() => {
    if (!selectedVenueId || !mapRef.current) {
      setPinPos(null);
      return;
    }
    const p = mapRef.current.getPinPosition(selectedVenueId);
    setPinPos(p);
  }, [selectedVenueId]);

  useEffect(() => {
    refreshPinPos();
  }, [refreshPinPos]);

  // Re-position the card whenever the map moves or zooms
  useEffect(() => {
    if (!mapRef.current) return;
    return mapRef.current.onMoveEnd(refreshPinPos);
  }, [refreshPinPos]);

  // After flyTo completes, refresh position once more with a delay
  useEffect(() => {
    if (!selectedVenueId) return;
    const t = setTimeout(refreshPinPos, 700);
    return () => clearTimeout(t);
  }, [selectedVenueId, refreshPinPos]);

  useEffect(() => {
    if (hasShownWelcome) return;
    const unvisited = venues.filter(
      (v) => !v.globallyCompleted && !venueProgress.some((p) => p.venueId === v.id)
    ).length;
    if (unvisited > 0) {
      toast(`📍 ${unvisited} venues near you need help!`, { duration: 4000 });
      setHasShownWelcome(true);
    }
  }, [venues, venueProgress, hasShownWelcome]);

  useEffect(() => {
    if (lastStreakBonus) {
      setShowStreakBanner(true);
      const timer = setTimeout(() => setShowStreakBanner(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastStreakBonus]);

  useEffect(() => {
    if (
      currentStreak > 0 &&
      currentStreak % POINTS.STREAK_THRESHOLD === POINTS.STREAK_THRESHOLD - 1
    ) {
      toast("🔥 You're 1 task away from a streak bonus!", { duration: 3000 });
    }
  }, [currentStreak]);

  const handleNextVenue = useCallback(() => {
    const center = { lat: 37.765, lng: -122.42 };
    const next = getNextVenue(center.lat, center.lng);
    if (next) {
      setSelectedVenueId(next.id);
      toast(`🏃‍♂️➡️ Heading to ${next.name}`, { duration: 2000 });
    } else {
      toast("🎉 All nearby venues completed! Great job!", { duration: 3000 });
    }
  }, [getNextVenue, setSelectedVenueId]);

  // Auto-advance to next venue after completing a task (with short delay for animation)
  // or immediately after skipping all tasks on a venue
  // Block auto-advance while celebration is showing
  useEffect(() => {
    if (!selectedVenueId && !showMyWorld && !showCelebration) {
      const delay = lastPointsAwarded ? 600 : 0;
      const timer = setTimeout(() => {
        handleNextVenue();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [lastPointsAwarded, selectedVenueId, showMyWorld, showCelebration, handleNextVenue]);

  const handleToggleMyWorld = useCallback(() => {
    setShowMyWorld((prev) => {
      const next = !prev;
      if (next) {
        setSelectedVenueId(null);
        setTimeout(() => mapRef.current?.fitCompletedVenues(), 100);
      } else {
        mapRef.current?.resetView();
      }
      return next;
    });
  }, [setSelectedVenueId]);

  const handleCloseMyWorld = useCallback(() => {
    setShowMyWorld(false);
    mapRef.current?.resetView();
  }, []);

  const handleDoMore = useCallback(() => {
    addMoreVenues();
    setShowCelebration(false);
    toast("🚀 10 new venues added! Let's go!", { duration: 3000 });
  }, [addMoreVenues]);

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden">
      <QuestMap ref={mapRef} showAllCompleted={showMyWorld} />
      <PointsDisplay />

      {!showMyWorld && <TaskCard pinPosition={pinPos} />}
      {!showMyWorld && <QuestProgress />}

      <StreakBanner
        streak={currentStreak}
        bonus={POINTS.STREAK_BONUS}
        visible={showStreakBanner && !showMyWorld}
      />

      <AnimatePresence>
        {showMyWorld && <MyWorldOverlay onClose={handleCloseMyWorld} />}
      </AnimatePresence>

      <AnimatePresence>
        {showCelebration && <CelebrationOverlay onDone={() => setShowCelebration(false)} onDoMore={handleDoMore} />}
      </AnimatePresence>

      <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2">
        {!selectedVenueId && !showMyWorld && (
          <Button
            onClick={handleNextVenue}
            size="sm"
            variant="outline"
            className="gap-2 rounded-full border-border bg-card px-4 text-foreground shadow-lg hover:bg-accent"
          >
            <Navigation className="size-3.5" />
            Find Next Venue
          </Button>
        )}
        <Button
          onClick={handleToggleMyWorld}
          size="sm"
          variant={showMyWorld ? "default" : "outline"}
          className={
            showMyWorld
              ? "gap-2 rounded-full bg-primary px-4 text-primary-foreground shadow-lg hover:bg-primary/90"
              : "gap-2 rounded-full border-border bg-card px-4 text-foreground shadow-lg hover:bg-accent"
          }
        >
          <Globe className="size-3.5" />
          {showMyWorld ? "Back to Quest" : "My World"}
        </Button>
      </div>
    </div>
  );
}
