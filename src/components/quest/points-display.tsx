"use client";

import { useGame } from "@/lib/game-context";
import { getLevelFromPoints } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { Flame, Star, Zap, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

function FloatingPoints({ amount, type }: { amount: number; type: "points" | "streak" }) {
  return (
    <motion.div
      initial={{ y: 0, opacity: 1, scale: 0.5 }}
      animate={{ y: -50, opacity: 0, scale: 1.4 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className={`pointer-events-none text-sm font-bold ${
        type === "streak" ? "text-orange-500" : "text-green-500"
      }`}
    >
      +{amount}
    </motion.div>
  );
}

function Confetti() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 120,
    y: (Math.random() - 0.5) * 80 - 30,
    rotation: Math.random() * 360,
    color: ["#3b82f6", "#eab308", "#22c55e", "#ef4444", "#a855f7", "#f97316"][i % 6],
    delay: Math.random() * 0.3,
  }));

  return (
    <div className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 1, rotate: p.rotation }}
          transition={{ duration: 1, delay: p.delay, ease: "easeOut" }}
          className="absolute size-2 rounded-full"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

export function PointsDisplay() {
  const { totalPoints, currentStreak, lastPointsAwarded, lastStreakBonus, clearLastReward } = useGame();
  const { level, progress } = getLevelFromPoints(totalPoints);
  const [showConfetti, setShowConfetti] = useState(false);
  const prevLevel = useRef(level);
  const [floatingRewards, setFloatingRewards] = useState<Array<{ id: number; amount: number; type: "points" | "streak" }>>([]);
  const rewardId = useRef(0);

  useEffect(() => {
    if (level > prevLevel.current) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      prevLevel.current = level;
      return () => clearTimeout(timer);
    }
    prevLevel.current = level;
  }, [level]);

  useEffect(() => {
    if (lastPointsAwarded) {
      const id = ++rewardId.current;
      setFloatingRewards((prev) => [...prev, { id, amount: lastPointsAwarded, type: "points" }]);
      setTimeout(() => {
        setFloatingRewards((prev) => prev.filter((r) => r.id !== id));
      }, 1600);
    }
  }, [lastPointsAwarded]);

  useEffect(() => {
    if (lastStreakBonus) {
      const id = ++rewardId.current;
      setTimeout(() => {
        setFloatingRewards((prev) => [...prev, { id, amount: lastStreakBonus, type: "streak" }]);
        setTimeout(() => {
          setFloatingRewards((prev) => prev.filter((r) => r.id !== id));
        }, 1600);
      }, 400);
    }
  }, [lastStreakBonus]);

  useEffect(() => {
    if (lastPointsAwarded) {
      const timer = setTimeout(clearLastReward, 2000);
      return () => clearTimeout(timer);
    }
  }, [lastPointsAwarded, clearLastReward]);

  return (
    <div className="absolute right-2 top-2 z-30 flex flex-col items-end gap-2 sm:right-4 sm:top-4">
      <div className="relative flex items-center gap-2 rounded-2xl bg-card/95 px-3 py-2 shadow-lg backdrop-blur-sm sm:gap-3 sm:px-5 sm:py-3">
        {showConfetti && <Confetti />}

        <div className="flex items-center gap-1.5">
          <Star className="size-4 text-amber-500 sm:size-5" fill="currentColor" />
          <motion.span
            key={totalPoints}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="text-base font-bold text-foreground sm:text-lg"
          >
            {totalPoints}
          </motion.span>
          <span className="hidden text-xs text-muted-foreground sm:inline">pts</span>
        </div>

        <div className="h-5 w-px bg-border sm:h-6" />

        <div className="flex items-center gap-1.5">
          <Flame
            className={`size-4 transition-colors sm:size-5 ${currentStreak > 0 ? "text-orange-500" : "text-muted-foreground/40"}`}
            fill={currentStreak > 0 ? "currentColor" : "none"}
          />
          <span className="text-base font-bold text-foreground sm:text-lg">{currentStreak}</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">streak</span>
        </div>

        <div className="hidden h-6 w-px bg-border sm:block" />

        <div className="hidden items-center gap-2 sm:flex">
          <div className="relative">
            <Zap className="size-4 text-primary" fill="currentColor" />
            {showConfetti && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                className="absolute -inset-1"
              >
                <Trophy className="size-6 text-amber-500" />
              </motion.div>
            )}
          </div>
          <span className="text-sm font-medium text-foreground">Lvl {level}</span>
          <Progress value={progress * 100} className="h-2 w-16" />
        </div>

        <div className="absolute -bottom-2 right-4 flex flex-col items-center">
          <AnimatePresence>
            {floatingRewards.map((r) => (
              <FloatingPoints key={r.id} amount={r.amount} type={r.type} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
