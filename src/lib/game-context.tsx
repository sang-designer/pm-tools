"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { AppMode, GameState, POINTS, Venue, VenueState } from "./types";
import { MOCK_VENUES, INITIAL_COMPLETED_VENUES } from "./mock-data";

interface GameContextValue extends GameState {
  venues: Venue[];
  completeTask: (venueId: string, taskId: string) => void;
  skipTask: (venueId: string, taskId: string) => void;
  switchMode: (mode: AppMode) => void;
  getVenueState: (venueId: string) => VenueState;
  getNextVenue: (currentLat: number, currentLng: number) => Venue | null;
  selectedVenueId: string | null;
  setSelectedVenueId: (id: string | null) => void;
  lastPointsAwarded: number | null;
  lastStreakBonus: number | null;
  clearLastReward: () => void;
  skippedTasks: string[];
}

type Action =
  | { type: "COMPLETE_TASK"; venueId: string; taskId: string; points: number; streakBonus: number }
  | { type: "SKIP_TASK"; venueId: string; taskId: string }
  | { type: "SWITCH_MODE"; mode: AppMode }
  | { type: "SELECT_VENUE"; id: string | null }
  | { type: "CLEAR_REWARD" }
  | { type: "HYDRATE"; state: GameState };

interface FullState extends GameState {
  selectedVenueId: string | null;
  lastPointsAwarded: number | null;
  lastStreakBonus: number | null;
  skippedTasks: string[];
}

const initialState: FullState = {
  mode: "classic",
  totalPoints: 450,
  currentStreak: 0,
  bestStreak: 0,
  venueProgress: INITIAL_COMPLETED_VENUES.flatMap((vid) => {
    const venue = MOCK_VENUES.find((v) => v.id === vid);
    if (!venue) return [];
    return venue.tasks.map((t) => ({
      venueId: vid,
      taskId: t.id,
      completedAt: new Date(Date.now() - 86400000).toISOString(),
      pointsAwarded: 10,
    }));
  }),
  proposedCount: 15,
  approvedCount: 123,
  selectedVenueId: null,
  lastPointsAwarded: null,
  lastStreakBonus: null,
  skippedTasks: [],
};

function reducer(state: FullState, action: Action): FullState {
  switch (action.type) {
    case "COMPLETE_TASK": {
      const newStreak = state.currentStreak + 1;
      const totalAwarded = action.points + action.streakBonus;
      const newProgress = [
        ...state.venueProgress,
        {
          venueId: action.venueId,
          taskId: action.taskId,
          completedAt: new Date().toISOString(),
          pointsAwarded: totalAwarded,
        },
      ];
      const venue = MOCK_VENUES.find((v) => v.id === action.venueId);
      const completedTaskIds = newProgress
        .filter((p) => p.venueId === action.venueId)
        .map((p) => p.taskId);
      const handledTaskIds = [...completedTaskIds, ...state.skippedTasks];
      const allTasksHandled = venue
        ? venue.tasks.every((t) => handledTaskIds.includes(t.id))
        : true;
      return {
        ...state,
        totalPoints: state.totalPoints + totalAwarded,
        currentStreak: newStreak,
        bestStreak: Math.max(state.bestStreak, newStreak),
        proposedCount: state.proposedCount + 1,
        venueProgress: newProgress,
        selectedVenueId: allTasksHandled ? null : state.selectedVenueId,
        lastPointsAwarded: action.points,
        lastStreakBonus: action.streakBonus > 0 ? action.streakBonus : null,
      };
    }
    case "SKIP_TASK": {
      const newSkipped = [...state.skippedTasks, action.taskId];
      const venue = MOCK_VENUES.find((v) => v.id === action.venueId);
      const completedTaskIds = state.venueProgress
        .filter((p) => p.venueId === action.venueId)
        .map((p) => p.taskId);
      const allHandled = venue
        ? venue.tasks.every((t) => completedTaskIds.includes(t.id) || newSkipped.includes(t.id))
        : true;
      return {
        ...state,
        currentStreak: 0,
        skippedTasks: newSkipped,
        selectedVenueId: allHandled ? null : state.selectedVenueId,
      };
    }
    case "SWITCH_MODE":
      return { ...state, mode: action.mode, selectedVenueId: null };
    case "SELECT_VENUE":
      return { ...state, selectedVenueId: action.id };
    case "CLEAR_REWARD":
      return { ...state, lastPointsAwarded: null, lastStreakBonus: null };
    case "HYDRATE":
      return { ...state, ...action.state };
    default:
      return state;
  }
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("placemaker-game");
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: "HYDRATE", state: parsed });
      }
    } catch {}
  }, []);

  useEffect(() => {
    const { selectedVenueId, lastPointsAwarded, lastStreakBonus, ...persistable } = state;
    void selectedVenueId; void lastPointsAwarded; void lastStreakBonus;
    localStorage.setItem("placemaker-game", JSON.stringify(persistable));
  }, [state]);

  const getVenueState = useCallback(
    (venueId: string): VenueState => {
      const venue = MOCK_VENUES.find((v) => v.id === venueId);
      if (!venue) return "unvisited";
      if (venue.globallyCompleted) return "completed_globally";
      const completedTaskIds = state.venueProgress
        .filter((p) => p.venueId === venueId)
        .map((p) => p.taskId);
      const handledTaskIds = [...completedTaskIds, ...state.skippedTasks];
      const allHandled = venue.tasks.every((t) => handledTaskIds.includes(t.id));
      const allCompleted = venue.tasks.every((t) => completedTaskIds.includes(t.id));
      if (allCompleted) return "completed";
      if (allHandled) return "unvisited";
      if (completedTaskIds.length > 0 || state.selectedVenueId === venueId) return "in_progress";
      return "unvisited";
    },
    [state.venueProgress, state.selectedVenueId, state.skippedTasks]
  );

  const completeTask = useCallback(
    (venueId: string, taskId: string) => {
      const isFirstAtVenue = !state.venueProgress.some((p) => p.venueId === venueId);
      let points = POINTS.COMPLETE_TASK;
      if (isFirstAtVenue) points += POINTS.FIRST_AT_VENUE;

      const newStreakCount = state.currentStreak + 1;
      const streakBonus = newStreakCount % POINTS.STREAK_THRESHOLD === 0 ? POINTS.STREAK_BONUS : 0;

      dispatch({ type: "COMPLETE_TASK", venueId, taskId, points, streakBonus });
    },
    [state.venueProgress, state.currentStreak]
  );

  const getNextVenue = useCallback(
    (currentLat: number, currentLng: number): Venue | null => {
      const unvisited = MOCK_VENUES.filter((v) => {
        if (v.globallyCompleted) return false;
        const completedTaskIds = state.venueProgress
          .filter((p) => p.venueId === v.id)
          .map((p) => p.taskId);
        const handledTaskIds = [...completedTaskIds, ...state.skippedTasks];
        return !v.tasks.every((t) => handledTaskIds.includes(t.id));
      });
      if (unvisited.length === 0) return null;

      unvisited.sort((a, b) => {
        const distA = Math.sqrt((a.lat - currentLat) ** 2 + (a.lng - currentLng) ** 2);
        const distB = Math.sqrt((b.lat - currentLat) ** 2 + (b.lng - currentLng) ** 2);
        return distA - distB;
      });
      return unvisited[0];
    },
    [state.venueProgress, state.skippedTasks]
  );

  const switchMode = useCallback((mode: AppMode) => dispatch({ type: "SWITCH_MODE", mode }), []);
  const setSelectedVenueId = useCallback((id: string | null) => dispatch({ type: "SELECT_VENUE", id }), []);
  const clearLastReward = useCallback(() => dispatch({ type: "CLEAR_REWARD" }), []);
  const skipTask = useCallback(
    (venueId: string, taskId: string) => dispatch({ type: "SKIP_TASK", venueId, taskId }),
    []
  );

  return (
    <GameContext.Provider
      value={{
        ...state,
        venues: MOCK_VENUES,
        completeTask,
        skipTask,
        switchMode,
        getVenueState,
        getNextVenue,
        setSelectedVenueId,
        clearLastReward,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
