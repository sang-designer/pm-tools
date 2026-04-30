"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useUserStats } from "@/hooks/use-user-stats";
import { 
  MapPin, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Award,
  Target,
  Activity,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

// Custom Progress component with purple gradient for gamified variant  
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

interface LocationIntelligenceCardProps {
  variant?: "default" | "gamified" | "efficiency" | "community";
  className?: string;
}

export function LocationIntelligenceCardVariant({ 
  variant = "default", 
  className 
}: LocationIntelligenceCardProps) {
  const { locationStats, isLoading, error } = useUserStats();

  if (isLoading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardHeader>
          <div className="h-5 w-32 bg-muted rounded" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
          <div className="h-4 w-1/2 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  if (error || !locationStats) {
    return (
      <Card className={cn("", className)}>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>Unable to load location information</p>
        </CardContent>
      </Card>
    );
  }

  // Variant-specific rendering
  switch (variant) {
    case "gamified":
      return (
        <div className={cn("space-y-6", className)}>
          {/* Leaderboard Card */}
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-lg font-bold text-foreground">
                  Regional Champions
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {locationStats.topContributors.map((contributor, index) => (
                <div key={contributor.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      index === 0 
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' 
                        : index === 1
                        ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'
                        : 'bg-gradient-to-r from-orange-300 to-orange-500 text-white'
                    }`}>
                      #{index + 1}
                    </div>
                    <span className="font-medium">{contributor.name}</span>
                    {index === 0 && <Badge className="text-xs bg-yellow-100 text-yellow-800">👑 Legend</Badge>}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{contributor.contributions}</div>
                    <div className="text-xs text-muted-foreground">verified</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievement Progress */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-lg font-semibold">Weekly Challenge</CardTitle>
                </div>
                <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                  +500 XP Bonus
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Regional Verification Goal</span>
                  <span className="font-medium">
                    {locationStats.weeklyStats.verificationsCompleted}/200
                  </span>
                </div>
                <PurpleProgress 
                  value={(locationStats.weeklyStats.verificationsCompleted / 200) * 100} 
                  className="h-2"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/30 rounded">
                  <div className="font-bold text-purple-600">{locationStats.weeklyStats.locationsAdded}</div>
                  <div className="text-muted-foreground">Added</div>
                </div>
                <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                  <div className="font-bold text-blue-600">{locationStats.weeklyStats.verificationsCompleted}</div>
                  <div className="text-muted-foreground">Verified</div>
                </div>
                <div className="text-center p-2 bg-green-50 dark:bg-green-900/30 rounded">
                  <div className="font-bold text-green-600">{locationStats.weeklyStats.issuesResolved}</div>
                  <div className="text-muted-foreground">Fixed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );

    case "efficiency":
      return (
        <div className={cn("space-y-4", className)}>
          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg font-semibold">Area Overview</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{locationStats.pendingCount}</div>
                  <div className="text-sm text-muted-foreground">Tasks Available</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(locationStats.regionHealth * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Data Quality</div>
                </div>
              </div>

              {/* Today's Activity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Recent Activity</span>
                  <span className="text-green-600 font-medium">{locationStats.recentActivity}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  View nearby tasks
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  See completed work
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );

    case "community":
      return (
        <div className={cn("space-y-6", className)}>
          {/* Community Health */}
          <Card className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-slate-600" />
                <CardTitle className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                  Community Health
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-600">
                    {Math.round(locationStats.regionHealth * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {locationStats.homeZone} Health Score
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{locationStats.totalLocations.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">total places</div>
                </div>
              </div>

              <Progress value={locationStats.regionHealth * 100} className="h-2" />
              
              <div className="text-sm text-muted-foreground">
                {locationStats.recentActivity}
              </div>
            </CardContent>
          </Card>

          {/* Regional Challenges */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-lg font-semibold">Area Needs Your Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {locationStats.regionChallenges.map((challenge, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      challenge.priority === 'high' 
                        ? 'bg-red-500' 
                        : challenge.priority === 'medium'
                        ? 'bg-orange-500'
                        : 'bg-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium">{challenge.title}</div>
                      <div className="text-sm text-muted-foreground">{challenge.description}</div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        challenge.priority === 'high' 
                          ? 'border-red-200 text-red-700 bg-red-50' 
                          : challenge.priority === 'medium'
                          ? 'border-orange-200 text-orange-700 bg-orange-50'
                          : 'border-yellow-200 text-yellow-700 bg-yellow-50'
                      }`}
                    >
                      {challenge.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      );

    default:
      // Default variant (existing implementation)
      return (
        <Card className={cn("", className)}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-semibold">Location Intelligence</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs">
                {locationStats.homeZone}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-muted-foreground">Verified</span>
                </div>
                <div className="text-xl font-bold text-foreground">
                  {locationStats.verifiedCount.toLocaleString()}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
                <div className="text-xl font-bold text-foreground">
                  {locationStats.pendingCount}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Region Health</span>
                <span className="font-medium">
                  {Math.round(locationStats.regionHealth * 100)}%
                </span>
              </div>
              <Progress value={locationStats.regionHealth * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Recent Activity</span>
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {locationStats.recentActivity}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Top Contributors</span>
              </div>
              <div className="pl-6 space-y-1">
                {locationStats.topContributors.slice(0, 3).map((contributor, index) => (
                  <div key={contributor.name} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {index + 1}. {contributor.name}
                    </span>
                    <span className="font-medium">{contributor.contributions}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      );
  }
}