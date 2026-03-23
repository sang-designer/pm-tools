"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ContactPicker } from "./contact-picker";
import { ShareSheetWrapper } from "./share-sheet-wrapper";
import { InviteProgressTracker } from "./invite-progress-tracker";
import { useInvite } from "@/lib/invite-context";
import { MOCK_SWARM_FRIENDS } from "@/lib/invite-types";
import { Send } from "lucide-react";
import { toast } from "sonner";

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteModal({ open, onOpenChange }: InviteModalProps) {
  const { sendInvite, sendBulkInvites } = useInvite();
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");

  const canSend = selectedFriendIds.length > 0 || emailInput.trim().length > 0;

  const handleSend = () => {
    const friendInvites = selectedFriendIds
      .map((id) => MOCK_SWARM_FRIENDS.find((f) => f.id === id))
      .filter(Boolean)
      .map((f) => ({
        name: f!.name,
        email: `${f!.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      }));

    if (friendInvites.length > 0) {
      sendBulkInvites(friendInvites);
    }

    if (emailInput.trim()) {
      const name = emailInput.split("@")[0].replace(/[._]/g, " ");
      sendInvite(name, emailInput.trim());
    }

    const count = friendInvites.length + (emailInput.trim() ? 1 : 0);
    toast.success(`${count} invite${count > 1 ? "s" : ""} sent!`);
    setSelectedFriendIds([]);
    setEmailInput("");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-[440px] flex-col sm:max-w-[440px]">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">
            Invite friends to Placemaker Tools
          </SheetTitle>
          <SheetDescription>
            Contribute together! Invite friends to help fix and improve places.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Swarm Friends ({MOCK_SWARM_FRIENDS.length})</p>
            <ContactPicker
              selectedIds={selectedFriendIds}
              onSelectionChange={setSelectedFriendIds}
            />
          </div>

          <Separator />

          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Invite by email</p>
            <Input
              type="email"
              placeholder="friend@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && canSend && handleSend()}
            />
          </div>

          <Separator />

          <ShareSheetWrapper />

          <Separator />

          <InviteProgressTracker />
        </div>

        <div className="border-t border-border p-4">
          <Button onClick={handleSend} disabled={!canSend} className="w-full gap-2">
            <Send className="size-4" />
            Send Invite{selectedFriendIds.length + (emailInput.trim() ? 1 : 0) > 1 ? "s" : ""}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
