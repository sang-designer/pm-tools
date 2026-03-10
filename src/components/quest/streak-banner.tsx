"use client";

import { motion, AnimatePresence } from "framer-motion";

interface StreakBannerProps {
  streak: number;
  bonus: number;
  visible: boolean;
}

export function StreakBanner({ streak, bonus, visible }: StreakBannerProps) {
  return (
    <AnimatePresence>
      {visible && (
        <div className="absolute left-1/2 top-[56px] z-40 -translate-x-1/2">
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
          >
            <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-5 py-1.5 shadow-2xl">
              <span className="text-lg">🔥</span>
              <p className="text-sm font-bold text-white">{streak} Venue Streak!</p>
              <span className="text-lg">🔥</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
