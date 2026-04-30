"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Lock, Trophy, Target, ChevronLeft, ChevronRight, Share2, Twitter, Facebook, Linkedin, Mail, MessageCircle, Link2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  name: string;
  description: string;
  howToEarn: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: string;
  icon: string; // We'll use CSS for the badge designs based on the image
  category: "contribution" | "quality" | "social" | "milestone" | "special";
}

const achievements: Achievement[] = [
  {
    id: "grand_master",
    name: "Grand Master",
    description: "The highest honor for exceptional contributions across all areas of Placemaker.",
    howToEarn: "Complete 1000+ verified contributions with 98%+ accuracy rate",
    rarity: "legendary",
    unlocked: true,
    unlockedAt: "2026-01-15",
    icon: "grand-master",
    category: "milestone"
  },
  {
    id: "ultimate_achiever",
    name: "Ultimate Achiever", 
    description: "Soared beyond all expectations with extraordinary dedication.",
    howToEarn: "Maintain a 30-day contribution streak with perfect quality scores",
    rarity: "legendary",
    unlocked: true,
    unlockedAt: "2026-02-20",
    icon: "ultimate-achiever",
    category: "milestone"
  },
  {
    id: "innovation_leader",
    name: "Innovation Leader",
    description: "Pioneered new approaches and innovative solutions in place data.",
    howToEarn: "Discover 50+ new venues and suggest 25+ data improvements",
    rarity: "epic",
    unlocked: false,
    progress: 38,
    maxProgress: 50,
    icon: "innovation-leader", 
    category: "contribution"
  },
  {
    id: "premier_champion",
    name: "Premier Champion",
    description: "Demonstrated royal excellence in place verification and quality.",
    howToEarn: "Achieve #1 ranking in monthly leaderboard 3 times",
    rarity: "epic",
    unlocked: true,
    unlockedAt: "2026-03-10",
    icon: "premier-champion",
    category: "quality"
  },
  {
    id: "platinum_elite",
    name: "Platinum Elite",
    description: "Reached the pinnacle of contributor excellence with stellar performance.",
    howToEarn: "Complete 500 verified contributions with 95%+ accuracy",
    rarity: "epic",
    unlocked: false,
    progress: 312,
    maxProgress: 500,
    icon: "platinum-elite",
    category: "milestone"
  },
  {
    id: "legendary_vanguard",
    name: "Legendary Vanguard",
    description: "A fearless pioneer who leads the way in uncharted territories.",
    howToEarn: "Be among the first 10 contributors in 5 new regions",
    rarity: "legendary",
    unlocked: false,
    progress: 3,
    maxProgress: 5,
    icon: "legendary-vanguard",
    category: "special"
  },
  {
    id: "visionary_excellence",
    name: "Visionary Excellence",
    description: "Possesses an exceptional eye for detail and quality insights.",
    howToEarn: "Successfully identify and correct 100 data inconsistencies",
    rarity: "rare",
    unlocked: true,
    unlockedAt: "2026-01-28",
    icon: "visionary-excellence",
    category: "quality"
  },
  {
    id: "peak_performance",
    name: "Peak Performance",
    description: "Reached the summit of contribution excellence in natural harmony.",
    howToEarn: "Complete 50 outdoor venue verifications with perfect scores",
    rarity: "rare",
    unlocked: false,
    progress: 23,
    maxProgress: 50,
    icon: "peak-performance",
    category: "contribution"
  },
  {
    id: "digital_pioneer",
    name: "Digital Pioneer",
    description: "Advanced the frontier of digital place intelligence and innovation.",
    howToEarn: "Use advanced verification tools 200+ times with high accuracy",
    rarity: "rare",
    unlocked: true,
    unlockedAt: "2026-02-05",
    icon: "digital-pioneer",
    category: "contribution"
  },
  {
    id: "honorable_acclaim",
    name: "Honorable Acclaim",
    description: "Earned recognition and respect through consistent, quality contributions.",
    howToEarn: "Maintain 4.8+ star rating from community for 60 days",
    rarity: "common",
    unlocked: true,
    unlockedAt: "2026-01-10",
    icon: "honorable-acclaim",
    category: "social"
  }
];

// Future achievements that are locked and discoverable
const futureAchievements: Achievement[] = [
  {
    id: "global_explorer",
    name: "Global Explorer",
    description: "Venture across continents to verify places around the world.",
    howToEarn: "Verify places in 10+ different countries",
    rarity: "legendary",
    unlocked: false,
    icon: "global-explorer",
    category: "special"
  },
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Dedicated contributor who works when others sleep.",
    howToEarn: "Complete 100 verifications between 10PM and 6AM",
    rarity: "rare",
    unlocked: false,
    icon: "night-owl",
    category: "contribution"
  },
  {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Lightning-fast verification skills with unmatched accuracy.",
    howToEarn: "Complete 50 verifications in under 2 minutes each with 95%+ accuracy",
    rarity: "epic",
    unlocked: false,
    icon: "speed-demon",
    category: "quality"
  },
  {
    id: "community_hero",
    name: "Community Hero",
    description: "A beloved member who helps and mentors fellow contributors.",
    howToEarn: "Help 25 new contributors complete their first 10 verifications",
    rarity: "epic",
    unlocked: false,
    icon: "community-hero",
    category: "social"
  },
  {
    id: "data_scientist",
    name: "Data Scientist",
    description: "Master of analytics and data-driven insights.",
    howToEarn: "Identify 200 data patterns that improve overall accuracy",
    rarity: "legendary",
    unlocked: false,
    icon: "data-scientist",
    category: "quality"
  },
  {
    id: "weekend_warrior",
    name: "Weekend Warrior",
    description: "Dedicated contributor who maximizes weekend productivity.",
    howToEarn: "Complete 500 verifications on weekends",
    rarity: "rare",
    unlocked: false,
    icon: "weekend-warrior",
    category: "contribution"
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Unwavering commitment to 100% accuracy.",
    howToEarn: "Achieve 100% accuracy on 1000 consecutive verifications",
    rarity: "legendary",
    unlocked: false,
    icon: "perfectionist",
    category: "quality"
  },
  {
    id: "local_legend",
    name: "Local Legend",
    description: "The go-to expert for your home region.",
    howToEarn: "Become #1 contributor in your region for 6 consecutive months",
    rarity: "epic",
    unlocked: false,
    icon: "local-legend",
    category: "milestone"
  }
];

export function AchievementCollection() {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const allAchievements = [...achievements, ...futureAchievements];

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const getShareText = (achievement: Achievement) => {
    return `🏆 I just earned the "${achievement.name}" badge on Placemaker! ${achievement.description}`;
  };

  const getShareUrl = () => {
    return typeof window !== 'undefined' ? window.location.href : '';
  };

  const handleShare = (platform: string, achievement: Achievement) => {
    const text = getShareText(achievement);
    const url = getShareUrl();
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=${encodeURIComponent(`I earned the ${achievement.name} badge!`)}&body=${encodedText}%0A%0A${encodedUrl}`,
      sms: `sms:?body=${encodedText} ${url}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(`${text}\n\n${url}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      return;
    }

    if (platform === 'native' && navigator.share) {
      navigator.share({
        title: `${achievement.name} Badge`,
        text: text,
        url: url,
      }).catch(() => {});
      return;
    }

    const shareUrl = shareUrls[platform];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-left space-y-1">
          <motion.h2 
            className="text-lg font-bold text-foreground tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Achievement Collection
          </motion.h2>
          <motion.p 
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {unlockedCount} of {allAchievements.length} badges unlocked
          </motion.p>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full border-2 transition-all duration-200",
              canScrollLeft 
                ? "border-primary/30 hover:border-primary hover:bg-primary/10" 
                : "border-muted opacity-40 cursor-not-allowed"
            )}
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full border-2 transition-all duration-200",
              canScrollRight 
                ? "border-primary/30 hover:border-primary hover:bg-primary/10" 
                : "border-muted opacity-40 cursor-not-allowed"
            )}
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Horizontal Scrolling Achievement Grid */}
      <div 
        ref={scrollContainerRef}
        onScroll={checkScrollButtons}
        className="overflow-x-auto overflow-y-visible pb-4 pt-2 -mx-4 px-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
      >
        <div className="flex gap-3 sm:gap-4 py-2" style={{ width: 'max-content' }}>
          {allAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            className="relative group cursor-pointer flex-shrink-0 w-20 sm:w-24"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.05, 0.5), duration: 0.5 }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedAchievement(achievement)}
            onMouseEnter={() => setHoveredId(achievement.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Badge Container */}
            <div className={cn(
              "relative aspect-square rounded-xl p-2.5 border-2 transition-all duration-300",
              achievement.unlocked 
                ? "bg-gradient-to-br from-slate-50/80 via-white to-gray-50/60 dark:from-slate-800/60 dark:via-slate-700/40 dark:to-slate-800/80 border-border shadow-sm hover:shadow-md"
                : "border-dashed border-muted-foreground/30 bg-muted/20",
              hoveredId === achievement.id && achievement.unlocked && "shadow-lg"
            )}>
              
              {/* Badge Icon - Using CSS classes that represent each badge design */}
              <div className={cn(
                "w-full h-full rounded-lg flex items-center justify-center relative overflow-hidden",
                achievement.unlocked ? "text-foreground" : "text-muted-foreground"
              )}>
                {achievement.unlocked ? (
                  <div className="text-2xl sm:text-3xl font-bold drop-shadow-sm">
                    {getBadgeIcon(achievement.icon)}
                  </div>
                ) : !achievement.progress ? (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                ) : null}
                
                {/* Sparkle Animation for Unlocked Badges */}
                {achievement.unlocked && hoveredId === achievement.id && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-0.5 h-0.5 bg-primary rounded-full"
                        style={{
                          left: `${20 + (i * 15)}%`,
                          top: `${15 + (i * 10)}%`,
                        }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                )}

                {/* Progress Ring for Locked Achievements */}
                {!achievement.unlocked && achievement.progress && achievement.maxProgress && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="relative w-10 h-10 mb-1">
                      <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-muted-foreground/30"
                          stroke="currentColor" 
                          strokeWidth="3"
                          fill="transparent"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <defs>
                          <linearGradient id={`gradient-${achievement.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#7c3aed" />
                          </linearGradient>
                        </defs>
                        <path
                          stroke={`url(#gradient-${achievement.id})`}
                          strokeWidth="3"
                          fill="transparent"
                          strokeDasharray={`${(achievement.progress / achievement.maxProgress) * 100}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      {/* Lock icon centered in the progress ring */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </div>
                    <span className="text-xs text-foreground font-semibold">
                      {Math.round((achievement.progress / achievement.maxProgress) * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Badge Name */}
            <motion.h3 
              className="text-xs font-semibold text-center mt-2 text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: (index * 0.1) + 0.3 }}
            >
              {achievement.name}
            </motion.h3>

            {/* Unlock Date */}
            {achievement.unlocked && achievement.unlockedAt && (
              <p className="text-xs text-muted-foreground text-center mt-1">
                Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
              </p>
            )}
          </motion.div>
        ))}
        </div>
      </div>

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <Dialog open={true} onOpenChange={() => setSelectedAchievement(null)}>
          <DialogContent 
            className="max-w-sm p-0 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 border-2 shadow-2xl [&>[data-slot=dialog-close]]:bg-transparent [&>[data-slot=dialog-close]]:text-white [&>[data-slot=dialog-close]]:hover:bg-transparent [&>[data-slot=dialog-close]]:hover:text-white"
          >
            <div className="relative">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 p-4 text-white relative overflow-hidden">
                  {/* Holographic Pattern Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent animate-pulse opacity-20" />
                  
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      <h3 className="text-lg font-bold text-white drop-shadow-lg">
                        {selectedAchievement.name}
                      </h3>
                      <div className="flex justify-center mt-1">
                        {selectedAchievement.unlocked ? (
                          <div className="flex items-center gap-1 text-yellow-200 text-xs">
                            <Trophy className="w-3 h-3" />
                            <span className="font-medium">ACHIEVED</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-gray-300 text-xs">
                            <Lock className="w-3 h-3" />
                            <span className="font-medium">LOCKED</span>
                          </div>
                        )}
                      </div>
                    </DialogTitle>
                  </DialogHeader>
                </div>

                {/* Large Central Artwork Area */}
                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-indigo-900 dark:to-purple-900 p-8 relative">
                  {/* Decorative Background Pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.1),transparent),radial-gradient(circle_at_70%_70%,rgba(147,51,234,0.1),transparent)]" />
                  
                  {/* Large Badge Icon */}
                  <div className="relative z-10 flex justify-center">
                    <div className={cn(
                      "w-32 h-32 rounded-2xl flex items-center justify-center relative overflow-hidden border-4 shadow-2xl",
                      selectedAchievement.unlocked 
                        ? "bg-gradient-to-br from-white via-gray-50 to-indigo-50 border-indigo-200 dark:from-slate-700 dark:via-slate-600 dark:to-indigo-800 dark:border-indigo-600"
                        : "bg-gradient-to-br from-gray-200 to-gray-300 border-gray-400 dark:from-slate-600 dark:to-slate-700 dark:border-slate-500"
                    )}>
                      {selectedAchievement.unlocked ? (
                        <div className="text-8xl drop-shadow-lg">
                          {getBadgeIcon(selectedAchievement.icon)}
                        </div>
                      ) : (
                        <Lock className="w-16 h-16 text-gray-500 dark:text-gray-400" />
                      )}
                      
                      {/* Shine Effect for Unlocked Badges */}
                      {selectedAchievement.unlocked && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-pulse" />
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Ring for Locked Achievements */}
                  {!selectedAchievement.unlocked && selectedAchievement.progress && selectedAchievement.maxProgress && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="relative w-40 h-40">
                        <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-gray-300 dark:text-gray-600"
                            stroke="currentColor" 
                            strokeWidth="2"
                            fill="transparent"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <defs>
                            <linearGradient id={`modal-gradient-${selectedAchievement.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#a855f7" />
                              <stop offset="50%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#7c3aed" />
                            </linearGradient>
                          </defs>
                          <path
                            stroke={`url(#modal-gradient-${selectedAchievement.id})`}
                            strokeWidth="2"
                            fill="transparent"
                            strokeDasharray={`${(selectedAchievement.progress / selectedAchievement.maxProgress) * 100}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                      </div>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {Math.round((selectedAchievement.progress / selectedAchievement.maxProgress) * 100)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Info Sections */}
                <div className="p-4 space-y-3 bg-white dark:bg-slate-800">
                  {/* Description */}
                  <div className="rounded-lg p-3">
                    <h4 className="font-bold text-xs text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wider">
                      Description
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedAchievement.description}
                    </p>
                  </div>

                  {/* How to Earn */}
                  <div className="rounded-lg p-3">
                    <h4 className="font-bold text-xs text-purple-600 dark:text-purple-400 mb-1 uppercase tracking-wider flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      Requirements
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedAchievement.howToEarn}
                    </p>
                  </div>

                  {/* Unlock Date */}
                  {selectedAchievement.unlocked && selectedAchievement.unlockedAt && (
                    <div className="rounded-lg p-3">
                      <h4 className="font-bold text-xs text-yellow-600 dark:text-yellow-400 mb-1 uppercase tracking-wider flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        Unlocked
                      </h4>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {new Date(selectedAchievement.unlockedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}

                  {/* Share Button - Only for unlocked achievements */}
                  {selectedAchievement.unlocked && (
                    <div className="pt-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="w-full">
                          <Button 
                            variant="outline" 
                            className="w-full gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 border-indigo-200 dark:border-indigo-700"
                          >
                            <Share2 className="w-4 h-4" />
                            Share Achievement
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-56">
                          <DropdownMenuItem 
                            onClick={() => handleShare('twitter', selectedAchievement)}
                            className="gap-3 cursor-pointer"
                          >
                            <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                            Share on X (Twitter)
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleShare('facebook', selectedAchievement)}
                            className="gap-3 cursor-pointer"
                          >
                            <Facebook className="w-4 h-4 text-[#1877F2]" />
                            Share on Facebook
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleShare('linkedin', selectedAchievement)}
                            className="gap-3 cursor-pointer"
                          >
                            <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                            Share on LinkedIn
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleShare('email', selectedAchievement)}
                            className="gap-3 cursor-pointer"
                          >
                            <Mail className="w-4 h-4 text-gray-600" />
                            Send via Email
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleShare('sms', selectedAchievement)}
                            className="gap-3 cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4 text-green-600" />
                            Send via Text Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleShare('copy', selectedAchievement)}
                            className="gap-3 cursor-pointer"
                          >
                            {copiedLink ? (
                              <>
                                <Check className="w-4 h-4 text-green-600" />
                                <span className="text-green-600">Link Copied!</span>
                              </>
                            ) : (
                              <>
                                <Link2 className="w-4 h-4 text-gray-600" />
                                Copy Link
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}

                  {/* Energy Symbols Footer */}
                  <div className="flex justify-center pt-2 border-t border-gray-100 dark:border-slate-700">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-purple-400 to-pink-500" />
                      <div className="w-2 h-2 rounded-full bg-gradient-to-br from-pink-400 to-red-500" />
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
    </div>
  );
}

// Helper function to get appropriate icons for each badge type
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
    "honorable-acclaim": "🏆",
    "global-explorer": "🌍",
    "night-owl": "🦉",
    "speed-demon": "⚡",
    "community-hero": "🦸",
    "data-scientist": "📊",
    "weekend-warrior": "🗓️",
    "perfectionist": "💯",
    "local-legend": "🏠"
  };
  
  return icons[iconType as keyof typeof icons] || "🏅";
}