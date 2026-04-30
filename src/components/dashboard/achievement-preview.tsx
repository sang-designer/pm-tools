"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, ChevronRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { AchievementCollection } from "@/components/achievements/achievement-collection";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface Achievement {
  id: string;
  name: string;
  unlocked: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
  icon: string;
}

const recentAchievements: Achievement[] = [
  {
    id: "grand_master",
    name: "Grand Master",
    unlocked: true,
    rarity: "legendary",
    icon: "grand-master"
  },
  {
    id: "ultimate_achiever", 
    name: "Ultimate Achiever",
    unlocked: true,
    rarity: "legendary",
    icon: "ultimate-achiever"
  },
  {
    id: "premier_champion",
    name: "Premier Champion", 
    unlocked: true,
    rarity: "epic",
    icon: "premier-champion"
  },
  {
    id: "visionary_excellence",
    name: "Visionary Excellence",
    unlocked: true,
    rarity: "rare",
    icon: "visionary-excellence"
  },
  {
    id: "digital_pioneer",
    name: "Digital Pioneer",
    unlocked: true,
    rarity: "rare", 
    icon: "digital-pioneer"
  }
];

function getBadgeIcon(iconType: string) {
  const icons = {
    "grand-master": "⭐",
    "ultimate-achiever": "🦅",
    "innovation-leader": "⚛️", 
    "premier-champion": "👑",
    "platinum-elite": "💎",
    "legendary-vanguard": "⚔️",
    "visionary-excellence": "👁️",
    "peak-performance": "🏔️",
    "digital-pioneer": "🔬",
    "honorable-acclaim": "🏆"
  };
  
  return icons[iconType as keyof typeof icons] || "🏅";
}

export function AchievementPreview() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const unlockedCount = 7; // Based on our achievements data
  const totalCount = 10;
  
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-lg">Achievement Collection</CardTitle>
          </div>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger>
              <Button variant="ghost" size="sm" className="gap-2">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-4xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Achievement Collection</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <AchievementCollection />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Summary */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {unlockedCount} of {totalCount} unlocked
            </span>
          </div>
          <Progress value={(unlockedCount / totalCount) * 100} className="h-2" />
        </div>

        {/* Recent Achievements Grid */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Recent Unlocked</h4>
          <div className="grid grid-cols-5 gap-3">
            {recentAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Mini Badge */}
                <div className={cn(
                  "aspect-square rounded-xl p-2 border-2 transition-all duration-300 bg-card",
                  achievement.unlocked 
                    ? "border-border shadow-sm hover:shadow-md"
                    : "border-dashed border-muted-foreground/30 bg-muted/20"
                )}>
                  <div className={cn(
                    "w-full h-full rounded-lg flex items-center justify-center relative overflow-hidden text-lg",
                    achievement.unlocked ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {achievement.unlocked ? (
                      getBadgeIcon(achievement.icon)
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {achievement.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="pt-4 border-t text-center">
          <div className="text-lg font-bold text-foreground">{unlockedCount}</div>
          <div className="text-xs text-muted-foreground">Achievements Earned</div>
        </div>
      </CardContent>
    </Card>
  );
}