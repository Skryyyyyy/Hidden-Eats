'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Compass, Fullscreen, Locate, ZoomIn, ZoomOut } from 'lucide-react';

/* ─── Dark Map Tile Style (Inline Style Specification with CartoDB Dark Matter) ─── */
const DARK_MAP_STYLE: any = {
  version: 8,
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png',
        'https://d.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png',
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  },
  layers: [
    {
      id: 'carto-dark-layer',
      type: 'raster',
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 22,
    },
  ],
};

interface MapContextType {
  map: maplibregl.Map | null;
}

const MapContext = createContext<MapContextType>({ map: null });

export function useMap() {
  return useContext(MapContext);
}

/* ─── <Map /> ─── */
export interface MapProps {
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  className?: string;
  children?: React.ReactNode;
}

export function Map({ center = [80.2707, 13.0827], zoom = 12, className = '', children }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: DARK_MAP_STYLE,
      center: center,
      zoom: zoom,
      attributionControl: false,
    });

    map.on('load', () => {
      mapRef.current = map;
      setMapInstance(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MapContext.Provider value={{ map: mapInstance }}>
      <div
        className={`relative overflow-hidden ${className || ''}`}
        style={{ width: '100%', height: '100%', minHeight: '400px' }}
      >
        <div ref={containerRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        {/* Overlay children rendered on top of the real map */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {children}
        </div>
      </div>
    </MapContext.Provider>
  );
}

/* ─── <MapControls /> ─── */
export interface MapControlsProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showZoom?: boolean;
  showCompass?: boolean;
  showLocate?: boolean;
  showFullscreen?: boolean;
}

export function MapControls({
  position = 'top-right',
  showZoom = true,
  showCompass = true,
  showLocate = true,
  showFullscreen = true,
}: MapControlsProps) {
  const { map } = useMap();

  const posClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  }[position];

  return (
    <div className={`absolute z-30 flex flex-col gap-1 p-1 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-auto ${posClasses}`}>
      {showZoom && (
        <>
          <button
            type="button"
            onClick={() => map?.zoomIn()}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => map?.zoomOut()}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </>
      )}
      {showCompass && (
        <button
          type="button"
          onClick={() => map?.resetNorth()}
          className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          title="Reset Compass"
        >
          <Compass className="w-4 h-4 text-[#f59e0b]" />
        </button>
      )}
      {showLocate && (
        <button
          type="button"
          onClick={() => {
            navigator.geolocation?.getCurrentPosition((pos) => {
              map?.flyTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 14 });
            });
          }}
          className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          title="Locate Me"
        >
          <Locate className="w-4 h-4 text-[#10b981]" />
        </button>
      )}
      {showFullscreen && (
        <button
          type="button"
          onClick={() => {
            const el = map?.getContainer()?.parentElement;
            if (el) {
              if (!document.fullscreenElement) el.requestFullscreen();
              else document.exitFullscreen();
            }
          }}
          className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          title="Toggle Fullscreen"
        >
          <Fullscreen className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

/* ─── <MapMarker /> ─── */
export interface MapMarkerProps {
  longitude: number;
  latitude: number;
  children?: React.ReactNode;
}

export function MapMarker({ longitude, latitude, children }: MapMarkerProps) {
  const { map } = useMap();
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!map) return;

    const el = document.createElement('div');
    el.style.cursor = 'pointer';
    elRef.current = el;

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([longitude, latitude])
      .addTo(map);

    markerRef.current = marker;

    return () => {
      marker.remove();
    };
  }, [map, longitude, latitude]);

  // Render React children into the marker DOM element using a portal-like approach
  if (!elRef.current) return null;

  return null; // Markers are managed via maplibre-gl DOM, not React rendering
}

export function MarkerContent({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col items-center justify-center gap-1">{children}</div>;
}

export function MarkerLabel({
  position = 'top',
  children,
}: {
  position?: 'top' | 'bottom';
  children: React.ReactNode;
}) {
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-black/85 text-white border border-white/15 shadow-lg whitespace-nowrap ${
        position === 'top' ? '-order-1 mb-1' : 'mt-1'
      }`}
    >
      {children}
    </span>
  );
}

/* ─── <MapRoute /> ─── */
export interface MapRouteProps {
  coordinates: [number, number][];
  color?: string;
  width?: number;
  opacity?: number;
  id?: string;
  onClick?: () => void;
}

export function MapRoute({
  coordinates,
  color = '#3b82f6',
  width = 5,
  opacity = 1,
  id = 'route',
  onClick,
}: MapRouteProps) {
  const { map } = useMap();

  useEffect(() => {
    if (!map || !coordinates || coordinates.length === 0) return;

    const sourceId = `route-source-${id}`;
    const layerId = `route-layer-${id}`;

    // Wait for map style to be loaded
    const addRoute = () => {
      // Remove existing if present
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);

      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
        },
      });

      map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': color,
          'line-width': width,
          'line-opacity': opacity,
        },
      });

      if (onClick) {
        map.on('click', layerId, onClick);
      }
    };

    if (map.isStyleLoaded()) {
      addRoute();
    } else {
      map.on('load', addRoute);
    }

    return () => {
      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch (e) {
        // Map may already be removed
      }
    };
  }, [map, coordinates, color, width, opacity, id, onClick]);

  return null;
}
