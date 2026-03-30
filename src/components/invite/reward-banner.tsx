"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInvite } from "@/lib/invite-context";
import { useEffect } from "react";

export function RewardBanner() {
  const { lastJoinedFriend, clearJoinedNotification } = useInvite();

  useEffect(() => {
    if (!lastJoinedFriend) return;
    const timer = setTimeout(clearJoinedNotification, 4000);
    return () => clearTimeout(timer);
  }, [lastJoinedFriend, clearJoinedNotification]);

  return (
    <AnimatePresence>
      {lastJoinedFriend && (
        <div className="absolute left-1/2 top-[4px] z-40 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 sm:w-auto sm:max-w-none">
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
          >
            <div className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2.5 shadow-2xl sm:px-5 sm:py-2">
              <span className="text-lg">🎉</span>
              <p className="truncate text-sm font-bold text-white">
                {lastJoinedFriend} joined Placemaker!
              </p>
              <span className="text-lg">🎉</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
