"use client";

import { useState, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { CheckIcon, MinusIcon, Bot } from "lucide-react";
import { useIsMobile, cn } from "@/lib/utils";

export interface FilterGroup {
  key: string;
  label: string;
  children?: { key: string; label: string }[];
}

export const FILTER_GROUPS: FilterGroup[] = [
  {
    key: "details",
    label: "Details",
    children: [
      { key: "info", label: "Info" },
      { key: "hours", label: "Hours" },
      { key: "mislocated", label: "Mislocated" },
      { key: "edit_name", label: "Edit Name" },
      { key: "missing_info", label: "Missing Info" },
    ],
  },
  { key: "attributes", label: "Attributes" },
  { key: "photo", label: "Photo" },
  { key: "chains", label: "Chains" },
  { key: "categories", label: "Categories" },
  {
    key: "flagged",
    label: "Flagged",
    children: [
      { key: "duplicate", label: "Duplicate" },
      { key: "private_venue", label: "Private Venue" },
      { key: "closed_delete_remove", label: "Closed / Delete / Remove" },
    ],
  },
];

function allChildKeys(group: FilterGroup): string[] {
  return group.children?.map((c) => c.key) ?? [];
}

function allLeafKeys(): string[] {
  return FILTER_GROUPS.flatMap((g) =>
    g.children ? g.children.map((c) => c.key) : [g.key]
  );
}

const TOTAL_FILTERS = allLeafKeys().length;

type CheckState = "checked" | "unchecked" | "indeterminate";

function getGroupState(group: FilterGroup, selected: Set<string>): CheckState {
  if (!group.children) {
    return selected.has(group.key) ? "checked" : "unchecked";
  }
  const keys = allChildKeys(group);
  const checkedCount = keys.filter((k) => selected.has(k)).length;
  if (checkedCount === 0) return "unchecked";
  if (checkedCount === keys.length) return "checked";
  return "indeterminate";
}

function TriCheckbox({
  state,
  onToggle,
  label,
  indented = false,
  pendingCount,
}: {
  state: CheckState;
  onToggle: () => void;
  label: string;
  indented?: boolean;
  pendingCount?: number;
}) {
  const active = state !== "unchecked";
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={state === "indeterminate" ? "mixed" : state === "checked"}
      onClick={onToggle}
      className={`flex min-h-[36px] items-center gap-3 rounded-md px-1 py-1 text-left transition-colors duration-150 hover:bg-accent active:scale-[0.98] ${
        indented ? "pl-7" : ""
      }`}
    >
      <span
        className={`flex size-[18px] shrink-0 items-center justify-center rounded border transition-all duration-200 ${
          active
            ? "scale-100 border-primary bg-primary text-primary-foreground"
            : "scale-100 border-primary bg-background"
        }`}
      >
        <CheckIcon
          className={`size-3.5 transition-all duration-200 ${
            state === "checked" ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        />
        <MinusIcon
          className={`absolute size-3.5 transition-all duration-200 ${
            state === "indeterminate" ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        />
      </span>
      <span className="flex items-center gap-2 text-sm text-foreground">
        {label}
        {pendingCount != null && pendingCount > 0 && (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-200/60">
            {pendingCount.toLocaleString()} pending
          </span>
        )}
      </span>
    </button>
  );
}

export function getActiveFilterChips(selected: Set<string>): { groupKey: string; label: string; childCount?: number }[] {
  const chips: { groupKey: string; label: string; childCount?: number }[] = [];
  for (const group of FILTER_GROUPS) {
    if (group.children) {
      const active = group.children.filter((c) => selected.has(c.key));
      if (active.length > 0) {
        chips.push({
          groupKey: group.key,
          label: group.label,
          childCount: active.length,
        });
      }
    } else if (selected.has(group.key)) {
      chips.push({ groupKey: group.key, label: group.label });
    }
  }
  return chips;
}

export function removeGroupFromSelected(groupKey: string, selected: Set<string>): Set<string> {
  const next = new Set(selected);
  const group = FILTER_GROUPS.find((g) => g.key === groupKey);
  if (!group) return next;
  if (group.children) {
    group.children.forEach((c) => next.delete(c.key));
  } else {
    next.delete(group.key);
  }
  return next;
}

export interface FilterState {
  selected: Set<string>;
  dateFrom?: string;
  dateTo?: string;
  excludeBots?: boolean;
}

interface FilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  pendingCounts?: Record<string, number>;
}

export function FilterDrawer({
  open,
  onOpenChange,
  filters,
  onApply,
  pendingCounts = {},
}: FilterDrawerProps) {
  const isMobile = useIsMobile();
  const [draft, setDraft] = useState<Set<string>>(() => new Set(filters.selected));
  const [dateFrom, setDateFrom] = useState(filters.dateFrom ?? "");
  const [dateTo, setDateTo] = useState(filters.dateTo ?? "");
  const [excludeBots, setExcludeBots] = useState(filters.excludeBots ?? false);

  const resetDraft = useCallback(() => {
    setDraft(new Set(filters.selected));
    setDateFrom(filters.dateFrom ?? "");
    setDateTo(filters.dateTo ?? "");
    setExcludeBots(filters.excludeBots ?? false);
  }, [filters]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (next) {
        resetDraft();
      }
      onOpenChange(next);
    },
    [onOpenChange, resetDraft]
  );

  const toggleChild = useCallback((key: string) => {
    setDraft((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const toggleGroup = useCallback((group: FilterGroup) => {
    setDraft((prev) => {
      const next = new Set(prev);
      if (!group.children) {
        if (next.has(group.key)) next.delete(group.key);
        else next.add(group.key);
        return next;
      }
      const keys = allChildKeys(group);
      const allChecked = keys.every((k) => next.has(k));
      if (allChecked) {
        keys.forEach((k) => next.delete(k));
      } else {
        keys.forEach((k) => next.add(k));
      }
      return next;
    });
  }, []);

  const handleApply = () => {
    onApply({
      selected: new Set(draft),
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      excludeBots: excludeBots || undefined,
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const activeCount = draft.size
    + (dateFrom ? 1 : 0)
    + (dateTo ? 1 : 0)
    + (excludeBots ? 1 : 0);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "flex flex-col",
          isMobile && "max-h-[85dvh] rounded-t-2xl"
        )}
      >
        {isMobile ? (
          <div className="flex flex-col items-center gap-2 pb-0 pt-3">
            <div className="h-1.5 w-10 rounded-full bg-muted-foreground/30" />
            <SheetTitle className="text-lg font-bold">Filters</SheetTitle>
            <SheetDescription className="sr-only">
              Filter venues by category
            </SheetDescription>
          </div>
        ) : (
          <SheetHeader>
            <SheetTitle className="text-xl font-bold">Filters</SheetTitle>
            <SheetDescription className="sr-only">
              Filter venues by category
            </SheetDescription>
            <p
              className={`text-sm text-muted-foreground transition-opacity duration-200 ${
                activeCount > 0 ? "opacity-100" : "opacity-0"
              }`}
            >
              {activeCount} of {TOTAL_FILTERS + 3} selected
            </p>
          </SheetHeader>
        )}

        <div className="flex-1 overflow-y-auto px-4">
          {/* Date Range */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Date Range</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Filter tasks by reporting date
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">From</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="mt-1"
                />
              </div>
              <span className="mt-5 text-sm text-muted-foreground">–</span>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">To</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            {(dateFrom || dateTo) && (
              <button
                className="mt-2 text-xs text-primary hover:underline"
                onClick={() => {
                  setDateFrom("");
                  setDateTo("");
                }}
              >
                Clear dates
              </button>
            )}
          </div>

          <Separator className="my-4" />

          {/* Category filters */}
          <div className="flex flex-col gap-1">
            {FILTER_GROUPS.map((group) => {
              const groupState = getGroupState(group, draft);
              return (
                <div key={group.key}>
                  <TriCheckbox
                    state={groupState}
                    onToggle={() => toggleGroup(group)}
                    label={group.label}
                    pendingCount={pendingCounts[group.label]}
                  />
                  {group.children && (
                    <div className="flex flex-col gap-0.5">
                      {group.children.map((child) => (
                        <TriCheckbox
                          key={child.key}
                          state={draft.has(child.key) ? "checked" : "unchecked"}
                          onToggle={() => toggleChild(child.key)}
                          label={child.label}
                          indented
                          pendingCount={pendingCounts[child.key]}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <Separator className="my-4" />

          {/* Exclude bots */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="size-4 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-semibold text-foreground">Hide bot tasks</h4>
                <p className="text-xs text-muted-foreground">
                  Exclude bot-suggested tasks
                </p>
              </div>
            </div>
            <Switch
              checked={excludeBots}
              onCheckedChange={setExcludeBots}
            />
          </div>
        </div>

        <SheetFooter className="flex-row gap-3 border-t border-border pt-4">
          <Button onClick={handleApply} className="flex-1">
            Apply
          </Button>
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            Cancel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
