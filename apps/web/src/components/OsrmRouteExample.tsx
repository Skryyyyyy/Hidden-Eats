"use client";

import { useEffect, useState } from "react";
import {
  Map,
  MapRoute,
  MapControls,
  useMap,
} from "@/components/ui/map";
import * as maplibregl from 'maplibre-gl';
import { Loader2, Clock, Route } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface RoutePoint {
  name: string;
  lng: number;
  lat: number;
}

const defaultStart: RoutePoint = { name: "📍 You (Diner)", lng: 80.2707, lat: 13.0827 };
const defaultEnd: RoutePoint = { name: "🍽️ Hidden Spot", lng: 80.2754, lat: 13.0587 };

interface RouteData {
  coordinates: [number, number][];
  duration: number;
  distance: number;
}

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m`;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

/* ─── Numbered Stop Markers on the Route ─── */
function RouteMarkers({ start, end }: { start: RoutePoint; end: RoutePoint }) {
  const { map } = useMap();

  useEffect(() => {
    if (!map) return;

    const markers: maplibregl.Marker[] = [];

    // Start marker (green pulse)
    const startEl = document.createElement('div');
    startEl.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
        <div style="width:32px;height:32px;border-radius:50%;background:#10b981;border:3px solid white;box-shadow:0 0 16px rgba(16,185,129,0.5);display:flex;align-items:center;justify-content:center;">
          <span style="color:white;font-weight:900;font-size:13px;">1</span>
        </div>
        <span style="background:rgba(0,0,0,0.85);color:white;font-size:10px;font-weight:700;padding:2px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.15);white-space:nowrap;letter-spacing:0.5px;">${start.name}</span>
      </div>
    `;
    markers.push(
      new maplibregl.Marker({ element: startEl, anchor: 'bottom' })
        .setLngLat([start.lng, start.lat])
        .addTo(map)
    );

    // End marker (red)
    const endEl = document.createElement('div');
    endEl.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
        <div style="width:32px;height:32px;border-radius:50%;background:#ef4444;border:3px solid white;box-shadow:0 0 16px rgba(239,68,68,0.5);display:flex;align-items:center;justify-content:center;">
          <span style="color:white;font-weight:900;font-size:13px;">2</span>
        </div>
        <span style="background:rgba(0,0,0,0.85);color:white;font-size:10px;font-weight:700;padding:2px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.15);white-space:nowrap;letter-spacing:0.5px;">${end.name}</span>
      </div>
    `;
    markers.push(
      new maplibregl.Marker({ element: endEl, anchor: 'bottom' })
        .setLngLat([end.lng, end.lat])
        .addTo(map)
    );

    // Fit map bounds to show both markers
    const bounds = new maplibregl.LngLatBounds();
    bounds.extend([start.lng, start.lat]);
    bounds.extend([end.lng, end.lat]);
    map.fitBounds(bounds, { padding: 80, maxZoom: 14 });

    return () => {
      markers.forEach(m => m.remove());
    };
  }, [map, start, end]);

  return null;
}

/* ─── Main OsrmRouteExample ─── */
interface OsrmRouteExampleProps {
  startPoint?: RoutePoint;
  endPoint?: RoutePoint;
}

export function OsrmRouteExample({ startPoint = defaultStart, endPoint = defaultEnd }: OsrmRouteExampleProps) {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const start = startPoint;
  const end = endPoint;

  useEffect(() => {
    async function fetchRoutes() {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&alternatives=true`
        );
        const data = await response.json();

        if (data.routes?.length > 0) {
          const routeData: RouteData[] = data.routes.map(
            (route: {
              geometry: { coordinates: [number, number][] };
              duration: number;
              distance: number;
            }) => ({
              coordinates: route.geometry.coordinates,
              duration: route.duration,
              distance: route.distance,
            })
          );
          setRoutes(routeData);
        } else {
          setRoutes([{
            coordinates: [[start.lng, start.lat], [end.lng, end.lat]],
            duration: 720,
            distance: 2400,
          }]);
        }
      } catch (error) {
        console.error("Failed to fetch routes:", error);
        setRoutes([{
          coordinates: [[start.lng, start.lat], [end.lng, end.lat]],
          duration: 720,
          distance: 2400,
        }]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRoutes();
  }, [start.lng, start.lat, end.lng, end.lat]);

  const sortedRoutes = routes
    .map((route, index) => ({ route, index }))
    .sort((a, b) => {
      if (a.index === selectedIndex) return 1;
      if (b.index === selectedIndex) return -1;
      return 0;
    });

  return (
    <div className="h-[500px] w-full relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
      <Map center={[(start.lng + end.lng) / 2, (start.lat + end.lat) / 2]} zoom={12}>
        <MapControls
          position="top-right"
          showZoom
          showCompass
          showLocate
          showFullscreen
        />

        {/* Render numbered stop markers */}
        <RouteMarkers start={start} end={end} />

        {/* Render driving route lines */}
        {sortedRoutes.map(({ route, index }) => {
          const isSelected = index === selectedIndex;
          return (
            <MapRoute
              key={`route-${index}`}
              id={`nav-${index}`}
              coordinates={route.coordinates}
              color={isSelected ? "#3b82f6" : "#64748b"}
              width={isSelected ? 6 : 4}
              opacity={isSelected ? 1 : 0.4}
              onClick={() => setSelectedIndex(index)}
            />
          );
        })}
      </Map>

      {/* Route selection cards */}
      {routes.length > 0 && (
        <div className="absolute top-3 left-3 z-30 flex flex-col gap-2">
          {routes.map((route, index) => {
            const isActive = index === selectedIndex;
            const isFastest = index === 0;
            return (
              <Button
                key={index}
                variant={isActive ? "default" : "secondary"}
                size="sm"
                onClick={() => setSelectedIndex(index)}
                className="justify-start gap-3 backdrop-blur-xl bg-black/80 border border-white/15"
              >
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-[#3b82f6]" />
                  <span className="font-medium">
                    {formatDuration(route.duration)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs opacity-80">
                  <Route className="size-3" />
                  {formatDistance(route.distance)}
                </div>
                {isFastest && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Fastest
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-40">
          <Loader2 className="size-6 animate-spin text-[#3b82f6]" />
        </div>
      )}
    </div>
  );
}
