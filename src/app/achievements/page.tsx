import { AchievementCollection } from "@/components/achievements/achievement-collection";

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <AchievementCollection />
      </div>
    </div>
  );
}