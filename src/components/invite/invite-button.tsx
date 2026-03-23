"use client";

import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface InviteButtonProps {
  variant?: "primary" | "inline";
  onClick: () => void;
  className?: string;
}

export function InviteButton({ variant = "primary", onClick, className }: InviteButtonProps) {
  if (variant === "inline") {
    return (
      <button
        onClick={onClick}
        className={cn("inline-flex items-center gap-1.5 text-sm text-primary hover:underline", className)}
      >
        <UserPlus className="size-3.5" />
        Invite Friends
      </button>
    );
  }

  return (
    <Button onClick={onClick} className={cn("gap-2", className)}>
      <UserPlus className="size-4" />
      Invite Friends
    </Button>
  );
}
