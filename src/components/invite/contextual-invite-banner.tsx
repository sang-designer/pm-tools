"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { UserPlus, X } from "lucide-react";

interface ContextualInviteBannerProps {
  visible: boolean;
  message: string;
  onInvite: () => void;
  onDismiss: () => void;
}

export function ContextualInviteBanner({
  visible,
  message,
  onInvite,
  onDismiss,
}: ContextualInviteBannerProps) {
  return (
    <AnimatePresence>
      {visible && (
        <div className="absolute bottom-20 left-1/2 z-40 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 sm:w-auto sm:max-w-none">
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
          >
            <div className="relative flex flex-col gap-3 rounded-2xl bg-card/95 px-4 py-3 shadow-xl backdrop-blur-sm sm:flex-row sm:items-center sm:gap-3 sm:px-5">
              <button
                onClick={onDismiss}
                className="absolute right-2 top-2 rounded-full p-1.5 transition-colors hover:bg-accent sm:static sm:order-last sm:p-1"
                aria-label="Dismiss"
              >
                <X className="size-4 text-muted-foreground" />
              </button>
              <div className="flex flex-col gap-0.5 pr-6 sm:pr-0">
                <p className="text-sm font-semibold text-foreground">
                  This is better with friends
                </p>
                <p className="text-xs text-muted-foreground sm:max-w-[260px]">{message}</p>
              </div>
              <Button size="sm" className="h-10 w-full gap-1.5 rounded-full text-xs sm:h-auto sm:w-auto" onClick={onInvite}>
                <UserPlus className="size-3.5" />
                Invite
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
