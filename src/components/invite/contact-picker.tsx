"use client";

import { useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MOCK_SWARM_FRIENDS, SwarmFriend } from "@/lib/invite-types";
import { Search } from "lucide-react";

interface ContactPickerProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function ContactPicker({ selectedIds, onSelectionChange }: ContactPickerProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return MOCK_SWARM_FRIENDS;
    const q = search.toLowerCase();
    return MOCK_SWARM_FRIENDS.filter((f) => f.name.toLowerCase().includes(q));
  }, [search]);

  const toggleFriend = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((s) => s !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search Swarm friends..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="max-h-[280px] overflow-y-auto">
        {filtered.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">No friends found</p>
        )}
        {filtered.map((friend) => (
          <FriendRow
            key={friend.id}
            friend={friend}
            selected={selectedIds.includes(friend.id)}
            onToggle={() => toggleFriend(friend.id)}
          />
        ))}
      </div>
    </div>
  );
}

function FriendRow({
  friend,
  selected,
  onToggle,
}: {
  friend: SwarmFriend;
  selected: boolean;
  onToggle: () => void;
}) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <button
      type="button"
      disabled={friend.isOnPlacemaker}
      onClick={onToggle}
      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-accent disabled:opacity-60 disabled:hover:bg-transparent"
    >
      <Checkbox
        checked={selected}
        disabled={friend.isOnPlacemaker}
        className="shrink-0"
        tabIndex={-1}
      />
      <Avatar className="size-8">
        {!imgErr && <AvatarImage src={friend.avatar} alt={friend.name} onError={() => setImgErr(true)} />}
        <AvatarFallback className="text-xs">{friend.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="flex-1 truncate text-sm font-medium text-foreground">{friend.name}</span>
      {friend.isOnPlacemaker && (
        <Badge variant="secondary" className="shrink-0 text-[10px]">
          Already joined
        </Badge>
      )}
    </button>
  );
}
