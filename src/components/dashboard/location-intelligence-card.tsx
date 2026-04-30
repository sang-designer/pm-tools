"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserStats } from "@/hooks/use-user-stats";
import { 
  MapPin, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Activity,
  AlertCircle,
  ListTodo 
} from "lucide-react";

export function LocationIntelligenceCard() {
  const { locationStats, isLoading, availableLocations, switchLocation } = useUserStats();

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-5 w-40 bg-muted rounded" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-8 w-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!locationStats) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8 text-muted-foreground">
          <div className="text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Location data unavailable</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const completionRate = (locationStats.verifiedCount / locationStats.totalLocations) * 100;
  const pendingRate = (locationStats.pendingCount / locationStats.totalLocations) * 100;
  const healthScore = Math.round(locationStats.regionHealth * 100);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Area Overview</CardTitle>
            {/* Demo location switcher using shadcn Select */}
            <Select 
              value={locationStats.homeZone} 
              onValueChange={(value) => value && switchLocation(value)}
            >
              <SelectTrigger className="w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="pb-8">
                {availableLocations.map(location => (
                  <SelectItem key={location.homeZone} value={location.homeZone}>
                    {location.homeZone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Locations */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ListTodo className="h-4 w-4" />
              Total Locations
            </div>
            <div className="text-2xl font-bold">
              {locationStats.totalLocations.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(locationStats.totalLocations * 0.3)} tasks available
            </p>
          </div>

          {/* Approved Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4" />
              Approved
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-green-600">
                {locationStats.verifiedCount.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">
                ({Math.round(completionRate)}%)
              </span>
            </div>
          </div>

          {/* Pending Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Pending Review
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-orange-600">
                {locationStats.pendingCount.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">
                ({Math.round(pendingRate)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t">
          {/* Region Health */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Region Health
              <Badge 
                variant={healthScore >= 80 ? "outline" : healthScore >= 60 ? "secondary" : "destructive"}
                className={`text-xs ${healthScore >= 80 ? "bg-blue-100 text-blue-800 border-blue-300" : ""}`}
              >
                {healthScore >= 80 ? "Excellent" : healthScore >= 60 ? "Good" : "Needs Attention"}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold">{healthScore}%</div>
              <div className="flex-1 text-sm text-muted-foreground">Overall data quality and completeness</div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">This Week</h4>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div>
                  <div className="text-2xl font-semibold text-black">{locationStats.weeklyStats.locationsAdded}</div>
                  <div className="text-xs text-muted-foreground">Added</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-green-600">{locationStats.weeklyStats.issuesResolved}</div>
                  <div className="text-xs text-muted-foreground">Resolved</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Activity className="h-4 w-4 text-green-600" />
                Recent Activity
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm">{locationStats.recentActivity}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Top Contributors (This week)</h4>
              {locationStats.topContributors.slice(0, 3).map((contributor, index) => (
                <div key={contributor.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-4">#{index + 1}</span>
                    <span>{contributor.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {contributor.contributions}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Hint */}
        {pendingRate > 15 && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <p className="text-sm text-orange-700 dark:text-orange-300">
              High pending count detected. Consider focusing on High Impact tasks to improve region health.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}