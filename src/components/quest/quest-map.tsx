"use client";

import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";
import { useGame } from "@/lib/game-context";
import { VENUE_STATE_COLORS, VenueState } from "@/lib/types";

const TILE_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_DARK = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

function createQuestIcon(color: string, state: VenueState) {
  const pulse = state === "in_progress" ? `<circle cx="12" cy="12" r="16" fill="${color}" opacity="0.3"><animate attributeName="r" from="12" to="20" dur="1.2s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.4" to="0" dur="1.2s" repeatCount="indefinite"/></circle>` : "";
  const check = state === "completed" ? `<polyline points="8,12 11,15 16,9" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>` : "";
  const inner = state === "completed" ? "" : `<circle cx="12" cy="12" r="4" fill="white" opacity="0.9"/>`;

  return L.divIcon({
    className: "quest-pin",
    html: `<svg width="32" height="40" viewBox="-4 -4 32 40" xmlns="http://www.w3.org/2000/svg">
      ${pulse}
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12z" fill="${color}"/>
      ${inner}${check}
    </svg>`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
}

export interface PinPosition {
  x: number;
  y: number;
}

export interface QuestMapHandle {
  fitCompletedVenues: () => void;
  resetView: () => void;
  getPinPosition: (venueId: string) => PinPosition | null;
  onMoveEnd: (cb: () => void) => () => void;
}

export const QuestMap = forwardRef<QuestMapHandle, { showAllCompleted?: boolean }>(
  function QuestMap({ showAllCompleted = false }, ref) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const tileLayerRef = useRef<L.TileLayer | null>(null);
    const markersRef = useRef<Map<string, L.Marker>>(new Map());
    const { venues, getVenueState, selectedVenueId, setSelectedVenueId, venueProgress } = useGame();
    const { resolvedTheme } = useTheme();

    useEffect(() => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: true,
      }).setView([37.765, -122.42], 14);

      const tileUrl = resolvedTheme === "dark" ? TILE_DARK : TILE_LIGHT;
      tileLayerRef.current = L.tileLayer(tileUrl, {
        attribution: TILE_ATTR,
        maxZoom: 20,
        subdomains: "abcd",
      }).addTo(map);

      L.control.zoom({ position: "topright" }).addTo(map);
      mapInstanceRef.current = map;

      return () => {
        map.remove();
        mapInstanceRef.current = null;
        tileLayerRef.current = null;
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      const map = mapInstanceRef.current;
      if (!map || !tileLayerRef.current) return;
      const tileUrl = resolvedTheme === "dark" ? TILE_DARK : TILE_LIGHT;
      tileLayerRef.current.setUrl(tileUrl);
    }, [resolvedTheme]);

    useImperativeHandle(ref, () => ({
      fitCompletedVenues: () => {
        const map = mapInstanceRef.current;
        if (!map) return;
        const completedCoords = venues
          .filter((v) => venueProgress.some((p) => p.venueId === v.id) || v.globallyCompleted)
          .map((v) => [v.lat, v.lng] as [number, number]);

        if (completedCoords.length === 0) {
          map.flyTo([37.765, -122.42], 13, { duration: 0.8 });
          return;
        }
        const bounds = L.latLngBounds(completedCoords);
        map.flyToBounds(bounds.pad(0.3), { duration: 0.8, maxZoom: 14 });
      },
      resetView: () => {
        const map = mapInstanceRef.current;
        if (!map) return;
        map.flyTo([37.765, -122.42], 14, { duration: 0.6 });
      },
      getPinPosition: (venueId: string): PinPosition | null => {
        const map = mapInstanceRef.current;
        if (!map) return null;
        const venue = venues.find((v) => v.id === venueId);
        if (!venue) return null;
        const point = map.latLngToContainerPoint([venue.lat, venue.lng]);
        return { x: point.x, y: point.y };
      },
      onMoveEnd: (cb: () => void) => {
        const map = mapInstanceRef.current;
        if (!map) return () => {};
        map.on("moveend", cb);
        map.on("zoomend", cb);
        return () => {
          map.off("moveend", cb);
          map.off("zoomend", cb);
        };
      },
    }), [venues, venueProgress]);

    const renderMarkers = useCallback(() => {
      const map = mapInstanceRef.current;
      if (!map) return;

      markersRef.current.forEach((marker) => map.removeLayer(marker));
      markersRef.current.clear();

      venues.forEach((venue) => {
        const state = getVenueState(venue.id);

        if (!showAllCompleted && state === "unvisited") return;
        if (showAllCompleted && state === "unvisited" && state !== "in_progress") return;

        const color = VENUE_STATE_COLORS[state];
        const icon = createQuestIcon(color, state);
        const marker = L.marker([venue.lat, venue.lng], { icon }).addTo(map);

        marker.bindTooltip(venue.name, {
          direction: "top",
          offset: [0, -40],
          className: "quest-tooltip",
        });

        marker.on("click", () => {
          setSelectedVenueId(venue.id);
        });

        markersRef.current.set(venue.id, marker);
      });
    }, [venues, getVenueState, setSelectedVenueId, showAllCompleted]);

    useEffect(() => {
      renderMarkers();
    }, [renderMarkers, venueProgress, selectedVenueId]);

    useEffect(() => {
      const map = mapInstanceRef.current;
      if (!map || !selectedVenueId || showAllCompleted) return;
      const venue = venues.find((v) => v.id === selectedVenueId);
      if (venue) {
        map.flyTo([venue.lat, venue.lng], 16, { duration: 0.6 });
      }
    }, [selectedVenueId, venues, showAllCompleted]);

    return <div ref={mapRef} className="absolute inset-0 z-0" />;
  }
);
