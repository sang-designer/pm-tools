"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IdentityHeaderVariant } from "@/components/landing/identity-header-variant";
import { TaskChoiceCardsVariant } from "@/components/landing/task-choice-cards-variant";
import { LocationIntelligenceCardVariant } from "@/components/landing/location-intelligence-card-variant";
import { 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Target, 
  Zap, 
  BarChart3,
  ArrowRight
} from "lucide-react";

function QuickActionsCard() {
  const quickActions = [
    { title: "Resume Last Session", description: "Continue where you left off", taskCount: 3, icon: ArrowRight, color: "blue" },
    { title: "Nearby Quick Tasks", description: "8 locations within 1 mile", taskCount: 8, icon: Target, color: "green" },
    { title: "High Priority Items", description: "3 urgent verifications", taskCount: 3, icon: Clock, color: "orange" },
    { title: "Your Specialties", description: "Restaurant data updates", taskCount: 5, icon: CheckCircle, color: "purple" },
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start h-auto p-3 hover:bg-muted/50"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className={`p-2 rounded-lg ${
                action.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                action.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                action.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30' :
                'bg-purple-100 dark:bg-purple-900/30'
              }`}>
                <action.icon className={`h-4 w-4 ${
                  action.color === 'blue' ? 'text-blue-600' :
                  action.color === 'green' ? 'text-green-600' :
                  action.color === 'orange' ? 'text-orange-600' :
                  'text-purple-600'
                }`} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="font-medium">{action.taskCount}</span>
                <span>tasks</span>
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

function SidebarStats() {
  const PurpleProgress = ({ value = 0, className = "" }: { value?: number; className?: string }) => (
    <div className={`relative w-full overflow-hidden rounded-full bg-secondary ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 transition-all duration-500 ease-out shadow-sm"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Today's Productivity */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold">Today&apos;s Productivity</h3>
        </div>
        
        <div className="space-y-4">
          {/* Time Efficiency */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Average Task Time</span>
              <span className="font-medium text-green-600">4.2 min</span>
            </div>
            <div className="text-xs text-muted-foreground">
              ⬇️ 1.3 min faster than yesterday
            </div>
          </div>

          {/* Completion Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completion Rate</span>
              <span className="font-medium">94%</span>
            </div>
            <PurpleProgress value={94} className="h-1" />
          </div>
        </div>
      </div>

      <Separator />

      {/* This Week */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">This Week</h3>
        </div>
        
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-2xl font-bold">8/15</div>
            <div className="text-sm text-muted-foreground">tasks completed</div>
          </div>
          <PurpleProgress value={53} className="h-2" />
          <div className="text-xs text-center text-muted-foreground">
            7 more to reach weekly goal
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-3 pt-4">
          <h4 className="text-base font-medium">Recent Activity</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Today</span>
              <Badge variant="outline" className="text-xs">2 completed</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Yesterday</span>
              <Badge variant="outline" className="text-xs">5 completed</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">This week</span>
              <Badge variant="secondary" className="text-xs">8 total</Badge>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Pro Tip */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold">Pro Tip</h3>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium">
            Batch similar tasks together
          </div>
          <div className="text-xs text-muted-foreground">
            Complete all &quot;hours verification&quot; tasks in one session to increase efficiency by 35%
          </div>
        </div>
      </div>
    </div>
  );
}

export function ConceptBEfficiency() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-slate-950 dark:via-gray-950 dark:to-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Streamlined Header */}
        <div className="mb-6">
          <IdentityHeaderVariant variant="minimal" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* Left Column - Tasks & Actions */}
          <div className="xl:col-span-3 space-y-4 sm:space-y-6">
            {/* Primary Task Cards */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <h2 className="text-xl font-semibold">Choose Your Focus</h2>
              </div>
              <TaskChoiceCardsVariant variant="efficiency" />
            </div>

            {/* Quick Actions */}
            <QuickActionsCard />

            {/* Area Overview */}
            <LocationIntelligenceCardVariant variant="efficiency" />
          </div>

          {/* Right Sidebar - Stats & Progress */}
          <div className="xl:col-span-1 space-y-4 sm:space-y-6 order-first xl:order-last">
            <SidebarStats />
          </div>
        </div>
      </div>
    </div>
  );
}