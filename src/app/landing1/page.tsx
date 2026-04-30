"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GamepadIcon, Zap, Users } from "lucide-react";

// Import concept components (will be created next)
import { ConceptAGamified } from "./concepts/concept-a-gamified";
import { ConceptBEfficiency } from "./concepts/concept-b-efficiency"; 
import { ConceptCCommunity } from "./concepts/concept-c-community";

export default function Landing1Page() {
  const [selectedConcept, setSelectedConcept] = useState("a");

  const concepts = [
    {
      id: "a",
      title: "Gamified Stats",
      description: "Achievement-focused with progress tracking",
      icon: GamepadIcon,
      color: "from-purple-500 to-blue-600",
      component: ConceptAGamified,
    },
    {
      id: "b", 
      title: "Task Efficiency",
      description: "Streamlined for maximum productivity",
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
      component: ConceptBEfficiency,
    },
    {
      id: "c",
      title: "Community Impact", 
      description: "Collaborative focus on local progress",
      icon: Users,
      color: "from-green-500 to-emerald-600",
      component: ConceptCCommunity,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Concept Selector Header */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Landing Page Concepts</h1>
              <p className="text-sm text-muted-foreground">Three different approaches to user engagement</p>
            </div>
            <Badge variant="outline" className="text-xs">Design Preview</Badge>
          </div>

          {/* Concept Tabs */}
          <Tabs value={selectedConcept} onValueChange={setSelectedConcept} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              {concepts.map((concept) => {
                const Icon = concept.icon;
                return (
                  <TabsTrigger
                    key={concept.id}
                    value={concept.id}
                    className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 h-auto data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-primary/5"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs sm:text-sm font-medium">{concept.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>

          {/* Concept Description */}
          <div className="mt-3">
            {concepts.map((concept) => (
              <div
                key={concept.id}
                className={`${
                  selectedConcept === concept.id ? "block" : "hidden"
                }`}
              >
                <p className="text-sm text-muted-foreground">{concept.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Concept Content */}
      <div className="relative">
        <Tabs value={selectedConcept} className="w-full">
          {concepts.map((concept) => {
            const Component = concept.component;
            return (
              <TabsContent key={concept.id} value={concept.id} className="mt-0">
                <Component />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}