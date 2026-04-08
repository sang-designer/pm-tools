"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Search, ChevronDown, Settings2, MapPin } from "lucide-react";
import { FilterDrawer, FilterState } from "./filter-drawer";

const CITIES = [
  "San Francisco",
  "New York",
  "Los Angeles",
  "Chicago",
  "Seattle",
  "Austin",
  "Portland",
  "Denver",
];

interface SearchFiltersProps {
  needsReviewOnly?: boolean;
  onNeedsReviewChange?: (value: boolean) => void;
}

export function SearchFilters({ needsReviewOnly = false, onNeedsReviewChange }: SearchFiltersProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ selected: new Set() });
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("San Francisco");
  const [locationInput, setLocationInput] = useState("");

  const handleApply = useCallback((next: FilterState) => {
    setFilters(next);
  }, []);

  const activeCount = filters.selected.size;
  const filteredCities = CITIES.filter((c) =>
    c.toLowerCase().includes(locationInput.toLowerCase())
  );

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      () => {
        setSelectedCity("My Location");
        setLocationOpen(false);
      },
      () => {
        setSelectedCity("My Location");
        setLocationOpen(false);
      }
    );
  };

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-[468px] sm:shrink-0">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input placeholder="Search for places" className="pl-9" aria-label="Search for places" />
        </div>
        <Popover open={locationOpen} onOpenChange={setLocationOpen}>
          <PopoverTrigger asChild>
            <button
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto sm:shrink-0 sm:gap-6"
              aria-label="Select city"
              aria-haspopup="listbox"
            >
              <span className="text-foreground">{selectedCity}</span>
              <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 sm:w-64" align="start">
            <div className="p-2">
              <Input
                placeholder="Enter location"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="h-9"
                autoFocus
              />
            </div>
            <button
              className="flex w-full items-center gap-2.5 border-b border-border px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-accent"
              onClick={handleUseMyLocation}
            >
              <MapPin className="size-4 text-muted-foreground" />
              Use my location
            </button>
            <div className="max-h-48 overflow-y-auto py-1">
              {filteredCities.map((city) => (
                <button
                  key={city}
                  className="flex w-full items-center px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                  onClick={() => {
                    setSelectedCity(city);
                    setLocationOpen(false);
                    setLocationInput("");
                  }}
                >
                  {city}
                </button>
              ))}
              {filteredCities.length === 0 && (
                <p className="px-3 py-2 text-sm text-muted-foreground">No results</p>
              )}
            </div>
          </PopoverContent>
        </Popover>
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
