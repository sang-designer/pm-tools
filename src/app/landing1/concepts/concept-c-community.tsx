"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IdentityHeaderVariant } from "@/components/landing/identity-header-variant";
import { TaskChoiceCardsVariant } from "@/components/landing/task-choice-cards-variant";
import { LocationIntelligenceCardVariant } from "@/components/landing/location-intelligence-card-variant";
import { useUserStats } from "@/hooks/use-user-stats";
import { 
  Users, 
  TrendingUp, 
  Award,
  Handshake
} from "lucide-react";

function CommunityImpactCard() {
  const { locationStats, isLoading } = useUserStats();

  if (isLoading || !locationStats) {
    return <div className="animate-pulse p-6 h-32" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4">
        <TrendingUp className="h-6 w-6 text-slate-600" />
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">
          Community Impact This Week
        </h2>
      </div>
      
      {/* Impact Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4">
          <div className="text-2xl font-bold text-slate-600">
            {locationStats.weeklyStats.locationsAdded}
          </div>
          <div className="text-sm text-muted-foreground">Places Added</div>
        </div>
        <div className="text-center p-4">
          <div className="text-2xl font-bold text-slate-600">
            {locationStats.weeklyStats.verificationsCompleted}
          </div>
          <div className="text-sm text-muted-foreground">Verified</div>
        </div>
        <div className="text-center p-4">
          <div className="text-2xl font-bold text-blue-600">
            {locationStats.weeklyStats.issuesResolved}
          </div>
          <div className="text-sm text-muted-foreground">Issues Fixed</div>
        </div>
      </div>
    </div>
  );
}

function LocalContributorsCard() {
  const { locationStats, userStats, isLoading } = useUserStats();

  if (isLoading || !locationStats || !userStats) {
    return <Card className="animate-pulse"><CardContent className="p-6 h-48" /></Card>;
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg font-semibold">Your Local Community</CardTitle>
        </div>
        <Badge variant="outline" className="text-[10px] w-fit">
          {locationStats.homeZone}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Top Contributors */}
        <div className="space-y-3">
          {locationStats.topContributors.map((contributor, index) => (
            <div key={contributor.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contributor.name.replace(/\s+/g, '')}&backgroundColor=b6e3f4,c0aede,d1d4f9`} />
                  <AvatarFallback className="text-sm bg-gradient-to-br from-slate-400 to-gray-500 text-white">
                    {contributor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {contributor.name}
                    {contributor.name === userStats.name && (
                      <Badge variant="secondary" className="text-xs">You</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {contributor.contributions} places verified
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {index === 0 && <Award className="h-4 w-4 text-yellow-500" />}
                <div className="text-right">
                  <div className="text-sm font-medium">#{index + 1}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Stats */}
        <div className="pt-3 border-t space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Active contributors</span>
            <span className="font-medium">23 this week</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">New members</span>
            <span className="font-medium text-slate-600">+5 this month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CommunityMissionsCard() {
  const { locationStats, isLoading } = useUserStats();

  if (isLoading || !locationStats) {
    return <Card className="animate-pulse"><CardContent className="p-6 h-32" /></Card>;
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Handshake className="h-5 w-5 text-purple-600" />
          <CardTitle className="text-lg font-semibold">Community Missions</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {locationStats.regionChallenges.map((challenge, index) => (
          <div key={index} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="font-medium flex items-center gap-2">
                  {challenge.title}
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      challenge.priority === 'high' 
                        ? 'border-red-200 text-red-700 bg-red-50 dark:border-red-800 dark:text-red-300 dark:bg-red-900/20' 
                        : challenge.priority === 'medium'
                        ? 'border-orange-200 text-orange-700 bg-orange-50 dark:border-orange-800 dark:text-orange-300 dark:bg-orange-900/20'
                        : 'border-yellow-200 text-yellow-700 bg-yellow-50 dark:border-yellow-800 dark:text-yellow-300 dark:bg-yellow-900/20'
                    }`}
                  >
                    {challenge.priority} priority
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {challenge.description}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>Community effort</span>
              </div>
              <Button variant="outline" size="sm" className="text-xs">
                Join Mission
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ConceptCCommunity() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/30 via-background to-gray-50/30 dark:from-slate-900/10 dark:via-background dark:to-gray-900/10">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Community-Focused Header */}
        <div className="mb-4">
          <IdentityHeaderVariant variant="community" />
        </div>

        {/* Community Impact and Local Community - same row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2 space-y-4">
            <CommunityImpactCard />
            
            {/* Help Your Community */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Help Your Community</h2>
                <p className="text-sm text-muted-foreground">
                  Your contributions directly improve local business discovery and help neighbors find accurate information.
                </p>
              </div>
              <TaskChoiceCardsVariant variant="community" />
            </div>

            {/* Community Health and Area Needs - moved under Help Your Community */}
            <LocationIntelligenceCardVariant variant="community" />
          </div>
          
          <div className="space-y-6">
            <LocalContributorsCard />
            <CommunityMissionsCard />
          </div>
        </div>
      </div>
    </div>
  );
}