"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, Settings2 } from "lucide-react";
import { FilterDrawer, FilterState } from "./filter-drawer";

interface SearchFiltersProps {
  needsReviewOnly?: boolean;
  onNeedsReviewChange?: (value: boolean) => void;
}

export function SearchFilters({ needsReviewOnly = false, onNeedsReviewChange }: SearchFiltersProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ selected: new Set() });

  const handleApply = useCallback((next: FilterState) => {
    setFilters(next);
  }, []);

  const activeCount = filters.selected.size;

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-[468px] sm:shrink-0">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input placeholder="Search for places" className="pl-9" aria-label="Search for places" />
        </div>
        <button
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm sm:w-auto sm:shrink-0 sm:gap-6"
          aria-label="Select city"
          aria-haspopup="listbox"
        >
          <span className="text-foreground">San Francisco</span>
          <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
        </button>
        <label className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-xs font-medium text-foreground sm:text-sm">Show only places needing your review</span>
          <Switch
            checked={needsReviewOnly}
            onCheckedChange={onNeedsReviewChange}
            aria-label="Toggle review filter"
          />
        </label>
        <Button
          variant="outline"
          className="hidden gap-2 border-primary text-primary sm:ml-auto sm:inline-flex"
          onClick={() => setFilterOpen(true)}
        >
          <Settings2 className="size-4" aria-hidden="true" />
          Filter
          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </div>

      <FilterDrawer
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={filters}
        onApply={handleApply}
      />
    </>
  );
}
