"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import {
  MessageCircle,
  HelpCircle,
  FileText,
  User,
  ChevronDown,
  LayoutGrid,
  Moon,
  Sun,
  List,
  Map,
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GlobalNavProps {
  activeTab?: string;
  mode?: string;
  onModeSwitch?: (v: string) => void;
}

export function GlobalNav({ activeTab = "Home", mode, onModeSwitch }: GlobalNavProps) {
  const tabs = ["Home", "Contribute"];
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header
      className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-background px-4 sm:px-8 lg:px-12"
      role="banner"
    >
      {mode && onModeSwitch && (
        <div className="absolute left-1/2 top-full z-40 -translate-x-1/2 pt-3">
          <Tabs value={mode} onValueChange={onModeSwitch}>
            <TabsList
              className="grid w-[280px] grid-cols-2 shadow-lg backdrop-blur-sm sm:w-[340px]"
              role="tablist"
              aria-label="View mode"
            >
              <TabsTrigger value="classic" className="gap-2" aria-label="Classic Review mode">
                <List className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Classic Review</span>
                <span className="sm:hidden">Classic</span>
              </TabsTrigger>
              <TabsTrigger value="quest" className="gap-2" aria-label="My World mode">
                <Map className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">My World ⭐</span>
                <span className="sm:hidden">My World ⭐</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}
      <div className="flex items-center gap-2 sm:gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded bg-foreground p-2" aria-label="Foursquare">
            <span className="text-xs font-bold leading-none text-background">
              F<br />SQ
            </span>
          </div>
          <span className="hidden text-sm font-medium text-foreground sm:inline">/placemaker</span>
          <span className="hidden rounded bg-primary/10 px-2 py-1 text-xs text-foreground sm:inline">
            Beta
          </span>
        </Link>
        <nav className="flex h-16 items-end" aria-label="Main navigation">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={cn(
                "flex h-16 items-center justify-center px-3 text-sm transition-colors sm:px-6",
                tab === activeTab
                  ? "border-b-2 border-foreground font-semibold text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={tab === activeTab ? "page" : undefined}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        <NavIcon
          label={mounted && theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted && theme === "dark" ? (
            <Sun className="size-5 text-foreground" />
          ) : (
            <Moon className="size-5 text-foreground" />
          )}
        </NavIcon>
        <NavIcon label="Community"><MessageCircle className="size-5 text-foreground" /></NavIcon>
        <NavIcon label="Help"><HelpCircle className="size-5 text-foreground" /></NavIcon>
        <NavIcon label="Documentation" className="hidden sm:flex"><FileText className="size-5 text-foreground" /></NavIcon>
        <div className="flex items-center">
          <NavIcon label="Account"><User className="size-5 text-foreground" /></NavIcon>
          <NavIcon label="Account menu" className="hidden sm:flex"><ChevronDown className="size-5 text-foreground" /></NavIcon>
        </div>
        <div className="mx-1 hidden h-8 w-px bg-border sm:mx-2 sm:block" />
        <NavIcon label="All apps" className="hidden sm:flex"><LayoutGrid className="size-5 text-foreground" /></NavIcon>
      </div>
    </header>
  );
}

function NavIcon({ children, label, className, onClick }: { children: React.ReactNode; label: string; className?: string; onClick?: () => void }) {
  return (
    <button
      className={cn(
        "flex size-10 items-center justify-center rounded-lg bg-transparent transition-colors hover:bg-accent",
        className
      )}
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
