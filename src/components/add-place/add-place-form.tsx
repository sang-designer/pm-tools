"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { MapPreview } from "@/components/venue/map-preview";
import {
  Plus,
  Clock,
  Trash2,
  MapPin,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CHAINS = [
  { name: "McDonald's", icon: "🍟", color: "bg-red-500" },
  { name: "Nationwide Mutual Insurance Company", icon: "🏢", color: "bg-blue-600" },
  { name: "Metro PCS", icon: "📱", color: "bg-purple-600" },
  { name: "T-Mobile", icon: "📱", color: "bg-pink-500" },
  { name: "Exxon", icon: "⛽", color: "bg-red-600" },
  { name: "Mobil", icon: "⛽", color: "bg-blue-500" },
  { name: "Esso", icon: "⛽", color: "bg-red-500" },
  { name: "RE/MAX", icon: "🏠", color: "bg-red-600" },
  { name: "Starbucks", icon: "☕", color: "bg-green-600" },
  { name: "Subway", icon: "🥪", color: "bg-green-500" },
  { name: "7-Eleven", icon: "🏪", color: "bg-green-600" },
  { name: "Walgreens", icon: "💊", color: "bg-red-500" },
  { name: "CVS Pharmacy", icon: "💊", color: "bg-red-600" },
  { name: "Burger King", icon: "🍔", color: "bg-orange-500" },
  { name: "Wendy's", icon: "🍔", color: "bg-red-500" },
];

const NEARBY_PLACES = [
  { name: "Circle K Car Wash", distance: "564.06mi", address: "471 Nelson Rd, New Lenox, IL", flagged: true },
  { name: "Circle K", distance: "580.72mi", address: "10258 S Kedzie Ave, Evergreen Park, IL", flagged: true },
  { name: "Dormer Harpring LLC", distance: "344.18mi", address: "3457 Ringsby Ct Unit 110, Denver, CO", flagged: false },
  { name: "Continuum 115", distance: "1006.79mi", address: "102 Pullman Ln, Mooresville, NC", flagged: true },
  { name: "Mid Way Coop", distance: "482.31mi", address: "210 Main St, Midway, KS", flagged: false },
  { name: "Westfield Valley Fair", distance: "2.4mi", address: "2855 Stevens Creek Blvd, Santa Clara, CA", flagged: false },
  { name: "Hillsdale Shopping Center", distance: "18.7mi", address: "60 31st Ave, San Mateo, CA", flagged: false },
];

const CATEGORIES = [
  "Restaurant", "Coffee Shop", "Bar", "Bakery", "Grocery Store",
  "Gym", "Park", "Museum", "Hotel", "Gas Station",
  "Pharmacy", "Bank", "Clothing Store", "Bookstore", "Salon",
];

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const ATTRIBUTES = [
  "ATM", "Outdoor seating", "Reservation", "Restroom",
  "Offer delivery", "Credit cards", "Parking", "Wifi",
];

interface HoursEntry {
  id: string;
  days: string[];
  open: string;
  close: string;
  is24h: boolean;
}

function RequiredDot() {
  return <span className="text-destructive">*</span>;
}

function FormField({ label, required, children, className }: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>
        {label}
        {required && <RequiredDot />}
      </Label>
      {children}
    </div>
  );
}

function DayToggle({ day, selected, onToggle }: {
  day: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "rounded-lg border px-3.5 py-2 text-sm font-medium transition-all duration-150 sm:px-3 sm:py-1.5",
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
      )}
    >
      {day}
    </button>
  );
}

function HoursRow({ entry, onChange, onRemove }: {
  entry: HoursEntry;
  onChange: (entry: HoursEntry) => void;
  onRemove: () => void;
}) {
  const toggleDay = (day: string) => {
    const days = entry.days.includes(day)
      ? entry.days.filter((d) => d !== day)
      : [...entry.days, day];
    onChange({ ...entry, days });
  };

  return (
    <div className="group space-y-3 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm">
      <div className="flex flex-wrap gap-1.5">
        {DAYS.map((day) => (
          <DayToggle
            key={day}
            day={day}
            selected={entry.days.includes(day)}
            onToggle={() => toggleDay(day)}
          />
        ))}
      </div>

      {entry.is24h ? (
        <p className="text-sm text-muted-foreground italic">Open 24 hours</p>
      ) : (
        <div className="flex items-center gap-3">
          <FormField label="Open" className="flex-1">
            <Input
              type="time"
              value={entry.open}
              onChange={(e) => onChange({ ...entry, open: e.target.value })}
            />
          </FormField>
          <span className="mt-6 text-muted-foreground">–</span>
          <FormField label="Close" className="flex-1">
            <Input
              type="time"
              value={entry.close}
              onChange={(e) => onChange({ ...entry, close: e.target.value })}
            />
          </FormField>
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox
            checked={entry.is24h}
            onCheckedChange={(checked) => onChange({ ...entry, is24h: !!checked })}
          />
          Open 24/7
        </label>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          className="opacity-100 text-muted-foreground hover:text-destructive sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function AddPlaceForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [crossStreet, setCrossStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country] = useState("United States");

  const [isChain, setIsChain] = useState(false);
  const [isInside, setIsInside] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const [chainQuery, setChainQuery] = useState("");
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [placeQuery, setPlaceQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");

  const [hours, setHours] = useState<HoursEntry[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [pinLat, setPinLat] = useState(37.7749);
  const [pinLng, setPinLng] = useState(-122.4194);

  const addHoursEntry = useCallback(() => {
    setHours((prev) => [
      ...prev,
      { id: crypto.randomUUID(), days: [], open: "09:00", close: "17:00", is24h: false },
    ]);
  }, []);

  const updateHoursEntry = useCallback((id: string, entry: HoursEntry) => {
    setHours((prev) => prev.map((h) => (h.id === id ? entry : h)));
  }, []);

  const removeHoursEntry = useCallback((id: string) => {
    setHours((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const toggleAttribute = useCallback((attr: string) => {
    setSelectedAttributes((prev) =>
      prev.includes(attr) ? prev.filter((a) => a !== attr) : [...prev, attr]
    );
  }, []);

  const isValid = name.trim() && category && address.trim() && city.trim() && postalCode.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("Place submitted successfully!", {
      description: `"${name}" has been added for review.`,
    });
    setSubmitting(false);
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="size-5 text-primary" />
            Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <FormField label="Place name" required>
            <Input
              placeholder="e.g. Blue Bottle Coffee"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </FormField>

          <FormField label="Category" required>
            <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select or type categories" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Address" required>
            <Input
              placeholder="Street address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormField>

          <FormField label="Cross Street">
            <Input
              placeholder="Nearest cross street"
              value={crossStreet}
              onChange={(e) => setCrossStreet(e.target.value)}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Locality (City)" required>
              <Input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </FormField>
            <FormField label="Region (State)">
              <Select value={state} onValueChange={(v) => setState(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Postal Code" required>
              <Input
                placeholder="Zip"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Country" required>
            <Input value={country} disabled />
          </FormField>

          <div className="space-y-2">
            <Label>
              Edit map location<RequiredDot />
            </Label>
            {address.trim() ? (
              <>
                <MapPreview
                  lat={pinLat}
                  lng={pinLng}
                  className="h-64 w-full rounded-lg border border-border"
                  onLocationChange={(lat, lng) => {
                    setPinLat(lat);
                    setPinLng(lng);
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Click to place a pin and update the place&apos;s location on the map
                </p>
              </>
            ) : (
              <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/50">
                {/* Stylized placeholder map grid */}
                <svg className="absolute inset-0 size-full" viewBox="0 0 600 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
                  <rect width="600" height="300" className="fill-muted/30" />
                  {/* Horizontal roads */}
                  <rect x="0" y="70" width="600" height="28" rx="2" className="fill-muted-foreground/[0.06]" />
                  <rect x="0" y="170" width="600" height="28" rx="2" className="fill-muted-foreground/[0.06]" />
                  <rect x="0" y="240" width="600" height="22" rx="2" className="fill-muted-foreground/[0.06]" />
                  {/* Vertical roads */}
                  <rect x="80" y="0" width="28" height="300" rx="2" className="fill-muted-foreground/[0.06]" />
                  <rect x="220" y="0" width="28" height="300" rx="2" className="fill-muted-foreground/[0.06]" />
                  <rect x="380" y="0" width="28" height="300" rx="2" className="fill-muted-foreground/[0.06]" />
                  <rect x="500" y="0" width="28" height="300" rx="2" className="fill-muted-foreground/[0.06]" />
                  {/* Diagonal road */}
                  <rect x="280" y="-40" width="32" height="420" rx="2" className="fill-muted-foreground/[0.06]" transform="rotate(30 296 170)" />
                  {/* Blocks */}
                  <rect x="115" y="14" width="98" height="48" rx="6" className="fill-muted-foreground/[0.04]" />
                  <rect x="115" y="105" width="98" height="58" rx="6" className="fill-muted-foreground/[0.04]" />
                  <rect x="255" y="105" width="118" height="58" rx="6" className="fill-muted-foreground/[0.04]" />
                  <rect x="415" y="14" width="78" height="48" rx="6" className="fill-muted-foreground/[0.04]" />
                  <rect x="415" y="105" width="78" height="58" rx="6" className="fill-muted-foreground/[0.04]" />
                  <rect x="535" y="105" width="65" height="58" rx="6" className="fill-muted-foreground/[0.04]" />
                  <rect x="115" y="205" width="98" height="28" rx="6" className="fill-muted-foreground/[0.04]" />
                  <rect x="415" y="205" width="78" height="28" rx="6" className="fill-muted-foreground/[0.04]" />
                  <rect x="0" y="105" width="73" height="58" rx="6" className="fill-muted-foreground/[0.04]" />
                </svg>

                {/* Blue pin */}
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 -mt-4 drop-shadow-lg">
                  <path d="M4.50001 9.25072L4.50001 9.25061C4.50251 7.19579 5.31989 5.22584 6.77287 3.77286C8.2257 2.32002 10.1954 1.50266 12.25 1.5C14.3046 1.50266 16.2743 2.32002 17.7271 3.77286C19.1801 5.22584 19.9975 7.19579 20 9.25061V9.25074C20.0025 10.928 19.4547 12.5597 18.4406 13.8956L18.4269 13.9136L18.4261 13.9151L18.4045 13.9433L18.324 14.0486C18.294 14.0879 18.2633 14.1279 18.2382 14.1603L18.2065 14.2011C18.1997 14.2097 18.1963 14.214 18.1952 14.2154C18.1947 14.2159 18.1947 14.216 18.1951 14.2155L12.25 21.2269L6.30573 14.2166C6.30623 14.2172 6.30619 14.2171 6.30548 14.2162C6.3042 14.2147 6.30078 14.2104 6.29448 14.2024L6.26251 14.1614C6.23719 14.1288 6.20635 14.0886 6.17618 14.0492L6.09558 13.9438L6.0698 13.9099L6.06269 13.9006L6.06084 13.8981L6.06046 13.8977C5.04577 12.5612 4.49758 10.9287 4.50001 9.25072Z" fill="#2932C9" stroke="white" />
                  <circle cx="12.2012" cy="9.5" r="3" fill="white" />
                </svg>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-3">
            <div className={cn(
              "rounded-lg border transition-colors",
              isPrivate ? "border-border/50 opacity-50" : "border-border",
              isChain && !isPrivate && "border-primary/40 bg-primary/[0.02]",
            )}>
              <label className={cn(
                "flex items-center gap-3 p-3",
                isPrivate ? "cursor-not-allowed" : "cursor-pointer",
              )}>
                <Checkbox
                  checked={isChain}
                  onCheckedChange={(v) => {
                    setIsChain(!!v);
                    if (!v) { setChainQuery(""); setSelectedChain(null); }
                  }}
                  disabled={isPrivate}
                />
                <div>
                  <p className="text-sm font-medium">This place is part of a chain</p>
                  <p className="text-xs text-muted-foreground">e.g. Starbucks, McDonald&apos;s</p>
                </div>
              </label>
              {isChain && !isPrivate && (
                <div className="border-t border-border px-3 pb-3 pt-2">
                  {selectedChain ? (
                    <div className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2">
                      <div className="flex items-center gap-2.5">
                        <span className={cn("flex size-7 items-center justify-center rounded text-sm text-white", CHAINS.find((c) => c.name === selectedChain)?.color ?? "bg-muted")}>
                          {CHAINS.find((c) => c.name === selectedChain)?.icon ?? "🏢"}
                        </span>
                        <span className="text-sm font-medium text-foreground">{selectedChain}</span>
                      </div>
                      <button
                        type="button"
                        className="text-xs font-medium text-muted-foreground hover:text-foreground"
                        onClick={() => { setSelectedChain(null); setChainQuery(""); }}
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="relative">
                        <Input
                          placeholder="Search for chain"
                          value={chainQuery}
                          onChange={(e) => setChainQuery(e.target.value)}
                          className="pr-9"
                          autoFocus
                        />
                        <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                      <div className="mt-1 max-h-60 overflow-y-auto rounded-md border border-border bg-background">
                        {CHAINS.filter((c) =>
                          c.name.toLowerCase().includes(chainQuery.toLowerCase())
                        ).map((chain) => (
                          <button
                            key={chain.name}
                            type="button"
                            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-accent"
                            onClick={() => { setSelectedChain(chain.name); setChainQuery(""); }}
                          >
                            <span className={cn("flex size-7 items-center justify-center rounded text-sm text-white", chain.color)}>
                              {chain.icon}
                            </span>
                            {chain.name}
                          </button>
                        ))}
                        {CHAINS.filter((c) => c.name.toLowerCase().includes(chainQuery.toLowerCase())).length === 0 && (
                          <p className="px-3 py-3 text-sm text-muted-foreground">No chains found</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={cn(
              "rounded-lg border transition-colors",
              isPrivate ? "border-border/50 opacity-50" : "border-border",
              isInside && !isPrivate && "border-primary/40 bg-primary/[0.02]",
            )}>
              <label className={cn(
                "flex items-center gap-3 p-3",
                isPrivate ? "cursor-not-allowed" : "cursor-pointer",
              )}>
                <Checkbox
                  checked={isInside}
                  onCheckedChange={(v) => {
                    setIsInside(!!v);
                    if (!v) { setPlaceQuery(""); setSelectedPlace(null); }
                  }}
                  disabled={isPrivate}
                />
                <div>
                  <p className="text-sm font-medium">This is inside of another place</p>
                  <p className="text-xs text-muted-foreground">e.g. a food court stall inside a mall</p>
                </div>
              </label>
              {isInside && !isPrivate && (
                <div className="border-t border-border px-3 pb-3 pt-2">
                  {selectedPlace ? (
                    <div className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2">
                      <div className="flex items-center gap-2.5">
                        <MapPin className="size-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{selectedPlace}</span>
                      </div>
                      <button
                        type="button"
                        className="text-xs font-medium text-muted-foreground hover:text-foreground"
                        onClick={() => { setSelectedPlace(null); setPlaceQuery(""); }}
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Type something to search for a place..."
                          value={placeQuery}
                          onChange={(e) => setPlaceQuery(e.target.value)}
                          className="pl-9"
                          autoFocus
                        />
                      </div>
                      <div className="mt-1 max-h-72 overflow-y-auto rounded-md border border-border bg-background">
                        {NEARBY_PLACES.filter((p) =>
                          p.name.toLowerCase().includes(placeQuery.toLowerCase()) ||
                          p.address.toLowerCase().includes(placeQuery.toLowerCase())
                        ).map((place) => (
                          <button
                            key={place.name}
                            type="button"
                            className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-accent"
                            onClick={() => { setSelectedPlace(place.name); setPlaceQuery(""); }}
                          >
                            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-medium text-foreground">{place.name}</span>
                                {place.flagged && <span className="size-2 rounded-full bg-red-800" />}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {place.distance} &middot; {place.address}
                              </p>
                            </div>
                          </button>
                        ))}
                        {NEARBY_PLACES.filter((p) =>
                          p.name.toLowerCase().includes(placeQuery.toLowerCase()) ||
                          p.address.toLowerCase().includes(placeQuery.toLowerCase())
                        ).length === 0 && (
                          <p className="px-3 py-3 text-sm text-muted-foreground">No places found</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <label className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50",
              isPrivate && "border-primary/40 bg-primary/[0.02]",
            )}>
              <Checkbox
                checked={isPrivate}
                onCheckedChange={(v) => {
                  const next = !!v;
                  setIsPrivate(next);
                  if (next) {
                    setIsChain(false);
                    setChainQuery("");
                    setSelectedChain(null);
                    setIsInside(false);
                    setPlaceQuery("");
                    setSelectedPlace(null);
                  }
                }}
              />
              <div>
                <p className="text-sm font-medium">This is a private place</p>
                <p className="text-xs text-muted-foreground">Not open to the general public</p>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Phone">
              <Input placeholder="(415) 555-1234" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </FormField>
            <FormField label="Website">
              <Input placeholder="https://example.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </FormField>
            <FormField label="Email address">
              <Input type="email" placeholder="hello@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormField>
            <FormField label="Facebook URL">
              <Input placeholder="facebook.com/yourpage" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
            </FormField>
            <FormField label="Instagram">
              <Input placeholder="@handle" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
            </FormField>
            <FormField label="Twitter/X">
              <Input placeholder="@handle" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="size-5 text-primary" />
            Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hours.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No hours added yet. Click below to add operating hours.
            </p>
          )}

          <div className="space-y-3">
            {hours.map((entry) => (
              <HoursRow
                key={entry.id}
                entry={entry}
                onChange={(updated) => updateHoursEntry(entry.id, updated)}
                onRemove={() => removeHoursEntry(entry.id)}
              />
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={addHoursEntry}
          >
            <Plus className="size-4" />
            Add hours
          </Button>
        </CardContent>
      </Card>

      {/* Attributes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Attributes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ATTRIBUTES.map((attr) => {
              const selected = selectedAttributes.includes(attr);
              return (
                <button
                  key={attr}
                  type="button"
                  onClick={() => toggleAttribute(attr)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-all duration-150",
                    selected
                      ? "border-primary bg-primary/5 font-medium text-primary shadow-sm"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/40"
                  )}>
                    {selected && (
                      <svg className="size-3" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  {attr}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="sticky bottom-0 z-10 -mx-4 flex items-center gap-3 border-t border-border bg-background px-4 py-4 sm:static sm:mx-0 sm:border-t-0 sm:px-0 sm:pb-8 sm:pt-0">
        <Button
          type="submit"
          disabled={!isValid || submitting}
          className="h-12 gap-2 px-6 sm:h-10"
        >
          {submitting ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Submitting…
            </>
          ) : (
            "Submit"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12 sm:h-10"
          onClick={() => router.push("/")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
