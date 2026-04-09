"use client";

import { Venue } from "@/lib/types";
import { useState } from "react";
import { ChevronDown, Plus, Tag, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

interface CategoriesSectionProps {
  venue: Venue;
}

function SuggesterAvatar({ name = "Sang Yeo", date = "January 2, 2025" }: { name?: string; date?: string }) {
  return (
    <div className="group/avatar relative shrink-0">
      <div className="size-6 overflow-hidden rounded-full ring-2 ring-background">
        <img
          src="https://api.dicebear.com/7.x/adventurer/svg?seed=SangYeo"
          alt={name}
          className="size-full object-cover"
        />
      </div>
      <div
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 opacity-0 transition-opacity group-hover/avatar:opacity-100"
      >
        <div className="mx-auto size-0 border-x-[6px] border-b-[6px] border-x-transparent border-b-foreground" />
        <div className="w-max max-w-xs rounded-lg bg-foreground px-3 py-2 text-center shadow-lg">
          <p className="text-sm font-medium text-background">Suggested by {name}</p>
          <p className="text-xs text-background/70">{date}</p>
        </div>
      </div>
    </div>
  );
}

type CategoryAction = "none" | "accepted" | "dismissed" | "not_sure";

export function CategoriesSection({ venue }: CategoriesSectionProps) {
  const d = venue.detail;
  const current = d?.categories ?? [venue.category];
  const suggested = d?.suggestedCategories ?? [];
  const newSuggestions = suggested.filter((s) => !current.includes(s));

  const total = newSuggestions.length;
  const [actions, setActions] = useState<Record<string, CategoryAction>>({});
  const [open, setOpen] = useState(true);

  const completed = newSuggestions.filter((cat) => (actions[cat] ?? "none") !== "none").length;
  const remaining = total - completed;

  const setAction = (cat: string, action: CategoryAction) => {
    setActions((prev) => ({ ...prev, [cat]: action }));
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex w-full items-center gap-3 py-1">
        <CollapsibleTrigger className="flex items-center gap-3">
          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Categories ({completed}/{total})
          </h2>
          {remaining > 0 && (
            <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-900/40 dark:text-orange-400">
              {remaining} remaining
            </span>
          )}
          <ChevronDown
            className={`size-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <div className="group/info relative ml-auto">
          <button type="button" className="flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground" aria-label="Categories info">
            <Info className="size-5" />
          </button>
          <div className="pointer-events-none absolute right-0 top-1/2 z-50 mr-7 -translate-y-1/2 opacity-0 transition-opacity group-hover/info:opacity-100">
            <div className="w-max max-w-xs rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-lg">
              <span className="font-semibold">Categories:</span> Category information of a place
            </div>
          </div>
        </div>
      </div>

      <CollapsibleContent>
        <div className="space-y-4 mt-3">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">Current Categories</h3>
            <div className="flex flex-wrap gap-2">
              {current.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-sm text-foreground"
                >
                  <Tag className="size-3 text-muted-foreground" />
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {newSuggestions.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Suggested Categories</h3>
              <div className="space-y-2">
                {newSuggestions.map((cat) => {
                  const action = actions[cat] ?? "none";
                  const borderClass =
                    action === "accepted"
                      ? "border-green-200 bg-green-50 dark:border-green-900/40 dark:bg-green-950/30"
                      : action === "dismissed"
                        ? "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/30"
                        : action === "not_sure"
                          ? "border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/30"
                          : "border-dashed border-primary/40 bg-primary/[0.03]";
                  return (
                    <div
                      key={cat}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2.5 transition-colors ${borderClass}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
                          <Tag className="size-3 text-muted-foreground" />
                          {cat}
                        </span>
                        <SuggesterAvatar />
                      </div>
                      <div className="flex items-center gap-2">
                        {action === "none" ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => setAction(cat, "accepted")}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-muted-foreground"
                              onClick={() => setAction(cat, "dismissed")}
                            >
                              Dismiss
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-muted-foreground"
                              onClick={() => setAction(cat, "not_sure")}
                            >
                              Not sure
                            </Button>
                          </>
                        ) : (
                          <>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                action === "accepted"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                                  : action === "dismissed"
                                    ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                              }`}
                            >
                              {action === "accepted" ? "Accepted" : action === "dismissed" ? "Dismissed" : "Not sure"}
                            </span>
                            <button
                              onClick={() => setAction(cat, "none")}
                              className="text-xs font-medium text-muted-foreground underline hover:text-foreground"
                            >
                              Undo
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            <Plus className="size-4" />
            Add Categories?
          </button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
