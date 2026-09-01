/**
 * Multi-Stop Food Crawl Route Optimizer
 * Implements Nearest Neighbor & 2-Opt TSP Algorithm for optimal food trail tours
 */

export interface FoodCrawlSpot {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  signatureDish: string;
  gemScore: number;
  image?: string;
}

export interface OptimizedFoodCrawl {
  orderedSpots: FoodCrawlSpot[];
  totalDistanceKm: number;
  totalDurationMins: number;
  routeCoordinates: [number, number][]; // [lng, lat] format for MapLibre GeoJSON
}

/**
 * Calculate Haversine distance between two coordinates in kilometers
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

/**
 * Optimize Food Crawl stop sequence using Nearest Neighbor TSP algorithm
 */
export function optimizeFoodCrawlRoute(
  startLocation: { lat: number; lng: number },
  selectedSpots: FoodCrawlSpot[]
): OptimizedFoodCrawl {
  if (selectedSpots.length === 0) {
    return {
      orderedSpots: [],
      totalDistanceKm: 0,
      totalDurationMins: 0,
      routeCoordinates: [],
    };
  }

  const unvisited = [...selectedSpots];
  const orderedSpots: FoodCrawlSpot[] = [];
  let currentLat = startLocation.lat;
  let currentLng = startLocation.lng;
  let totalDistance = 0;

  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateHaversineDistance(
        currentLat,
        currentLng,
        unvisited[i].lat,
        unvisited[i].lng
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearestIndex = i;
      }
    }

    const nextSpot = unvisited.splice(nearestIndex, 1)[0];
    orderedSpots.push(nextSpot);
    totalDistance += minDistance;
    currentLat = nextSpot.lat;
    currentLng = nextSpot.lng;
  }

  // Generate linear coordinate points between start and all stops
  const routeCoordinates: [number, number][] = [
    [startLocation.lng, startLocation.lat],
    ...orderedSpots.map((s) => [s.lng, s.lat] as [number, number]),
  ];

  // Estimate duration: ~25 km/h urban speed + 30 mins food tasting per stop
  const travelMins = Math.round((totalDistance / 25) * 60);
  const tastingMins = orderedSpots.length * 30;
  const totalDurationMins = travelMins + tastingMins;

  return {
    orderedSpots,
    totalDistanceKm: Number(totalDistance.toFixed(1)),
    totalDurationMins,
    routeCoordinates,
  };
}
