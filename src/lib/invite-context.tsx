"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, useState, useRef } from "react";
import {
  Invite,
  InviteTriggerType,
  INVITE_TRIGGER_MESSAGES,
  MOCK_SWARM_FRIENDS,
  generateReferralCode,
} from "./invite-types";
import { useGame } from "./game-context";
import { getLevelFromPoints } from "./types";

interface InviteState {
  invites: Invite[];
  referralCode: string;
  lastJoinedFriend: string | null;
  triggerDismissedCount: number;
}

interface InviteContextValue extends InviteState {
  sendInvite: (inviteeName: string, inviteeEmail: string) => void;
  sendBulkInvites: (friends: { name: string; email: string }[]) => void;
  simulateAccept: (inviteId: string) => void;
  clearJoinedNotification: () => void;
  totalSent: number;
  totalConverted: number;
  recentInvites: Invite[];
  referralLink: string;
}

type Action =
  | { type: "SEND_INVITE"; invite: Invite }
  | { type: "ACCEPT_INVITE"; inviteId: string; inviteeName: string }
  | { type: "CLEAR_JOINED" }
  | { type: "DISMISS_TRIGGER" }
  | { type: "HYDRATE"; state: Partial<InviteState> };

const initialState: InviteState = {
  invites: [],
  referralCode: generateReferralCode(),
  lastJoinedFriend: null,
  triggerDismissedCount: 0,
};

function reducer(state: InviteState, action: Action): InviteState {
  switch (action.type) {
    case "SEND_INVITE":
      return { ...state, invites: [...state.invites, action.invite] };
    case "ACCEPT_INVITE":
      return {
        ...state,
        invites: state.invites.map((inv) =>
          inv.id === action.inviteId ? { ...inv, status: "converted" as const } : inv
        ),
        lastJoinedFriend: action.inviteeName,
      };
    case "CLEAR_JOINED":
      return { ...state, lastJoinedFriend: null };
    case "DISMISS_TRIGGER":
      return { ...state, triggerDismissedCount: state.triggerDismissedCount + 1 };
    case "HYDRATE":
      return { ...state, ...action.state };
    default:
      return state;
  }
}

const InviteContext = createContext<InviteContextValue | null>(null);

export function InviteProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("placemaker-invites");
      if (saved) {
        dispatch({ type: "HYDRATE", state: JSON.parse(saved) });
      }
    } catch {}
  }, []);

  useEffect(() => {
    const { lastJoinedFriend, ...persistable } = state;
    void lastJoinedFriend;
    localStorage.setItem("placemaker-invites", JSON.stringify(persistable));
  }, [state]);

  const sendInvite = useCallback(
    (inviteeName: string, inviteeEmail: string) => {
      const invite: Invite = {
        id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        inviterId: "current-user",
        inviteeName,
        inviteeEmail,
        referralCode: state.referralCode,
        status: "sent",
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: "SEND_INVITE", invite });

      // Simulate some invites being accepted after a delay for demo purposes
      if (Math.random() > 0.5) {
        setTimeout(() => {
          dispatch({ type: "ACCEPT_INVITE", inviteId: invite.id, inviteeName: invite.inviteeName });
        }, 8000 + Math.random() * 12000);
      }
    },
    [state.referralCode]
  );

  const sendBulkInvites = useCallback(
    (friends: { name: string; email: string }[]) => {
      friends.forEach((f) => sendInvite(f.name, f.email));
    },
    [sendInvite]
  );

  const simulateAccept = useCallback((inviteId: string) => {
    const invite = state.invites.find((i) => i.id === inviteId);
    if (invite) {
      dispatch({ type: "ACCEPT_INVITE", inviteId, inviteeName: invite.inviteeName });
    }
  }, [state.invites]);

  const clearJoinedNotification = useCallback(() => {
    dispatch({ type: "CLEAR_JOINED" });
  }, []);

  const totalSent = state.invites.length;
  const totalConverted = state.invites.filter((i) => i.status === "converted").length;
  const recentInvites = [...state.invites].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 10);
  const referralLink = `https://placemaker.foursquare.com/invite/${state.referralCode}`;

  return (
    <InviteContext.Provider
      value={{
        ...state,
        sendInvite,
        sendBulkInvites,
        simulateAccept,
        clearJoinedNotification,
        totalSent,
        totalConverted,
        recentInvites,
        referralLink,
      }}
    >
      {children}
    </InviteContext.Provider>
  );
}

export function useInvite() {
  const ctx = useContext(InviteContext);
  if (!ctx) throw new Error("useInvite must be used within InviteProvider");
  return ctx;
}

export function useInviteTrigger() {
  const { venueProgress, totalPoints } = useGame();
  const { totalSent, triggerDismissedCount } = useInvite();
  const inviteCtx = useContext(InviteContext);

  const [showTrigger, setShowTrigger] = useState(false);
  const [triggerType, setTriggerType] = useState<InviteTriggerType | null>(null);

  const prevProgressLen = useRef(venueProgress.length);
  const prevLevel = useRef(getLevelFromPoints(totalPoints).level);
  const tasksSinceLastTrigger = useRef(0);

  useEffect(() => {
    const currentLen = venueProgress.length;
    const currentLevel = getLevelFromPoints(totalPoints).level;

    if (currentLen > prevProgressLen.current) {
      tasksSinceLastTrigger.current += currentLen - prevProgressLen.current;

      // Milestone trigger: level changed
      if (currentLevel > prevLevel.current) {
        const timer = setTimeout(() => {
          setTriggerType("milestone");
          setShowTrigger(true);
        }, 2000);
        prevProgressLen.current = currentLen;
        prevLevel.current = currentLevel;
        return () => clearTimeout(timer);
      }

      // Collaboration gap: 5+ tasks done, 0 invites sent
      if (tasksSinceLastTrigger.current >= 5 && totalSent === 0 && triggerDismissedCount < 2) {
        const timer = setTimeout(() => {
          setTriggerType("collaboration_gap");
          setShowTrigger(true);
        }, 2000);
        tasksSinceLastTrigger.current = 0;
        prevProgressLen.current = currentLen;
        prevLevel.current = currentLevel;
        return () => clearTimeout(timer);
      }

      // Post-task trigger: every 3rd task
      if (tasksSinceLastTrigger.current >= 3) {
        const timer = setTimeout(() => {
          setTriggerType("post_task");
          setShowTrigger(true);
        }, 2000);
        tasksSinceLastTrigger.current = 0;
        prevProgressLen.current = currentLen;
        prevLevel.current = currentLevel;
        return () => clearTimeout(timer);
      }
    }

    prevProgressLen.current = currentLen;
    prevLevel.current = currentLevel;
  }, [venueProgress.length, totalPoints, totalSent, triggerDismissedCount]);

  const dismissTrigger = useCallback(() => {
    setShowTrigger(false);
    setTriggerType(null);
    inviteCtx && inviteCtx.triggerDismissedCount; // read only
    // dispatch dismiss via context isn't critical, just hide locally
  }, [inviteCtx]);

  const triggerMessage = triggerType ? INVITE_TRIGGER_MESSAGES[triggerType] : "";

  return { showTrigger, triggerType, triggerMessage, dismissTrigger };
}
