export interface SwarmFriend {
  id: string;
  name: string;
  avatar: string;
  isOnPlacemaker: boolean;
}

export interface Invite {
  id: string;
  inviterId: string;
  inviteeId?: string;
  inviteeName: string;
  inviteeEmail: string;
  referralCode: string;
  status: "sent" | "opened" | "converted";
  createdAt: string;
}

export type InviteTriggerType = "post_task" | "milestone" | "collaboration_gap";

export interface InviteTrigger {
  type: InviteTriggerType;
  message: string;
  dismissedAt?: string;
}

function avatarUrl(seed: string) {
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
}

export const MOCK_SWARM_FRIENDS: SwarmFriend[] = [
  { id: "sw-1", name: "Alex Chen", avatar: avatarUrl("alex-chen"), isOnPlacemaker: true },
  { id: "sw-2", name: "Maya Patel", avatar: avatarUrl("maya-patel"), isOnPlacemaker: false },
  { id: "sw-3", name: "Jordan Lee", avatar: avatarUrl("jordan-lee"), isOnPlacemaker: false },
  { id: "sw-4", name: "Sam Rivera", avatar: avatarUrl("sam-rivera"), isOnPlacemaker: true },
  { id: "sw-5", name: "Taylor Kim", avatar: avatarUrl("taylor-kim"), isOnPlacemaker: false },
  { id: "sw-6", name: "Riley Nguyen", avatar: avatarUrl("riley-nguyen"), isOnPlacemaker: false },
  { id: "sw-7", name: "Casey Brooks", avatar: avatarUrl("casey-brooks"), isOnPlacemaker: false },
  { id: "sw-8", name: "Morgan Silva", avatar: avatarUrl("morgan-silva"), isOnPlacemaker: true },
  { id: "sw-9", name: "Drew Harper", avatar: avatarUrl("drew-harper"), isOnPlacemaker: false },
  { id: "sw-10", name: "Quinn Foster", avatar: avatarUrl("quinn-foster"), isOnPlacemaker: false },
  { id: "sw-11", name: "Avery Tanaka", avatar: avatarUrl("avery-tanaka"), isOnPlacemaker: false },
  { id: "sw-12", name: "Jamie Ortiz", avatar: avatarUrl("jamie-ortiz"), isOnPlacemaker: false },
];

export const INVITE_TRIGGER_MESSAGES: Record<InviteTriggerType, string> = {
  post_task: "You just helped improve a place! Invite friends to contribute together.",
  milestone: "You've reached a new level! Celebrate by inviting friends to join.",
  collaboration_gap: "You're contributing alone — invite others to make a bigger impact together.",
};

export function generateReferralCode(): string {
  return `PM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}
