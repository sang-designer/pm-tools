"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserProfileCard } from "@/components/user-profile-card";
import { VenueList } from "./venue-list";
import { VenueTable } from "./venue-table";
import { SearchFilters } from "./search-filters";
import { MapPanel } from "./map-panel";
import { LeaderboardDrawer } from "./leaderboard-drawer";
import { InviteButton } from "@/components/invite/invite-button";
import { InviteModal } from "@/components/invite/invite-modal";
import { RewardBanner } from "@/components/invite/reward-banner";
import { ContextualInviteBanner } from "@/components/invite/contextual-invite-banner";
import { useInviteTrigger } from "@/lib/invite-context";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Settings2, List, Map, PanelTopOpen, PanelTopClose } from "lucide-react";

const PROFILE_COLLAPSED_KEY = "placemaker-profile-collapsed";

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

interface ClassicViewProps {
  staggerEntrance?: boolean;
}

export function ClassicView({ staggerEntrance = false }: ClassicViewProps) {
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [needsReviewOnly, setNeedsReviewOnly] = useState(false);
  const [profileCollapsed, setProfileCollapsed] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [profileHeight, setProfileHeight] = useState<number>(0);
  const { showTrigger, triggerMessage, dismissTrigger } = useInviteTrigger();

  useEffect(() => {
    setProfileCollapsed(localStorage.getItem(PROFILE_COLLAPSED_KEY) === "true");
  }, []);

  useEffect(() => {
    const el = profileRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setProfileHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const toggleProfile = useCallback(() => {
    setProfileCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(PROFILE_COLLAPSED_KEY, String(next));
      return next;
    });
  }, []);

  const animate = staggerEntrance ? "visible" : undefined;
  const initial = staggerEntrance ? "hidden" : undefined;

  return (
    <div className="relative px-4 py-4 sm:px-8 lg:px-12">
      <RewardBanner />

      <motion.div
        variants={staggerItem}
        custom={0}
        initial={initial}
        animate={animate}
      >
        <motion.div
          animate={{
            height: profileCollapsed ? 0 : profileHeight,
            opacity: profileCollapsed ? 0 : 1,
          }}
          transition={{
            height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.2, ease: "easeOut" },
          }}
          style={{ overflow: "clip" }}
        >
          <div ref={profileRef}>
            <h1 className="mb-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Welcome, Sang
            </h1>
            <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-start" data-guide="profile">
              <div className="min-w-0 flex-1">
                <UserProfileCard />
              </div>
              <div className="flex w-full shrink-0 flex-col lg:w-[304px]">
                <div className="lg:px-4">
                  <h3 className="my-1 text-base font-medium text-foreground">Quick Links</h3>
                </div>
                <nav className="flex flex-1 gap-4 lg:flex-col lg:gap-1.5 lg:px-4" aria-label="Quick links">
                  <a href="/add-place" className="text-sm text-primary hover:underline">Add a new place</a>
                  <a href="#" className="text-sm text-primary hover:underline">My suggestions</a>
                  <button onClick={() => setLeaderboardOpen(true)} className="text-sm text-primary hover:underline text-left">Leaderboard</button>
                  <div>
                    <InviteButton variant="inline" onClick={() => setInviteOpen(true)} />
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggerItem}
        custom={1}
        initial={initial}
        animate={animate}
        className="mb-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    onClick={toggleProfile}
                    className="group inline-flex size-8 items-center justify-center rounded-lg border border-border/60 bg-card text-muted-foreground shadow-sm transition-all hover:border-border hover:bg-accent hover:text-foreground hover:shadow active:scale-95"
                  />
                }
              >
                <AnimatePresence mode="wait" initial={false}>
                  {profileCollapsed ? (
                    <motion.span
                      key="open"
                      className="inline-flex"
                      initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <PanelTopOpen className="size-4" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="close"
                      className="inline-flex"
                      initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <PanelTopClose className="size-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {profileCollapsed ? "Show profile" : "Hide profile"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Foursquare Places
          </h2>
        </div>
        <Button variant="outline" className="gap-2 border-primary text-primary">
          <Settings2 className="size-4" aria-hidden="true" />
          Filter
        </Button>
      </motion.div>

      <motion.div
        variants={staggerItem}
        custom={2}
        initial={initial}
        animate={animate}
        className="mb-4"
      >
        <SearchFilters needsReviewOnly={needsReviewOnly} onNeedsReviewChange={setNeedsReviewOnly} />
      </motion.div>

      <motion.div
        variants={staggerItem}
        custom={3}
        initial={initial}
        animate={animate}
        className="relative"
      >
        {viewMode === "map" ? (
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-0" style={{ minHeight: "400px", height: profileCollapsed ? "calc(100vh - 180px)" : "calc(100vh - 340px)" }}>
            <div className="w-full shrink-0 lg:w-[476px]" data-guide="venue-list">
              <VenueList />
            </div>
            <div className="hidden flex-1 overflow-hidden rounded-2xl lg:block relative z-0" data-guide="map">
              <MapPanel needsReviewOnly={needsReviewOnly} />
            </div>
          </div>
        ) : (
          <div style={{ minHeight: "400px" }}>
            <p className="mb-4 text-sm text-muted-foreground">
              Click on a place below to start voting on other users&apos; edits, or provide feedback about a specific place by using the search bar above.
            </p>
            <VenueTable />
          </div>
        )}

        <div className="pointer-events-none sticky bottom-6 z-10 flex justify-center">
          <button
            onClick={() => setViewMode(viewMode === "map" ? "list" : "map")}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-sm text-background shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            {viewMode === "map" ? (
              <>
                <List className="size-4" aria-hidden="true" />
                List view
              </>
            ) : (
              <>
                <Map className="size-4" aria-hidden="true" />
                Map view
              </>
            )}
          </button>
        </div>
      </motion.div>

      <ContextualInviteBanner
        visible={showTrigger}
        message={triggerMessage}
        onInvite={() => { dismissTrigger(); setInviteOpen(true); }}
        onDismiss={dismissTrigger}
      />

      <LeaderboardDrawer open={leaderboardOpen} onOpenChange={setLeaderboardOpen} onInvite={() => { setLeaderboardOpen(false); setInviteOpen(true); }} />
      <InviteModal open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
}
