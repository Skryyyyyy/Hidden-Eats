import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '../../src/context/AuthContext';
import { Restaurant } from '@hidden-eats/shared';
import { RestaurantCard } from '../../src/components/RestaurantCard';
import { CravingChip } from '../../src/components/CravingChip';
import { router } from 'expo-router';

// Default craving tags from schema seed
const CRAVING_TAGS = [
  'All',
  'Biryani',
  'Street Food',
  'Budget Meals',
  'Date Night',
  'Midnight Cravings',
  'Hidden Gems',
  'Cafe to Work',
  'Family Dinner',
];

// Mock restaurants data matching schema for rich initial demo experience
const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'res-1',
    google_place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4', // Demo Place ID
    cached_lat: 12.9716,
    cached_lng: 77.5946,
    lat_lng_cached_at: new Date().toISOString(),
    hidden_gem_score: 9.4,
    curated_tags: ['Biryani', 'Hidden Gems', 'Midnight Cravings'],
    is_bookable: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'res-2',
    google_place_id: 'ChIJgUbEo8cfqokR5lP9_WhEjjk',
    cached_lat: 12.975,
    cached_lng: 77.6,
    lat_lng_cached_at: new Date().toISOString(),
    hidden_gem_score: 8.9,
    curated_tags: ['Street Food', 'Budget Meals'],
    is_bookable: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'res-3',
    google_place_id: 'ChIJ3S-g47kC1zsR2mX8Z36696s',
    cached_lat: 12.968,
    cached_lng: 77.59,
    lat_lng_cached_at: new Date().toISOString(),
    hidden_gem_score: 9.1,
    curated_tags: ['Date Night', 'Cafe to Work'],
    is_bookable: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'res-4',
    google_place_id: 'ChIJ53B3w96uEmsRUsoyG83frY5',
    cached_lat: 12.98,
    cached_lng: 77.61,
    lat_lng_cached_at: new Date().toISOString(),
    hidden_gem_score: 7.8,
    curated_tags: ['Family Dinner', 'Biryani'],
    is_bookable: true,
    created_at: new Date().toISOString(),
  },
];

export default function HomeScreen() {
  const { profile } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          setUserLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        } else {
          // Default fallback coords (e.g. Bangalore center)
          setUserLocation({ lat: 12.9716, lng: 77.5946 });
        }
      } catch (err) {
        setUserLocation({ lat: 12.9716, lng: 77.5946 });
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, []);

  const handleCardPress = (id: string) => {
    router.push(`/restaurant/${id}`);
  };

  // Filter restaurants based on craving tag and search query
  const filteredRestaurants = MOCK_RESTAURANTS.filter((r) => {
    const matchesTag =
      selectedTag === 'All' ||
      r.curated_tags.includes(selectedTag) ||
      (selectedTag === 'Hidden Gems' && (r.hidden_gem_score || 0) >= 8.0);
    const matchesSearch =
      !searchQuery ||
      r.curated_tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTag && matchesSearch;
  });

  const hiddenGemsList = [...MOCK_RESTAURANTS]
    .filter((r) => (r.hidden_gem_score || 0) >= 8.0)
    .sort((a, b) => (b.hidden_gem_score || 0) - (a.hidden_gem_score || 0));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header & Greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Good evening, {profile?.username || 'Explorer'} 👋
            </Text>
            <Text style={styles.subGreeting}>Uncover secret spots standard maps miss</Text>
          </View>

          {/* List vs Map Toggle Placeholder */}
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => {
              if (viewMode === 'list') {
                router.push('/map');
              } else {
                setViewMode('list');
              }
            }}
          >
            <Text style={styles.toggleText}>
              {viewMode === 'list' ? '🗺️ Map' : '📋 List'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Prominent Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="What are you craving today?"
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Horizontal Craving / Mood Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipContainer}
          contentContainerStyle={styles.chipScrollContent}
        >
          {CRAVING_TAGS.map((tag) => (
            <CravingChip
              key={tag}
              label={tag}
              isSelected={selectedTag === tag}
              onPress={() => setSelectedTag(tag)}
            />
          ))}
        </ScrollView>

        {/* Section 1: Trending Near You */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Near You</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filteredRestaurants.map((res) => (
              <RestaurantCard
                key={res.id}
                restaurant={res}
                userLat={userLocation?.lat}
                userLng={userLocation?.lng}
                onPress={() => handleCardPress(res.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Section 2: Hidden Gems */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>💎 Top Hidden Gems</Text>
            <Text style={styles.sectionSubtitle}>Score &gt; 8.0</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {hiddenGemsList.map((res) => (
              <RestaurantCard
                key={`gem-${res.id}`}
                restaurant={res}
                userLat={userLocation?.lat}
                userLng={userLocation?.lng}
                onPress={() => handleCardPress(res.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Section 3: Budget Under ₹200 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Under ₹200</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {MOCK_RESTAURANTS.slice(1, 3).map((res) => (
              <RestaurantCard
                key={`budget-${res.id}`}
                restaurant={res}
                userLat={userLocation?.lat}
                userLng={userLocation?.lng}
                onPress={() => handleCardPress(res.id)}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  subGreeting: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  toggleButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  toggleText: {
    color: '#f59e0b',
    fontSize: 13,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
  },
  chipContainer: {
    marginBottom: 24,
  },
  chipScrollContent: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 28,
    paddingLeft: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
    marginLeft: 8,
    marginBottom: 12,
  },
});
