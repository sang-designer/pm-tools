"use client";

import { cn, useIsMobile } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
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
  Menu,
  Plus,
  Trophy,
  UserPlus,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface GlobalNavProps {
  activeTab?: string;
  mode?: string;
  onModeSwitch?: (v: string) => void;
  onOpenLeaderboard?: () => void;
  onOpenInvite?: () => void;
}

export function GlobalNav({ activeTab = "Home", mode, onModeSwitch, onOpenLeaderboard, onOpenInvite }: GlobalNavProps) {
  const tabs = ["Home", "Contribute"];
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contributeOpen, setContributeOpen] = useState(false);
  const contributeRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!contributeOpen) return;
    function handleClick(e: MouseEvent) {
      if (contributeRef.current && !contributeRef.current.contains(e.target as Node)) {
        setContributeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [contributeOpen]);

  return (
    <>
      <header
        className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background px-4 sm:h-16 sm:px-8 lg:px-12"
        role="banner"
      >
        {mode && onModeSwitch && (
          <div className="absolute left-1/2 top-full z-40 hidden -translate-x-1/2 pt-3 sm:block">
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
                  <span className="hidden sm:inline">My World</span>
                  <span className="sm:hidden">My World</span>
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
            <span className="text-sm font-medium text-foreground">/placemaker</span>
            <span className="rounded bg-primary/10 px-2 py-1 text-xs text-foreground">
              Beta
            </span>
          </Link>
          <nav className="hidden h-16 items-end sm:flex" aria-label="Main navigation">
            {tabs.map((tab) =>
              tab === "Contribute" ? (
                <div key={tab} className="relative" ref={contributeRef}>
                  <button
                    className={cn(
                      "flex h-16 items-center justify-center gap-1 px-4 text-sm transition-colors sm:px-6",
                      tab === activeTab
                        ? "border-b-2 border-foreground font-semibold text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setContributeOpen((p) => !p)}
                    aria-expanded={contributeOpen}
                    aria-haspopup="true"
                  >
                    {tab}
                    <ChevronDown className={`size-3.5 transition-transform ${contributeOpen ? "rotate-180" : ""}`} />
                  </button>
                  {contributeOpen && (
                    <div className="absolute left-0 top-full z-50 mt-0 w-56 rounded-lg border border-border bg-background py-2 shadow-lg">
                      <Link
                        href="/add-place"
                        className="flex h-11 items-center px-4 text-sm text-foreground transition-colors hover:bg-accent"
                        onClick={() => setContributeOpen(false)}
                      >
                        Add a New Place
                      </Link>
                      <Link
                        href="/my-contributions"
                        className="flex h-11 items-center px-4 text-sm text-foreground transition-colors hover:bg-accent"
                        onClick={() => setContributeOpen(false)}
                      >
                        My Contributions
                      </Link>
                      <a
                        href="https://docs.foursquare.com/data-products/docs/placemaker-best-practices"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-11 w-full items-center justify-between px-4 text-sm text-foreground transition-colors hover:bg-accent"
                        onClick={() => setContributeOpen(false)}
                      >
                        Best Practices
                        <ExternalLink className="size-3.5 text-muted-foreground" />
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={tab}
                  href="/"
                  className={cn(
                    "flex h-16 items-center justify-center px-4 text-sm transition-colors sm:px-6",
                    tab === activeTab
                      ? "border-b-2 border-foreground font-semibold text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-current={tab === activeTab ? "page" : undefined}
                >
                  {tab}
                </Link>
              )
            )}
          </nav>
        </div>

        {/* Desktop icons */}
        <div className="hidden items-center gap-1 sm:flex sm:gap-3">
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

        {/* Mobile hamburger */}
        <button
          className="flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-accent sm:hidden"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="size-5 text-foreground" />
        </button>
      </header>

      {/* Mobile hamburger drawer */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="w-[280px] p-0">
          <SheetHeader className="border-b border-border px-5 py-4">
            <SheetTitle className="text-left text-base">Menu</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col">
            <nav className="flex flex-col px-2 py-3" aria-label="Main navigation">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={cn(
                    "flex h-11 items-center rounded-lg px-3 text-sm transition-colors",
                    tab === activeTab
                      ? "bg-accent font-semibold text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  {tab}
                </button>
              ))}
            </nav>

            <Separator />

            <div className="flex flex-col px-2 py-3">
              <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Quick Links</p>
              <Link
                href="/add-place"
                className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-foreground transition-colors hover:bg-accent"
                onClick={() => setMenuOpen(false)}
              >
                <Plus className="size-4 text-muted-foreground" />
                Add a new place
              </Link>
              <Link
                href="/my-contributions"
                className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-foreground transition-colors hover:bg-accent"
                onClick={() => setMenuOpen(false)}
              >
                <ArrowRight className="size-4 text-muted-foreground" />
                My suggestions
              </Link>
              {onOpenLeaderboard && (
                <button
                  className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-foreground transition-colors hover:bg-accent"
                  onClick={() => { setMenuOpen(false); onOpenLeaderboard(); }}
                >
                  <Trophy className="size-4 text-muted-foreground" />
                  Leaderboard
                </button>
              )}
              {onOpenInvite && (
                <button
                  className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-foreground transition-colors hover:bg-accent"
                  onClick={() => { setMenuOpen(false); onOpenInvite(); }}
                >
                  <UserPlus className="size-4 text-muted-foreground" />
                  Invite a friend
                </button>
              )}
            </div>

            <Separator />

            <div className="flex flex-col px-2 py-3">
              <button
                className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-foreground transition-colors hover:bg-accent"
                onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); }}
              >
                {mounted && theme === "dark" ? (
                  <Sun className="size-4 text-muted-foreground" />
                ) : (
                  <Moon className="size-4 text-muted-foreground" />
                )}
                {mounted && theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
              <button className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-foreground transition-colors hover:bg-accent">
                <MessageCircle className="size-4 text-muted-foreground" />
                Community
              </button>
              <button className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-foreground transition-colors hover:bg-accent">
                <HelpCircle className="size-4 text-muted-foreground" />
                Help
              </button>
              <button className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-foreground transition-colors hover:bg-accent">
                <User className="size-4 text-muted-foreground" />
                Account
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
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
