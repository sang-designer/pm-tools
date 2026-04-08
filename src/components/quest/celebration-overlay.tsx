"use client";

import { motion } from "framer-motion";
import { Trophy, Rocket } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const COLORS = ["#3b82f6", "#eab308", "#22c55e", "#ef4444", "#a855f7", "#f97316", "#ec4899", "#14b8a6"];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function ConfettiPiece({ delay, index }: { delay: number; index: number }) {
  const color = COLORS[index % COLORS.length];
  const startX = randomBetween(10, 90);
  const drift = randomBetween(-30, 30);
  const size = randomBetween(6, 12);
  const rotation = randomBetween(0, 360);
  const isCircle = index % 3 === 0;

  return (
    <motion.div
      initial={{ x: `${startX}vw`, y: -20, opacity: 1, rotate: 0, scale: 0 }}
      animate={{
        x: `${startX + drift}vw`,
        y: "110vh",
        opacity: [1, 1, 0.8, 0],
        rotate: rotation + 720,
        scale: [0, 1.2, 1, 0.8],
      }}
      transition={{ duration: randomBetween(2.5, 4), delay, ease: "easeOut" }}
      style={{
        position: "absolute",
        width: size,
        height: isCircle ? size : size * 0.5,
        backgroundColor: color,
        borderRadius: isCircle ? "50%" : "2px",
      }}
    />
  );
}

interface CelebrationOverlayProps {
  onDone: () => void;
  onDoMore: () => void;
}

export function CelebrationOverlay({ onDone, onDoMore }: CelebrationOverlayProps) {
  const [pieces] = useState(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      delay: randomBetween(0, 0.8),
    }))
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pointer-events-none absolute inset-0 z-50 overflow-hidden"
    >
      {pieces.map((p) => (
        <ConfettiPiece key={p.id} delay={p.delay} index={p.id} />
      ))}

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.3 }}
        className="pointer-events-auto absolute left-1/2 top-1/3 z-50 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-card/95 px-10 py-8 shadow-2xl backdrop-blur-sm max-w-[calc(100vw-2rem)]">
          <motion.div
            animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Trophy className="size-12 text-amber-500" />
          </motion.div>
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold text-foreground"
          >
            Great work!
          </motion.h2>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-muted-foreground"
          >
            You&apos;ve helped every venue nearby
          </motion.p>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-2 flex gap-3"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={onDone}
              className="h-10 rounded-full px-5 sm:h-auto"
            >
              I&apos;m done
            </Button>
            <Button
              size="sm"
              onClick={onDoMore}
              className="h-10 gap-2 rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90 sm:h-auto"
            >
              <Rocket className="size-4" />
              Do more!
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
