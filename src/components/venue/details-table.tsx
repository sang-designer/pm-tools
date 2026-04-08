"use client";

import { Venue, VenueHours } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Trash2, User as UserIcon, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/lib/utils";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

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
      className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors sm:size-4 ${
        selected
          ? "border-primary bg-primary"
          : disabled
            ? "border-input opacity-50 cursor-not-allowed"
            : "border-input hover:border-primary/60 cursor-pointer"
      }`}
    >
      {selected && <span className="size-3 rounded-full bg-primary-foreground sm:size-2" />}
    </button>
  );
}

function ActionCell({ rowAction, onAction }: { rowAction: RowAction; onAction: (a: RowAction) => void }) {
  if (rowAction === "removed") {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Removed</span>
        <button onClick={() => onAction("none")} className="min-h-[44px] text-sm font-medium underline text-foreground sm:min-h-0">
          Undo
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button onClick={() => onAction("suggested")} className="min-h-[44px] text-sm font-medium underline text-foreground sm:min-h-0">
        Suggest
      </button>
      <button onClick={() => onAction("not_sure")} className="min-h-[44px] text-sm font-medium underline text-foreground sm:min-h-0">
        Not sure
      </button>
      <Button variant="ghost" size="icon" className="size-10 sm:size-8" onClick={() => onAction("removed")}>
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

function MobileDetailCard({
  row,
  index,
  selection,
  action,
  onSelectChange,
  onActionChange,
}: {
  row: DetailsRow;
  index: number;
  selection: "current" | "suggested" | null;
  action: RowAction;
  onSelectChange: (v: "current" | "suggested" | null) => void;
  onActionChange: (a: RowAction) => void;
}) {
  const hasSuggested = !!row.suggested;

  return (
    <div className="rounded-xl border border-border bg-card p-4" role="radiogroup" aria-label={row.label}>
      <div className="mb-3 flex items-center gap-2 text-muted-foreground">
        {row.icon}
        <span className="text-sm font-medium">{row.label}</span>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          className="flex w-full items-start gap-3 rounded-lg border border-border p-3 text-left transition-colors"
          onClick={() => hasSuggested && onSelectChange("current")}
        >
          <RadioDot
            selected={selection === "current"}
            disabled={!hasSuggested}
          />
          <div className="min-w-0 flex-1">
            <span className="mb-0.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Current</span>
            <span className="text-sm text-foreground">{formatValue(row.current)}</span>
          </div>
        </button>

        {hasSuggested && (
          <button
            type="button"
            className="flex w-full items-start gap-3 rounded-lg border border-dashed border-primary/40 bg-primary/[0.03] p-3 text-left transition-colors"
            onClick={() => onSelectChange("suggested")}
          >
            <RadioDot selected={selection === "suggested"} />
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-center gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Suggested</span>
                <UserIcon className="size-3 text-muted-foreground" />
              </div>
              <span className="text-sm text-foreground">{formatValue(row.suggested)}</span>
            </div>
          </button>
        )}
      </div>

      <div className="mt-3 flex justify-end border-t border-border pt-3">
        <ActionCell rowAction={action} onAction={onActionChange} />
      </div>
    </div>
  );
}

interface DetailsTableProps {
  venue: Venue;
}

export function DetailsTable({ venue }: DetailsTableProps) {
  const d = venue.detail;
  const isMobile = useIsMobile();

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
  const [selections, setSelections] = useState<("current" | "suggested" | null)[]>(rows.map(() => null));

  const completed = actions.filter((a) => a !== "none").length;

  const setRowAction = (i: number, a: RowAction) => {
    setActions((prev) => {
      const next = [...prev];
      next[i] = a;
      return next;
    });
  };

  const setRowSelection = (i: number, v: "current" | "suggested" | null) => {
    setSelections((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  };

  const [detailsOpen, setDetailsOpen] = useState(true);

  if (isMobile) {
    return (
      <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
        <CollapsibleTrigger className="mb-4 flex w-full items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Details ({completed}/{total})
          </h2>
          <ChevronDown className={`size-5 text-muted-foreground transition-transform ${detailsOpen ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-3">
            {rows.map((row, i) => (
              <MobileDetailCard
                key={i}
                row={row}
                index={i}
                selection={selections[i]}
                action={actions[i]}
                onSelectChange={(v) => setRowSelection(i, v)}
                onActionChange={(a) => setRowAction(i, a)}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
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
