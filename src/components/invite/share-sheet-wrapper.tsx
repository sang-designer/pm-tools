"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInvite } from "@/lib/invite-context";
import { Copy, Mail, Twitter, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export function ShareSheetWrapper() {
  const { referralLink } = useInvite();

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success("Link copied!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareVia = (platform: "email" | "twitter" | "whatsapp") => {
    const text = `Join me on Placemaker and help improve places around the world!`;
    const urls: Record<string, string> = {
      email: `mailto:?subject=${encodeURIComponent("Join me on Placemaker!")}&body=${encodeURIComponent(`${text}\n\n${referralLink}`)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${referralLink}`)}`,
    };
    window.open(urls[platform], "_blank");
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium text-muted-foreground">Or share your invite link</p>
      <div className="flex gap-2">
        <Input value={referralLink} readOnly className="flex-1 text-xs" />
        <Button variant="outline" size="icon" onClick={copyLink} aria-label="Copy link">
          <Copy className="size-4" />
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" onClick={() => shareVia("email")}>
          <Mail className="size-3.5" /> Email
        </Button>
        <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" onClick={() => shareVia("twitter")}>
          <Twitter className="size-3.5" /> Twitter
        </Button>
        <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" onClick={() => shareVia("whatsapp")}>
          <MessageCircle className="size-3.5" /> WhatsApp
        </Button>
      </div>
    </div>
  );
}
