export type TaskType =
  | "verify_address"
  | "confirm_category"
  | "fix_coordinates"
  | "confirm_hours"
  | "photo_verification";

export interface Task {
  id: string;
  type: TaskType;
  question: string;
  options?: string[];
  venueId: string;
}

export type VenueState = "unvisited" | "in_progress" | "completed" | "completed_globally";

export interface VenueHours {
  day: string;
  hours: string;
}

export interface VenueDetail {
  phone?: string;
  hours?: VenueHours[];
  website?: string;
  facebook?: string;
  instagram?: string;
  features?: string[];
  fsqPlaceId?: string;
  photos?: string[];
  uniqueVisitors?: number;
  totalCheckins?: number;
  visitedLast60Days?: number;
  suggestedAddress?: string;
  suggestedPhone?: string;
  suggestedHours?: VenueHours[];
  categories?: string[];
  suggestedCategories?: string[];
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: string;
  tags: string[];
  tasks: Task[];
  globallyCompleted: boolean;
  veracityRating?: number;
  detail?: VenueDetail;
  parentVenue?: { id: string; name: string };
}

export interface VenueProgress {
  venueId: string;
  taskId: string;
  completedAt: string;
  pointsAwarded: number;
}

export type AppMode = "classic" | "quest";

export interface GameState {
  mode: AppMode;
  totalPoints: number;
  currentStreak: number;
  bestStreak: number;
  venueProgress: VenueProgress[];
  proposedCount: number;
  approvedCount: number;
}

export const TASK_LABELS: Record<TaskType, string> = {
  verify_address: "Verify Address",
  confirm_category: "Confirm Category",
  fix_coordinates: "Fix Coordinates",
  confirm_hours: "Confirm Hours",
  photo_verification: "Photo Verification",
};

export const VENUE_STATE_COLORS: Record<VenueState, string> = {
  unvisited: "#f97316",
  in_progress: "#f97316",
  completed: "#3b82f6",
  completed_globally: "#1a1a1a",
};

export const POINTS = {
  COMPLETE_TASK: 10,
  FIRST_AT_VENUE: 5,
  STREAK_BONUS: 20,
  NEW_AREA: 15,
  STREAK_THRESHOLD: 3,
} as const;

const LEVEL_NAMES: Record<number, string> = {
  0: "Apprentice",
  1: "Apprentice",
  2: "Explorer",
  3: "Contributor",
  4: "Guide",
  5: "Expert",
  6: "Master",
  7: "Champion",
  8: "Legend",
  9: "Grandmaster",
};

export function getLevelFromPoints(points: number): { level: number; levelName: string; progress: number; pointsForNext: number } {
  const thresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000];
  let level = 0;
  for (let i = 1; i < thresholds.length; i++) {
    if (points >= thresholds[i]) {
      level = i;
    } else {
      break;
    }
  }
  if (points > 0 && level === 0) level = 1;
  const currentThreshold = thresholds[level] || 0;
  const nextThreshold = thresholds[level + 1] || thresholds[1] || 100;
  const range = nextThreshold - currentThreshold;
  const progress = range > 0 ? (points - currentThreshold) / range : 0;
  return { level, levelName: LEVEL_NAMES[level] || `Level ${level}`, progress: Math.min(progress, 1), pointsForNext: nextThreshold - points };
}

export type WoeStatus = "open" | "resolved";
export type WoeType = "info" | "apa" | "atvc" | "suspicious";

export interface VenueWoe {
  id: string;
  venueId: string;
  status: WoeStatus;
  type: WoeType;
  summary: string;
  description: string;
  reportedBy: { id: string; name: string; role: string; power: number };
  reportedAt: string;
  resolvedAt?: string;
  woeId: string;
  score: number;
  acceptGoal: number;
  rejectGoal: number;
  probability: number;
  reasons: string;
  comments: string;
}
