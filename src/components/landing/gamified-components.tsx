"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserStats } from "@/hooks/use-user-stats";
import { 
  Trophy, 
  Award, 
  Star, 
  Target, 
  Flame, 
  Calendar,
  TrendingUp
} from "lucide-react";

// Custom Progress component with purple gradient
function PurpleProgress({ value = 0, className = "" }: { value?: number; className?: string }) {
  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-secondary ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 transition-all duration-500 ease-out shadow-sm"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function AchievementShowcase() {
  const { userStats, isLoading } = useUserStats();

  if (isLoading || !userStats) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-5 w-32 bg-muted rounded" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 w-16 bg-muted rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const achievementIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    "First Verification": Trophy,
    "Week Streak": Flame,
    "Quality Contributor": Star,
    "Bay Area Expert": Target,
    "Power User": Award,
    "Month Streak": Calendar,
    "Location Pioneer": TrendingUp,
    "Data Detective": Target,
    "Community Helper": Trophy,
    "Quick Start": Star,
    "Detail Oriented": Award,
    "Weekend Warrior": Calendar,
    "Legend": Trophy,
    "Super Streak": Flame,
    "Regional Champion": Award,
    "Mentor": Star,
    "Quality Master": Trophy,
    "Speed Demon": TrendingUp,
  };

  const getAchievementStyle = (achievement: string) => {
    // Different tier styling based on achievement type
    const rarityStyles = {
      legendary: "bg-gradient-to-br from-purple-500/20 via-violet-500/20 to-purple-600/20 border-purple-400/50 shadow-lg shadow-purple-500/20",
      epic: "bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-blue-600/20 border-blue-400/50 shadow-lg shadow-blue-500/20", 
      rare: "bg-gradient-to-br from-slate-500/20 via-gray-500/20 to-slate-600/20 border-slate-400/50 shadow-lg shadow-slate-500/20",
      common: "bg-gradient-to-br from-slate-500/20 via-gray-500/20 to-slate-600/20 border-slate-400/50 shadow-lg shadow-slate-500/20"
    };

    // Assign rarity based on achievement names
    if (achievement.includes("Legend") || achievement.includes("Master") || achievement.includes("Champion")) {
      return rarityStyles.legendary;
    } else if (achievement.includes("Expert") || achievement.includes("Super") || achievement.includes("Power")) {
      return rarityStyles.epic;
    } else if (achievement.includes("Streak") || achievement.includes("Pioneer") || achievement.includes("Detective")) {
      return rarityStyles.rare;
    } else {
      return rarityStyles.common;
    }
  };

  const getIconColor = (achievement: string) => {
    if (achievement.includes("Legend") || achievement.includes("Master") || achievement.includes("Champion")) {
      return "text-purple-400";
    } else if (achievement.includes("Expert") || achievement.includes("Super") || achievement.includes("Power")) {
      return "text-blue-400";
    } else if (achievement.includes("Streak") || achievement.includes("Pioneer") || achievement.includes("Detective")) {
      return "text-slate-400";
    } else {
      return "text-slate-400";
    }
  };

  return (
    <Card className="bg-card border overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-background via-primary/5 to-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground">
                Achievement Collection
              </CardTitle>
              <p className="text-xs text-muted-foreground">Showcase your accomplishments</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30">
              {userStats.achievements.length} earned
            </Badge>
            <div className="text-xs text-muted-foreground">
              {Math.round((userStats.achievements.length / 12) * 100)}% complete
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {userStats.achievements.map((achievement, index) => {
            const Icon = achievementIcons[achievement] || Award;
            const iconColor = getIconColor(achievement);
            const badgeStyle = getAchievementStyle(achievement);
            
            return (
              <div
                key={index}
                className={`group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${badgeStyle}`}
                title={achievement}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                
                {/* Icon with glow */}
                <div className="relative">
                  <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${iconColor} transition-all duration-300 group-hover:scale-110`} />
                  <div className={`absolute inset-0 blur-sm ${iconColor} opacity-0 group-hover:opacity-50 transition-opacity duration-300`}>
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                </div>
                
                {/* Rarity indicator */}
                <div className="absolute top-1 right-1">
                  {achievement.includes("Legend") || achievement.includes("Master") || achievement.includes("Champion") ? (
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  ) : achievement.includes("Expert") || achievement.includes("Super") || achievement.includes("Power") ? (
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  ) : achievement.includes("Streak") || achievement.includes("Pioneer") || achievement.includes("Detective") ? (
                    <div className="w-2 h-2 bg-slate-400 rounded-full" />
                  ) : (
                    <div className="w-2 h-2 bg-slate-400 rounded-full" />
                  )}
                </div>
                
                {/* Enhanced tooltip */}
                <div className="absolute bottom-full mb-3 px-3 py-2 bg-popover/95 backdrop-blur-sm text-popover-foreground text-xs rounded-lg border shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-20 transform group-hover:translate-y-0 translate-y-1">
                  <div className="font-medium">{achievement}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {achievement.includes("Legend") || achievement.includes("Master") || achievement.includes("Champion") ? "Legendary" :
                     achievement.includes("Expert") || achievement.includes("Super") || achievement.includes("Power") ? "Epic" :
                     achievement.includes("Streak") || achievement.includes("Pioneer") || achievement.includes("Detective") ? "Rare" : "Common"}
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                    <div className="border-4 border-transparent border-t-popover/95" />
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Enhanced locked achievements */}
          {Array.from({ length: Math.max(0, 12 - userStats.achievements.length) }).map((_, i) => (
            <div
              key={`locked-${i}`}
              className="group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 border-dashed border-muted/50 bg-muted/10 cursor-not-allowed transition-all duration-300 hover:bg-muted/20"
              title="Achievement locked"
            >
              <div className="relative opacity-30">
                <Award className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground" />
              </div>
              
              {/* Lock overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-muted-foreground/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 border border-muted-foreground/40 rounded-full" />
                </div>
              </div>
              
              {/* Locked tooltip */}
              <div className="absolute bottom-full mb-3 px-3 py-2 bg-popover/95 backdrop-blur-sm text-popover-foreground text-xs rounded-lg border shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-20">
                <div className="font-medium">Achievement Locked</div>
                <div className="text-xs text-muted-foreground mt-1">Keep contributing to unlock!</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                  <div className="border-4 border-transparent border-t-popover/95" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {userStats.achievements.length > 0 && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <Trophy className="h-3 w-3 text-primary" />
              <span className="text-xs text-muted-foreground">Latest:</span>
              <span className="text-xs font-medium text-primary">{userStats.achievements[userStats.achievements.length - 1]}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function StreakCounter() {
  const { userStats, isLoading } = useUserStats();

  if (isLoading || !userStats) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-4">
          <div className="h-12 w-full bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Flame className="h-8 w-8 text-primary" />
              {userStats.streak > 7 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{userStats.streak}</div>
              <div className="text-sm text-muted-foreground">day streak</div>
            </div>
          </div>
          
          <div className="text-right">
            {userStats.streak >= 30 ? (
              <Badge className="bg-primary text-primary-foreground">
                🔥 On Fire!
              </Badge>
            ) : userStats.streak >= 7 ? (
              <Badge className="bg-secondary text-secondary-foreground">
                Hot Streak!
              </Badge>
            ) : (
              <Badge variant="outline">
                Keep Going!
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DailyGoalTracker() {
  const { userStats, isLoading } = useUserStats();

  if (isLoading || !userStats) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-4">
          <div className="h-16 w-full bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  const progressPercentage = (userStats.weeklyProgress / userStats.weeklyGoal) * 100;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg font-semibold">Weekly Goal</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {userStats.weeklyProgress}/{userStats.weeklyGoal}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <PurpleProgress value={progressPercentage} className="h-3" />
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">
            {Math.round(progressPercentage)}% complete
          </span>
        </div>
        
        {progressPercentage >= 100 ? (
          <div className="text-center p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <div className="text-sm font-medium text-green-700 dark:text-green-300">
              🎉 Goal achieved! Great work!
            </div>
          </div>
        ) : (
          <div className="text-center text-xs text-muted-foreground">
            {userStats.weeklyGoal - userStats.weeklyProgress} more to reach your goal
          </div>
        )}
      </CardContent>
    </Card>
  );
}