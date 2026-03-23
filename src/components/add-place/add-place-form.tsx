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
import {
  ArrowLeft,
  Plus,
  Clock,
  Trash2,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
        "rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-150",
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
          className="opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:text-destructive"
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

  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");

  const [hours, setHours] = useState<HoursEntry[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);

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
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
          className="shrink-0"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Add a Place
          </h1>
          <p className="text-sm text-muted-foreground">
            Help us improve the map by adding a new place.
          </p>
        </div>
      </div>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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

          <Separator />

          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50">
              <Checkbox checked={isChain} onCheckedChange={(v) => setIsChain(!!v)} />
              <div>
                <p className="text-sm font-medium">This place is part of a chain</p>
                <p className="text-xs text-muted-foreground">e.g. Starbucks, McDonald&apos;s</p>
              </div>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50">
              <Checkbox checked={isInside} onCheckedChange={(v) => setIsInside(!!v)} />
              <div>
                <p className="text-sm font-medium">This is inside of another place</p>
                <p className="text-xs text-muted-foreground">e.g. a food court stall inside a mall</p>
              </div>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50">
              <Checkbox checked={isPrivate} onCheckedChange={(v) => setIsPrivate(!!v)} />
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
          <CardTitle>Contact</CardTitle>
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
          <CardTitle className="flex items-center gap-2">
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
          <CardTitle>Attributes</CardTitle>
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
      <div className="flex items-center gap-3 pb-8">
        <Button
          type="submit"
          disabled={!isValid || submitting}
          className="gap-2 px-6"
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
          onClick={() => router.push("/")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
