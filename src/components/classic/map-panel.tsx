"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";
import { useGame } from "@/lib/game-context";
import { VENUE_STATE_COLORS, VenueState } from "@/lib/types";

const TILE_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_DARK = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

function createPinIcon(color: string) {
  return L.divIcon({
    className: "custom-pin",
    html: `<svg width="19" height="26" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12z" fill="${color}"/>
      <circle cx="12" cy="12" r="5" fill="white" opacity="0.9"/>
    </svg>`,
    iconSize: [19, 26],
    iconAnchor: [9.5, 26],
  });
}

export function MapPanel({ needsReviewOnly = false }: { needsReviewOnly?: boolean }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const { venues, getVenueState, selectedVenueId, setSelectedVenueId } = useGame();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, { zoomControl: false }).setView([37.77, -122.42], 13);
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

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    venues.forEach((venue) => {
      const state: VenueState = getVenueState(venue.id);
      const needsReview = state === "unvisited" || state === "in_progress";
      if (needsReviewOnly && !needsReview) return;
      const color = VENUE_STATE_COLORS[state];
      const marker = L.marker([venue.lat, venue.lng], { icon: createPinIcon(color) }).addTo(map);
      marker.on("click", () => setSelectedVenueId(venue.id));
    });
  }, [venues, getVenueState, setSelectedVenueId, needsReviewOnly]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedVenueId) return;
    const venue = venues.find((v) => v.id === selectedVenueId);
    if (venue) {
      map.flyTo([venue.lat, venue.lng], 15, { duration: 0.8 });
    }
  }, [selectedVenueId, venues]);

  return (
    <div ref={mapRef} className="h-full w-full rounded-2xl [&_.leaflet-control-zoom]:hidden [&_.leaflet-control-zoom]:sm:flex [&_.leaflet-control-zoom]:sm:flex-col" />
  );
}
