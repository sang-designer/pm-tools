"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, TrendingUp, Users, Award, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Custom Progress component with purple gradient for gamified variant
function PurpleProgress({ value = 0, className = "" }: { value?: number; className?: string }) {
  return (
    <div className={`relative h-1 w-full overflow-hidden rounded-full bg-secondary ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 transition-all duration-500 ease-out shadow-sm"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

interface TaskChoiceCardsProps {
  variant?: "default" | "gamified" | "efficiency" | "community";
  className?: string;
}

export function TaskChoiceCardsVariant({ variant = "default", className }: TaskChoiceCardsProps) {
  const router = useRouter();

  const handleHighImpactClick = () => {
    router.push("/?mode=classic");
  };

  const handleQuickDailyClick = () => {
    router.push("/?mode=quest");
  };

  // Variant-specific rendering
  switch (variant) {
    case "gamified":
      return (
        <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6", className)}>
          {/* High Impact Card - Gamified */}
          <Card className="group relative cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/50">
            {/* XP Reward Badge */}
            <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground font-medium">
              +50 XP
            </Badge>
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-lg">
                      <Target className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      High Impact Quest
                    </CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Epic venue challenges • Master difficulty
                  </p>
                  
                  {/* Difficulty indicators */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < 4 ? 'text-primary fill-current' : 'text-muted'}`} />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">Expert Level</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Deep venue verification</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">+15 XP</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Complex data validation</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">+20 XP</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Quality improvements</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">+15 XP</Badge>
                </div>
              </div>
              
              <Button 
                className="w-full"
                onClick={handleHighImpactClick}
              >
                Start Epic Quest
              </Button>
            </CardContent>
          </Card>

          {/* Quick Daily Card - Gamified */}
          <Card className="group relative cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/50">
            {/* Quick XP Badge */}
            <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground font-medium">
              +5-15 XP
            </Badge>
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-lg">
                      <Zap className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      Daily Missions
                    </CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Quick wins • Perfect for streaks
                  </p>
                  
                  {/* Speed indicators */}
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-primary" />
                    <Zap className="h-3 w-3 text-primary" />
                    <Zap className="h-3 w-3 text-muted" />
                    <span className="text-xs text-muted-foreground ml-1">Fast Track</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Quick confirmations</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">+5 XP</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Location spotchecks</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">+10 XP</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">My World map view</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">+15 XP</Badge>
                </div>
              </div>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleQuickDailyClick}
              >
                Start Daily Missions
              </Button>
            </CardContent>
          </Card>
        </div>
      );

    case "efficiency":
      return (
        <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-4", className)}>
          {/* High Impact Card - Efficiency */}
          <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-gray-900">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg font-semibold">High Impact Tasks</CardTitle>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Venue-based verification</span>
                <Badge variant="outline" className="text-xs">High Value</Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div className="p-2 bg-muted/50 rounded">
                  <div className="font-medium">3</div>
                  <div className="text-muted-foreground">Pending</div>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <div className="font-medium">15m</div>
                  <div className="text-muted-foreground">Avg Time</div>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <div className="font-medium">High</div>
                  <div className="text-muted-foreground">Impact</div>
                </div>
              </div>
              
              <Button 
                className="w-full"
                onClick={handleHighImpactClick}
              >
                Continue Tasks
              </Button>
            </CardContent>
          </Card>

          {/* Quick Daily Card - Efficiency */}
          <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-slate-600" />
                  <CardTitle className="text-lg font-semibold">Quick Tasks</CardTitle>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Map-based micro-tasks</span>
                <Badge variant="outline" className="text-xs">Quick Wins</Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div className="p-2 bg-muted/50 rounded">
                  <div className="font-medium">12</div>
                  <div className="text-muted-foreground">Available</div>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <div className="font-medium">3m</div>
                  <div className="text-muted-foreground">Avg Time</div>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <div className="font-medium">7 left</div>
                  <div className="text-muted-foreground">To Goal</div>
                </div>
              </div>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleQuickDailyClick}
              >
                Start Quick Session
              </Button>
            </CardContent>
          </Card>
        </div>
      );

    case "community":
      return (
        <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6", className)}>
          {/* High Impact Card - Community */}
          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-slate-300 bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900/20 dark:via-gray-900 dark:to-gray-900/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-slate-500 to-gray-600 rounded-lg">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-700 dark:text-slate-300">
                      Regional Impact
                    </CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Help improve your community&apos;s data quality
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              {/* Community stats */}
              <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg">
                <Users className="h-5 w-5 text-slate-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Bay Area Contributors</div>
                  <div className="text-xs text-muted-foreground">23 active this week</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-600">156</div>
                  <div className="text-xs text-muted-foreground">verified</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-slate-600" />
                  <span className="text-sm">Deep venue verification</span>
                  <Badge variant="secondary" className="text-xs ml-auto">Community Priority</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-gray-600" />
                  <span className="text-sm">Missing hours & contacts</span>
                  <Badge variant="secondary" className="text-xs ml-auto">High Need</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  <span className="text-sm">New business discovery</span>
                  <Badge variant="secondary" className="text-xs ml-auto">Growing Area</Badge>
                </div>
              </div>
              
              <Button 
                variant="default"
                className="w-full"
                onClick={handleHighImpactClick}
              >
                Join Regional Effort
              </Button>
            </CardContent>
          </Card>

          {/* Quick Daily Card - Community */}
          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-blue-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-700 dark:text-slate-300">
                      Local Spotchecks
                    </CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Quick verifications in your neighborhood
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              {/* Community progress */}
              <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Today&apos;s Community Goal</div>
                  <PurpleProgress value={73} className="h-1 mt-1" />
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-600">73%</div>
                  <div className="text-xs text-muted-foreground">complete</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  <span className="text-sm">Confirm business hours</span>
                  <Badge variant="outline" className="text-xs ml-auto">12 nearby</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-cyan-600" />
                  <span className="text-sm">Verify locations</span>
                  <Badge variant="outline" className="text-xs ml-auto">8 nearby</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-indigo-600" />
                  <span className="text-sm">Update contact info</span>
                  <Badge variant="outline" className="text-xs ml-auto">5 nearby</Badge>
                </div>
              </div>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleQuickDailyClick}
              >
                Help Local Community
              </Button>
            </CardContent>
          </Card>
        </div>
      );

    default:
      // Default variant (existing implementation from task-choice-cards.tsx)
      return (
        <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6", className)}>
          {/* High Impact Card - Default */}
          <Card 
            className="group relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-primary/20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800"
            onClick={handleHighImpactClick}
          >
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fill-opacity%3D%221%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2247%22%20cy%3D%227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2217%22%20cy%3D%2217%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2237%22%20cy%3D%2217%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%227%22%20cy%3D%2227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2227%22%20cy%3D%2227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2247%22%20cy%3D%2227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2217%22%20cy%3D%2237%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2237%22%20cy%3D%2237%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%227%22%20cy%3D%2247%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2227%22%20cy%3D%2247%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2247%22%20cy%3D%2247%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none"></div>
            
            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-gray-600" />
                    <CardTitle className="text-lg font-bold">High Impact</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">Venue-based tasks</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-gray-600" />
                  <span className="text-sm">Deep venue verification</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-gray-600" />
                  <span className="text-sm">Complex data validation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-gray-600" />
                  <span className="text-sm">Quality improvements</span>
                </div>
              </div>
              
              <Button 
                variant="default"
                className="w-full"
                onClick={handleHighImpactClick}
              >
                Start High Impact Tasks
              </Button>
            </CardContent>
          </Card>

          {/* Quick Daily Card - Default */}
          <Card 
            className="group relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-primary/20"
            onClick={handleQuickDailyClick}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-gray-600" />
                    <CardTitle className="text-lg font-bold">Quick Daily</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">Map-based micro-tasks</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-gray-600" />
                  <span className="text-sm">Quick confirmations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-gray-600" />
                  <span className="text-sm">Location spotchecks</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-gray-600" />
                  <span className="text-sm">My World map view</span>
                </div>
              </div>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleQuickDailyClick}
              >
                Start Quick Tasks
              </Button>
            </CardContent>
          </Card>
        </div>
      );
  }
}