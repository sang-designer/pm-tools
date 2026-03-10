"use client";

import { Venue, VenueHours } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Trash2, User as UserIcon } from "lucide-react";
import { useState } from "react";

type RowAction = "none" | "removed" | "suggested" | "not_sure";

interface DetailsRow {
  label: string;
  icon: React.ReactNode;
  current: string | VenueHours[];
  suggested?: string | VenueHours[];
}

function formatValue(val: string | VenueHours[] | undefined): React.ReactNode {
  if (!val) return "—";
  if (typeof val === "string") return val;
  return (
    <div className="space-y-1">
      {val.map((h, i) => (
        <div key={i} className="flex items-baseline gap-4">
          <span className="w-24 text-sm">{h.day}</span>
          <span className="text-sm">{h.hours}</span>
        </div>
      ))}
    </div>
  );
}

function RadioDot({ selected, disabled, onClick }: { selected: boolean; disabled?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
        selected
          ? "border-primary bg-primary"
          : disabled
            ? "border-input opacity-50 cursor-not-allowed"
            : "border-input hover:border-primary/60 cursor-pointer"
      }`}
    >
      {selected && <span className="size-2 rounded-full bg-primary-foreground" />}
    </button>
  );
}

function ActionCell({ rowAction, onAction }: { rowAction: RowAction; onAction: (a: RowAction) => void }) {
  if (rowAction === "removed") {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Removed</span>
        <button onClick={() => onAction("none")} className="text-sm font-medium underline text-foreground">
          Undo
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button onClick={() => onAction("suggested")} className="text-sm font-medium underline text-foreground">
        Suggest
      </button>
      <button onClick={() => onAction("not_sure")} className="text-sm font-medium underline text-foreground">
        Not sure
      </button>
      <Button variant="ghost" size="icon" className="size-8" onClick={() => onAction("removed")}>
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

interface DetailsTableProps {
  venue: Venue;
}

export function DetailsTable({ venue }: DetailsTableProps) {
  const d = venue.detail;

  const rows: DetailsRow[] = [
    {
      label: "Address",
      icon: <span className="text-xs">📍</span>,
      current: venue.address,
      suggested: d?.suggestedAddress,
    },
    {
      label: "Phone",
      icon: <span className="text-xs">📞</span>,
      current: d?.phone || "—",
      suggested: d?.suggestedPhone,
    },
    {
      label: "Hours",
      icon: <span className="text-xs">🕐</span>,
      current: d?.hours || "—",
      suggested: d?.suggestedHours,
    },
  ];

  const total = rows.length;
  const [actions, setActions] = useState<RowAction[]>(rows.map(() => "none"));
  const [selections, setSelections] = useState<("current" | "suggested")[]>(rows.map(() => "current"));

  const completed = actions.filter((a) => a !== "none").length;

  const setRowAction = (i: number, a: RowAction) => {
    setActions((prev) => {
      const next = [...prev];
      next[i] = a;
      return next;
    });
  };

  const setRowSelection = (i: number, v: "current" | "suggested") => {
    setSelections((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground">
        Details ({completed}/{total})
      </h2>

      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-card">
              <th className="px-4 py-2 text-left font-bold text-muted-foreground w-[100px]">List</th>
              <th className="px-4 py-2 text-left font-bold text-muted-foreground">Current</th>
              <th className="border-l-2 border-dashed border-border px-4 py-2 text-left font-bold text-muted-foreground">Suggested</th>
              <th className="px-4 py-2 text-right font-bold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const hasSuggested = !!row.suggested;
              return (
                <tr key={i} className="border-b border-border last:border-b-0" role="radiogroup" aria-label={row.label}>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {row.icon}
                      <span className="text-sm">{row.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-start gap-2">
                      <RadioDot
                        selected={selections[i] === "current"}
                        disabled={!hasSuggested}
                        onClick={() => hasSuggested && setRowSelection(i, "current")}
                      />
                      <span
                        className={`text-sm text-foreground ${hasSuggested ? "cursor-pointer" : ""}`}
                        onClick={() => hasSuggested && setRowSelection(i, "current")}
                      >
                        {formatValue(row.current)}
                      </span>
                    </div>
                  </td>
                  <td className="border-l-2 border-dashed border-border px-4 py-3 align-top">
                    {hasSuggested ? (
                      <div className="flex items-start gap-2">
                        <RadioDot
                          selected={selections[i] === "suggested"}
                          onClick={() => setRowSelection(i, "suggested")}
                        />
                        <span
                          className="cursor-pointer text-sm text-foreground"
                          onClick={() => setRowSelection(i, "suggested")}
                        >
                          {formatValue(row.suggested)}
                        </span>
                        <UserIcon className="ml-1 mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top text-right">
                    <ActionCell rowAction={actions[i]} onAction={(a) => setRowAction(i, a)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
