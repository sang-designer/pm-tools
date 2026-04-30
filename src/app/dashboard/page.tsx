"use client";

import { IdentityHeader } from "@/components/dashboard/identity-header";
import { TaskChoiceCards } from "@/components/dashboard/task-choice-cards";
import { LocationIntelligenceCard } from "@/components/dashboard/location-intelligence-card";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav activeTab="Dashboard" />
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        {/* Identity Header */}
        <div className="mb-6 sm:mb-8">
          <IdentityHeader />
        </div>

        {/* Split Task Cards - Main Focus */}
        <div className="mb-6 sm:mb-8">
          <TaskChoiceCards />
        </div>

        {/* Location Intelligence - Bottom Summary */}
        <div>
          <LocationIntelligenceCard />
        </div>
      </div>
    </div>
  );
}