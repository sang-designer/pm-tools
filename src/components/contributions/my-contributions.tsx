"use client";

import { useState, useMemo } from "react";
import { useGame } from "@/lib/game-context";
import { getLevelFromPoints } from "@/lib/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination as ShadPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHLY_DATA = [
  { month: "Jan", edits: 380, rejected: 8, rolledBack: 0, flagged: 2 },
  { month: "Feb", edits: 420, rejected: 12, rolledBack: 0, flagged: 4 },
  { month: "Mar", edits: 350, rejected: 9, rolledBack: 1, flagged: 3 },
  { month: "Apr", edits: 120, rejected: 4, rolledBack: 0, flagged: 1 },
  { month: "May", edits: 327, rejected: 7, rolledBack: 0, flagged: 3 },
  { month: "Jun", edits: 0, rejected: 0, rolledBack: 0, flagged: 0 },
  { month: "Jul", edits: 0, rejected: 0, rolledBack: 0, flagged: 0 },
  { month: "Aug", edits: 0, rejected: 0, rolledBack: 0, flagged: 0 },
  { month: "Sep", edits: 0, rejected: 0, rolledBack: 0, flagged: 0 },
  { month: "Oct", edits: 0, rejected: 0, rolledBack: 0, flagged: 0 },
  { month: "Nov", edits: 0, rejected: 0, rolledBack: 0, flagged: 0 },
  { month: "Dec", edits: 0, rejected: 0, rolledBack: 0, flagged: 0 },
];

const LEGEND = [
  { label: "Edits", color: "bg-blue-500" },
  { label: "Rejected Edits", color: "bg-red-400" },
  { label: "Rolled Back", color: "bg-orange-400" },
  { label: "Flagged Photos", color: "bg-pink-400" },
];

const PERIODS = ["Overall", "This Week", "This Month"] as const;

const STATS = {
  totalEdits: 1597,
  approvedEdits: 590,
  rejectedEdits: 40,
  rolledBack: 1,
  flaggedPhotos: 13,
};

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-light tracking-tight text-foreground">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
}

function BottomStatCard({ title, label, value }: { title: string; label: string; value: number }) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold text-foreground">{title}</h4>
      <div className="rounded-lg border border-border p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-3xl font-light tracking-tight text-foreground">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function ContributionsChart() {
  const maxEdits = Math.max(...MONTHLY_DATA.map((d) => d.edits), 1);
  const yTicks = [0, 2, 4, 6, 8];
  const scale = 8;

  return (
    <div className="flex-1 rounded-lg border border-border p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">Contributions Overview</h3>
        <div className="flex flex-wrap gap-3">
          {LEGEND.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className={cn("size-2.5 rounded-full", item.color)} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Y axis */}
        <div className="flex w-6 shrink-0 flex-col-reverse justify-between pb-6 pr-2">
          {yTicks.map((tick) => (
            <span key={tick} className="text-right text-[10px] text-muted-foreground">
              {tick}
            </span>
          ))}
        </div>

        {/* Bars */}
        <div className="flex flex-1 items-end gap-1">
          {MONTHLY_DATA.map((d) => {
            const height = maxEdits > 0 ? (d.edits / maxEdits) * 100 : 0;
            return (
              <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                <div className="relative flex h-32 w-full items-end justify-center">
                  {d.edits > 0 ? (
                    <div
                      className="w-3/5 max-w-8 rounded-t bg-blue-500 transition-all"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                  ) : (
                    <div className="h-px w-3/5 max-w-8 bg-border" />
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// -- History tab data & components --

type ContributionStatus = "Pending" | "Accepted";

interface ExistingPlaceEdit {
  id: string;
  placeName: string;
  details: string;
  resolvedBy: "avatar" | "N/A";
  status: ContributionStatus;
  contributionType: string;
  created: string;
  resolved: string;
}

interface CreatedPlace {
  id: string;
  placeName: string;
  category: string;
  address: string;
  dateCreated: string;
}

const EXISTING_PLACE_EDITS: ExistingPlaceEdit[] = [
  { id: "1", placeName: "ABC Kitchen", details: "", resolvedBy: "N/A", status: "Pending", contributionType: "Photo", created: "04/14/2026", resolved: "" },
  { id: "2", placeName: "The Sacred Grounds Cafe", details: "", resolvedBy: "N/A", status: "Pending", contributionType: "Geosuggestion", created: "04/14/2026", resolved: "" },
  { id: "3", placeName: "The Lumpia Company", details: "phone: +12135707497", resolvedBy: "N/A", status: "Pending", contributionType: "Info", created: "04/06/2026", resolved: "" },
  { id: "4", placeName: "Wayland Meat Market", details: "", resolvedBy: "avatar", status: "Accepted", contributionType: "Hours", created: "04/06/2026", resolved: "04/06/2026" },
  { id: "5", placeName: "Yang Chow Restaurant", details: "", resolvedBy: "N/A", status: "Pending", contributionType: "Info", created: "04/06/2026", resolved: "" },
  { id: "6", placeName: "KYU2 Sushi", details: "", resolvedBy: "avatar", status: "Accepted", contributionType: "Closed", created: "04/06/2026", resolved: "04/06/2026" },
  { id: "7", placeName: "Ken Bullock - State Farm Insurance Agent", details: "", resolvedBy: "N/A", status: "Pending", contributionType: "Photo", created: "04/06/2026", resolved: "" },
  { id: "8", placeName: "Eco Chique Salon", details: "", resolvedBy: "N/A", status: "Pending", contributionType: "Photo", created: "02/13/2026", resolved: "" },
  { id: "9", placeName: "Moraga Country Club", details: "", resolvedBy: "avatar", status: "Accepted", contributionType: "Mislocated", created: "02/13/2026", resolved: "02/13/2026" },
  { id: "10", placeName: "Geppettos", details: "", resolvedBy: "N/A", status: "Pending", contributionType: "Photo", created: "02/13/2026", resolved: "" },
  { id: "11", placeName: "N/A", details: "", resolvedBy: "avatar", status: "Accepted", contributionType: "Delete", created: "02/03/2026", resolved: "02/03/2026" },
];

const CREATED_PLACES: CreatedPlace[] = [
  { id: "1", placeName: "Parachute Bakery", category: "Bakery", address: "1 Ferry Building, 1st St, San Francisco, CA", dateCreated: "09/03/2025" },
  { id: "2", placeName: "Chubby Cattle BBQ", category: "BBQ Joint", address: "2693 Stoneridge Dr #106., Pleasanton, CA", dateCreated: "07/30/2025" },
  { id: "3", placeName: "test-test 123", category: "Grocery Store", address: "1 La Espiral, Orinda, CA", dateCreated: "11/07/2024" },
];

const ROWS_PER_PAGE_OPTIONS = [10, 15, 25, 50];

type SortDir = "asc" | "desc" | null;

function StatusBadge({ status }: { status: ContributionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        status === "Pending"
          ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
      )}
    >
      {status}
    </span>
  );
}

function AvatarPlaceholder() {
  return (
    <div className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
      <svg viewBox="0 0 24 24" className="size-5 text-white" fill="currentColor">
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 1 0-16 0" />
      </svg>
    </div>
  );
}

function SortIcon({ field, activeField, dir }: { field: string; activeField: string; dir: SortDir }) {
  if (field !== activeField || !dir) {
    return <ArrowUpDown className="size-3 opacity-40" />;
  }
  return dir === "asc" ? (
    <ChevronUp className="size-3" />
  ) : (
    <ChevronDown className="size-3" />
  );
}

const PAGE_SIZE = 15;

function TablePagination({
  page,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: {
  page: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (p: number) => void;
  onRowsPerPageChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between px-2 pt-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Rows per page</span>
        <Select
          value={String(rowsPerPage)}
          onValueChange={(v) => onRowsPerPageChange(Number(v))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROWS_PER_PAGE_OPTIONS.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-1">
        <span className="mr-2 text-sm text-muted-foreground">
          {page} of {totalPages}
        </span>
        <ShadPagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => { e.preventDefault(); onPageChange(Math.max(1, page - 1)); }}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => { e.preventDefault(); onPageChange(Math.min(totalPages, page + 1)); }}
                className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </ShadPagination>
      </div>
    </div>
  );
}

function ExistingPlacesTable() {
  const [sortField, setSortField] = useState<"created" | "resolved">("created");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE);

  const sorted = useMemo(() => {
    const items = [...EXISTING_PLACE_EDITS];
    const dir = sortDir ?? "desc";
    items.sort((a, b) => {
      const va = sortField === "resolved" ? a.resolved : a.created;
      const vb = sortField === "resolved" ? b.resolved : b.created;
      if (!va && !vb) return 0;
      if (!va) return 1;
      if (!vb) return -1;
      return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return items;
  }, [sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  function toggleSort(field: "created" | "resolved") {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(1);
  }

  return (
    <>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[200px] font-normal text-muted-foreground">Place Name</TableHead>
              <TableHead className="font-normal text-muted-foreground">Details</TableHead>
              <TableHead className="font-normal text-muted-foreground">Resolved By</TableHead>
              <TableHead className="font-normal text-muted-foreground">Status</TableHead>
              <TableHead className="font-normal text-muted-foreground">Contribution types</TableHead>
              <TableHead className="font-normal text-muted-foreground">
                <button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("created")}>
                  Created
                  <SortIcon field="created" activeField={sortField} dir={sortDir} />
                </button>
              </TableHead>
              <TableHead className="font-normal text-muted-foreground">
                <button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("resolved")}>
                  Resolved
                  <SortIcon field="resolved" activeField={sortField} dir={sortDir} />
                </button>
              </TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="py-3.5">
                  {row.placeName === "N/A" ? (
                    <span className="text-muted-foreground">N/A</span>
                  ) : (
                    <a href="#" className="text-primary hover:underline">{row.placeName}</a>
                  )}
                </TableCell>
                <TableCell className="py-3.5 text-muted-foreground">{row.details || ""}</TableCell>
                <TableCell className="py-3.5">
                  {row.resolvedBy === "avatar" ? <AvatarPlaceholder /> : <span className="text-muted-foreground">N/A</span>}
                </TableCell>
                <TableCell className="py-3.5">
                  <StatusBadge status={row.status} />
                </TableCell>
                <TableCell className="py-3.5">{row.contributionType}</TableCell>
                <TableCell className="py-3.5">{row.created}</TableCell>
                <TableCell className="py-3.5">{row.resolved || ""}</TableCell>
                <TableCell className="py-3.5">
                  {row.resolved && (
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        page={page}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(n) => { setRowsPerPage(n); setPage(1); }}
      />
    </>
  );
}

function CreatedPlacesTable() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE);

  const totalPages = Math.max(1, Math.ceil(CREATED_PLACES.length / rowsPerPage));
  const paginated = CREATED_PLACES.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[200px] font-normal text-muted-foreground">Place Name</TableHead>
              <TableHead className="font-normal text-muted-foreground">Category</TableHead>
              <TableHead className="font-normal text-muted-foreground">Address</TableHead>
              <TableHead className="font-normal text-muted-foreground">Date Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="py-3.5">
                  <a href="#" className="text-primary hover:underline">{row.placeName}</a>
                </TableCell>
                <TableCell className="py-3.5">{row.category}</TableCell>
                <TableCell className="py-3.5">{row.address}</TableCell>
                <TableCell className="py-3.5">{row.dateCreated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        page={page}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(n) => { setRowsPerPage(n); setPage(1); }}
      />
    </>
  );
}

function HistoryTab() {
  const [subTab, setSubTab] = useState<string>("created");

  return (
    <Tabs value={subTab} onValueChange={setSubTab}>
      <TabsList>
        <TabsTrigger value="created">Created Places</TabsTrigger>
        <TabsTrigger value="existing">Existing Places</TabsTrigger>
      </TabsList>

      <TabsContent value="created" className="mt-4">
        <CreatedPlacesTable />
      </TabsContent>
      <TabsContent value="existing" className="mt-4">
        <ExistingPlacesTable />
      </TabsContent>
    </Tabs>
  );
}

export function MyContributions() {
  const { totalPoints } = useGame();
  const { level } = getLevelFromPoints(totalPoints);
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Overall");

  return (
    <div>
      {/* Header */}
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        My Contributions
      </h1>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="rounded bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
          Level {level}
        </span>
        <span className="text-sm text-muted-foreground">User ID: 1410775520</span>
        <a
          href="#"
          className="text-sm font-medium text-primary hover:underline"
        >
          Contributions summary
        </a>
      </div>

      {/* Tabs */}
      <div className="mt-6">
        <Tabs defaultValue="insights">
          <div className="border-b border-border">
            <TabsList variant="line">
              <TabsTrigger value="insights" className="px-4 py-2 text-sm">
                Contribution Insights
              </TabsTrigger>
              <TabsTrigger value="history" className="px-4 py-2 text-sm">
                History
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="insights" className="mt-6">
            {/* Top section: stats + chart */}
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Left: stat cards */}
              <div className="flex w-full shrink-0 flex-col gap-4 lg:w-72">
                <StatCard label="Total Edits" value={STATS.totalEdits} />
                <StatCard label="Total approved edits" value={STATS.approvedEdits} />
                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs text-muted-foreground">Member since</p>
                  <p className="mt-1 flex items-center gap-1 text-3xl font-light tracking-tight text-foreground">
                    2024 <span className="text-2xl">🔥</span>
                  </p>
                </div>
              </div>

              {/* Right: chart */}
              <ContributionsChart />
            </div>

            <Separator className="my-6" />

            {/* Period toggle */}
            <div className="mb-4 flex gap-1 border-b border-border pb-3">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    period === p
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setPeriod(p)}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Bottom stat grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              <BottomStatCard title="Edit" label="Overall" value={STATS.totalEdits} />
              <BottomStatCard title="Rejected edits" label="Overall" value={STATS.rejectedEdits} />
              <BottomStatCard title="Rolled back edits" label="Overall" value={STATS.rolledBack} />
              <BottomStatCard title="Flagged photos" label="Overall" value={STATS.flaggedPhotos} />
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <HistoryTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
