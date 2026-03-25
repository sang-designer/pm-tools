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
import { InviteProgressTracker } from "./invite-progress-tracker";
import { useInvite } from "@/lib/invite-context";
import { Check, Copy, Send, X, Linkedin, Twitter, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function InviteModal({ open, onOpenChange }: InviteModalProps) {
  const { sendBulkInvites, referralLink } = useInvite();
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [copied, setCopied] = useState(false);

  const addEmail = () => {
    const trimmed = emailInput.trim();
    if (trimmed && isValidEmail(trimmed) && !emails.includes(trimmed)) {
      setEmails((prev) => [...prev, trimmed]);
      setEmailInput("");
    }
  };

  const removeEmail = (email: string) => {
    setEmails((prev) => prev.filter((e) => e !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
    if (e.key === "Backspace" && !emailInput && emails.length > 0) {
      setEmails((prev) => prev.slice(0, -1));
    }
  };

  const handleSend = () => {
    if (emails.length === 0) return;

    const invites = emails.map((email) => ({
      name: email.split("@")[0].replace(/[._]/g, " "),
      email,
    }));
    sendBulkInvites(invites);

    toast.success(`${emails.length} invite${emails.length > 1 ? "s" : ""} sent!`);
    setEmails([]);
    setEmailInput("");
    onOpenChange(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareVia = (platform: "linkedin" | "twitter" | "whatsapp") => {
    const text = "Join me on Placemaker and help improve places around the world!";
    const urls: Record<string, string> = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${referralLink}`)}`,
    };
    window.open(urls[platform], "_blank");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-[440px] flex-col sm:max-w-[440px]">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">
            Invite friends to Placemaker Tools
          </SheetTitle>
          <SheetDescription>
            Share your link or send email invites to friends.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
          {/* Invite Link */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-muted-foreground">Share your invite link</p>
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="flex-1 text-xs" />
              <Button variant="outline" size="icon" onClick={copyLink} aria-label="Copy link">
                {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" onClick={() => shareVia("linkedin")}>
                <Linkedin className="size-3.5" /> LinkedIn
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" onClick={() => shareVia("twitter")}>
                <Twitter className="size-3.5" /> Twitter/X
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" onClick={() => shareVia("whatsapp")}>
                <MessageCircle className="size-3.5" /> WhatsApp
              </Button>
            </div>
          </div>

          <Separator />

          {/* Email Invites */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-muted-foreground">Invite by email</p>

            {emails.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {emails.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() => removeEmail(email)}
                      className="rounded-full p-0.5 transition-colors hover:bg-primary/20"
                      aria-label={`Remove ${email}`}
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="colleague@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                variant="outline"
                size="default"
                className="h-10"
                onClick={addEmail}
                disabled={!emailInput.trim() || !isValidEmail(emailInput.trim())}
              >
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Press Enter to add each email address.
            </p>
          </div>

          <Separator />

          <InviteProgressTracker />
        </div>

        <div className="border-t border-border p-4">
          <Button onClick={handleSend} disabled={emails.length === 0} className="w-full gap-2">
            <Send className="size-4" />
            Send Invite{emails.length > 1 ? "s" : ""}
            {emails.length > 0 && ` (${emails.length})`}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
