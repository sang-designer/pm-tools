"use client";

import { useInvite } from "@/lib/invite-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, UserCheck } from "lucide-react";
import { useState } from "react";

export function InviteProgressTracker() {
  const { totalSent, totalConverted, recentInvites } = useInvite();
  const conversionRate = totalSent > 0 ? Math.round((totalConverted / totalSent) * 100) : 0;

  if (totalSent === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg bg-muted/50 py-6">
        <Users className="size-8 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">No invites sent yet</p>
        <p className="text-xs text-muted-foreground/70">Invite friends to start tracking</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium text-muted-foreground">Invite Progress</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
          <Users className="size-4 text-primary" />
          <div>
            <p className="text-lg font-bold text-foreground">{totalSent}</p>
            <p className="text-[10px] text-muted-foreground">Sent</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
          <UserCheck className="size-4 text-green-500" />
          <div>
            <p className="text-lg font-bold text-foreground">{totalConverted}</p>
            <p className="text-[10px] text-muted-foreground">Joined</p>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
          <span>Conversion</span>
          <span>{conversionRate}%</span>
        </div>
        <Progress value={conversionRate} className="h-1.5" />
      </div>

      {recentInvites.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-medium text-muted-foreground">Recent</p>
          <div className="space-y-1.5">
            {recentInvites.slice(0, 5).map((inv) => (
              <InviteRow key={inv.id} name={inv.inviteeName} status={inv.status} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InviteRow({ name, status }: { name: string; status: string }) {
  const [imgErr, setImgErr] = useState(false);
  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

  const statusConfig: Record<string, { label: string; className: string }> = {
    sent: { label: "Sent", className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
    opened: { label: "Opened", className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
    converted: { label: "Joined", className: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" },
  };

  const cfg = statusConfig[status] || statusConfig.sent;

  return (
    <div className="flex items-center gap-2 rounded-md px-2 py-1">
      <Avatar className="size-6">
        {!imgErr && <AvatarImage src={avatarUrl} alt={name} onError={() => setImgErr(true)} />}
        <AvatarFallback className="text-[10px]">{name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="flex-1 truncate text-xs text-foreground">{name}</span>
      <Badge variant="secondary" className={`text-[10px] ${cfg.className}`}>
        {cfg.label}
      </Badge>
    </div>
  );
}
