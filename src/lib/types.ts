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

export function getLevelFromPoints(points: number): { level: number; progress: number; pointsForNext: number } {
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
  return { level, progress: Math.min(progress, 1), pointsForNext: nextThreshold - points };
}
