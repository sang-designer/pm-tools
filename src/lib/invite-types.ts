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

export const INVITE_TRIGGER_MESSAGES: Record<InviteTriggerType, string> = {
  post_task: "You just helped improve a place! Invite friends to contribute together.",
  milestone: "You've reached a new level! Celebrate by inviting friends to join.",
  collaboration_gap: "You're contributing alone — invite others to make a bigger impact together.",
};

export function generateReferralCode(): string {
  return `PM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}
