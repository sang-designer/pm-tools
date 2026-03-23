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
        <div className="absolute bottom-20 left-1/2 z-40 -translate-x-1/2">
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
          >
            <div className="flex items-center gap-3 rounded-2xl bg-card/95 px-5 py-3 shadow-xl backdrop-blur-sm">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-foreground">
                  This is better with friends
                </p>
                <p className="max-w-[260px] text-xs text-muted-foreground">{message}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="gap-1.5 rounded-full text-xs" onClick={onInvite}>
                  <UserPlus className="size-3.5" />
                  Invite
                </Button>
                <button
                  onClick={onDismiss}
                  className="rounded-full p-1 transition-colors hover:bg-accent"
                  aria-label="Dismiss"
                >
                  <X className="size-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
