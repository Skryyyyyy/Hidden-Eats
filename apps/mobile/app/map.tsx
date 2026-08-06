import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { Restaurant, calculateDistanceKm } from '@hidden-eats/shared';

const { width } = Dimensions.get('window');

const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'res-1',
    google_place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    cached_lat: 12.9716,
    cached_lng: 77.5946,
    lat_lng_cached_at: new Date().toISOString(),
    hidden_gem_score: 9.4,
    curated_tags: ['Biryani', 'Hidden Gems'],
    is_bookable: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'res-2',
    google_place_id: 'ChIJgUbEo8cfqokR5lP9_WhEjjk',
    cached_lat: 12.978,
    cached_lng: 77.605,
    lat_lng_cached_at: new Date().toISOString(),
    hidden_gem_score: 8.9,
    curated_tags: ['Street Food'],
    is_bookable: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'res-3',
    google_place_id: 'ChIJ3S-g47kC1zsR2mX8Z36696s',
    cached_lat: 12.965,
    cached_lng: 77.588,
    lat_lng_cached_at: new Date().toISOString(),
    hidden_gem_score: 9.1,
    curated_tags: ['Date Night'],
    is_bookable: true,
    created_at: new Date().toISOString(),
  },
];

export default function DiscoveryMapScreen() {
  const [region, setRegion] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(MOCK_RESTAURANTS[0]);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          const coords = { lat: loc.coords.latitude, lng: loc.coords.longitude };
          setUserLoc(coords);
          setRegion({
            latitude: coords.lat,
            longitude: coords.lng,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          });
        }
      } catch (e) {
        console.log('Location permission error fallback');
      }
    })();
  }, []);

  const distance =
    userLoc && selectedRestaurant?.cached_lat && selectedRestaurant?.cached_lng
      ? calculateDistanceKm(
          userLoc.lat,
          userLoc.lng,
          Number(selectedRestaurant.cached_lat),
          Number(selectedRestaurant.cached_lng)
        )
      : 1.2;

  return (
    <SafeAreaView style={styles.container}>
      {/* Map Header Overlay */}
      <View style={styles.headerOverlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← List</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discovery Map</Text>
      </View>

      {/* Google Map View */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton
      >
        {MOCK_RESTAURANTS.map((res) => {
          const isGem = res.hidden_gem_score && res.hidden_gem_score >= 8.0;
          return (
            <Marker
              key={res.id}
              coordinate={{
                latitude: Number(res.cached_lat),
                longitude: Number(res.cached_lng),
              }}
              onPress={() => setSelectedRestaurant(res)}
            >
              {/* Distinct Custom Marker */}
              <View style={[styles.markerCallout, isGem ? styles.gemMarkerCallout : undefined]}>
                <Text style={styles.markerText}>
                  {isGem ? `💎 ${res.hidden_gem_score}` : '🍽️'}
                </Text>
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Bottom Sliding Preview Card */}
      {selectedRestaurant && (
        <View style={styles.previewDrawer}>
          <TouchableOpacity
            style={styles.previewCard}
            onPress={() => router.push(`/restaurant/${selectedRestaurant.id}`)}
            activeOpacity={0.9}
          >
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop',
              }}
              style={styles.previewImage}
            />

            <View style={styles.previewInfo}>
              <View style={styles.gemTag}>
                <Text style={styles.gemTagText}>💎 {selectedRestaurant.hidden_gem_score} HIDDEN GEM</Text>
              </View>
              <Text style={styles.previewName}>Grand Secret Kitchen</Text>
              <Text style={styles.previewAddress}>12-A Secret Alley, Brigade Road</Text>
              <Text style={styles.previewMeta}>
                ★ 4.8 • {distance} km away • ₹200 for two
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  headerOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  backText: {
    color: '#f59e0b',
    fontWeight: '700',
    fontSize: 13,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerCallout: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#64748b',
  },
  gemMarkerCallout: {
    backgroundColor: '#f59e0b',
    borderColor: '#ffffff',
  },
  markerText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  previewDrawer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  previewCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
    marginRight: 14,
  },
  previewInfo: {
    flex: 1,
  },
  gemTag: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  gemTagText: {
    color: '#f59e0b',
    fontSize: 10,
    fontWeight: '800',
  },
  previewName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  previewAddress: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 4,
  },
  previewMeta: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
});
