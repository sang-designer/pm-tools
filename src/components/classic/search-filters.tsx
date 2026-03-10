"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Search, ChevronDown } from "lucide-react";

export function SearchFilters() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input placeholder="Search for places" className="pl-9" aria-label="Search for places" />
      </div>
      <button
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm sm:w-56"
        aria-label="Select city"
        aria-haspopup="listbox"
      >
        <span className="text-[#202020]">San Francisco</span>
        <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
      </button>
      <label className="flex items-center gap-2 whitespace-nowrap">
        <span className="text-xs font-medium text-foreground sm:text-sm">Show only places needing your review</span>
        <Switch aria-label="Toggle review filter" />
      </label>
    </div>
  );
}
