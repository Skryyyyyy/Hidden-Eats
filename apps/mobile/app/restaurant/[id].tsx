import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { usePlaceDetails } from '../../src/hooks/usePlaceDetails';
import { MenuItem, Review } from '@hidden-eats/shared';

// Mock secret and regular menu items for demo
const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    menu_id: 'menu-1',
    name: "Chef's Secret Smoked Biryani",
    description: 'Off-menu slow-cooked mutton biryani prepared only on request.',
    price: 340,
    photo_url: null,
    is_off_menu_secret: true,
    is_available: true,
    category: "Off-Menu / Local's Pick",
  },
  {
    id: 'm2',
    menu_id: 'menu-1',
    name: 'Midnight Chili Garlic Wings',
    description: 'Crispy fried wings tossed in house secret spice blend.',
    price: 220,
    photo_url: null,
    is_off_menu_secret: true,
    is_available: true,
    category: "Off-Menu / Local's Pick",
  },
  {
    id: 'm3',
    menu_id: 'menu-1',
    name: 'Classic Butter Chicken',
    description: 'Rich tomato cream gravy with tender tandoori chicken.',
    price: 310,
    photo_url: null,
    is_off_menu_secret: false,
    is_available: true,
    category: 'Mains',
  },
  {
    id: 'm4',
    menu_id: 'menu-1',
    name: 'Garlic Butter Naan',
    description: 'Freshly baked tandoori bread brushed with garlic butter.',
    price: 60,
    photo_url: null,
    is_off_menu_secret: false,
    is_available: true,
    category: 'Breads',
  },
];

// Mock reviews
const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    restaurant_id: 'res-1',
    user_id: 'user-101',
    rating: 5,
    food_quality: 5,
    price_worth: 5,
    service: 4,
    ambience: 4,
    consistency: 5,
    text_review: 'Absolute gem! Ask for the secret off-menu biryani — it blew my mind.',
    photo_urls: [],
    created_at: new Date().toISOString(),
  },
];

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Demo Google Place ID mapped for details
  const placeId = 'ChIJN1t_tDeuEmsRUsoyG83frY4';
  const { details, loading } = usePlaceDetails(placeId);
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews'>('menu');

  // Hardcoded cached coords for deep link map navigation
  const lat = 12.9716;
  const lng = 77.5946;

  // Sub-score breakdown for Hidden Gem Badge
  const gemBreakdown = {
    foodQuality: 4.9,
    priceWorth: 4.8,
    consistency: 4.7,
    service: 4.3,
    ambience: 4.2,
  };

  const handleNavigate = () => {
    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${encodeURIComponent(details?.name || 'Restaurant')})`,
    });
    const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    if (url) {
      Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Linking.openURL(fallbackUrl);
        }
      });
    } else {
      Linking.openURL(fallbackUrl);
    }
  };

  const handleCall = () => {
    Linking.openURL('tel:+919876543210');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/919876543210?text=Hi%20I%20found%20you%20on%20Hidden%20Eats');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Section 1: Photo Gallery Header */}
        <View style={styles.galleryContainer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop',
            }}
            style={styles.heroImage}
          />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Section 2: Name, Ratings, Hours */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>{details?.name || 'Grand Hidden Kitchen'}</Text>
          <Text style={styles.address}>
            {details?.formatted_address || '12-A Secret Alley, Off Brigade Road'}
          </Text>

          <View style={styles.ratingRow}>
            {/* Google Rating */}
            <View style={styles.ratingBox}>
              <Text style={styles.ratingLabel}>Google Rating</Text>
              <Text style={styles.ratingValue}>★ {details?.rating || '4.6'}</Text>
            </View>

            {/* Community Hidden Gem Rating */}
            <View style={[styles.ratingBox, styles.gemRatingBox]}>
              <Text style={[styles.ratingLabel, { color: '#0f172a' }]}>Hidden Gem Score</Text>
              <Text style={[styles.ratingValue, { color: '#0f172a' }]}>💎 9.4 / 10</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.openStatus}>
              {details?.opening_hours?.open_now ? '🟢 Open Now' : '🔴 Closed'}
            </Text>
            <Text style={styles.priceLevel}>
              • Price: {'₹'.repeat(details?.price_level || 2)}
            </Text>
          </View>
        </View>

        {/* Section 3: Hidden Gem Breakdown Radar/Bar Chart */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>💎 Hidden Gem Score Breakdown</Text>
          <View style={styles.breakdownContainer}>
            <BarRow label="Food Quality (40%)" score={gemBreakdown.foodQuality} />
            <BarRow label="Price Worth (25%)" score={gemBreakdown.priceWorth} />
            <BarRow label="Consistency (15%)" score={gemBreakdown.consistency} />
            <BarRow label="Service (10%)" score={gemBreakdown.service} />
            <BarRow label="Ambience (10%)" score={gemBreakdown.ambience} />
          </View>
        </View>

        {/* Section 5: Native Action Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButtonPrimary} onPress={() => Alert.alert('Booking', 'Table reservation flow opens in Phase 2!')}>
            <Text style={styles.actionButtonPrimaryText}>Reserve Table</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButtonIcon} onPress={handleNavigate}>
            <Text style={styles.actionIconText}>📍 Navigate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButtonIcon} onPress={handleCall}>
            <Text style={styles.actionIconText}>📞 Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButtonIcon} onPress={handleWhatsApp}>
            <Text style={styles.actionIconText}>💬 WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* Section 4 & 6: Tabs (Menu vs Reviews) */}
        <View style={styles.tabHeader}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'menu' && styles.tabItemActive]}
            onPress={() => setActiveTab('menu')}
          >
            <Text style={[styles.tabText, activeTab === 'menu' && styles.tabTextActive]}>
              📜 Menu & Secret Picks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'reviews' && styles.tabItemActive]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.tabTextActive]}>
              ⭐ Community Reviews
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'menu' ? (
          <View style={styles.tabContent}>
            {MOCK_MENU_ITEMS.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.menuItemCard,
                  item.is_off_menu_secret && styles.secretMenuItemCard,
                ]}
              >
                <View style={styles.menuItemMain}>
                  <View style={styles.menuItemHeader}>
                    {item.is_off_menu_secret && (
                      <Text style={styles.secretBadge}>🔥 Secret Off-Menu Item</Text>
                    )}
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <Text style={styles.menuItemPrice}>₹{item.price}</Text>
                  </View>
                  <Text style={styles.menuItemDesc}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.tabContent}>
            <TouchableOpacity
              style={styles.writeReviewButton}
              onPress={() => router.push(`/review/new?restaurant_id=${id}`)}
            >
              <Text style={styles.writeReviewText}>✍️ Write a Community Review</Text>
            </TouchableOpacity>

            {MOCK_REVIEWS.map((rev) => (
              <View key={rev.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewUser}>@foodie_explorer</Text>
                  <Text style={styles.reviewRating}>★ {rev.rating} / 5</Text>
                </View>
                <Text style={styles.reviewText}>{rev.text_review}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function BarRow({ label, score }: { label: string; score: number }) {
  const percentage = (score / 5.0) * 100;
  return (
    <View style={styles.barRow}>
      <View style={styles.barLabelRow}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={styles.barScore}>{score} / 5.0</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${percentage}%` }]} />
      </View>
    </View>
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
  galleryContainer: {
    height: 220,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSection: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  ratingBox: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 12,
  },
  gemRatingBox: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  ratingLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  openStatus: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10b981',
  },
  priceLevel: {
    fontSize: 13,
    color: '#cbd5e1',
    marginLeft: 6,
  },
  sectionCard: {
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f59e0b',
    marginBottom: 12,
  },
  breakdownContainer: {
    gap: 10,
  },
  barRow: {
    marginBottom: 4,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  barScore: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f59e0b',
  },
  barTrack: {
    height: 6,
    backgroundColor: '#0f172a',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#f59e0b',
    borderRadius: 3,
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  actionButtonPrimary: {
    flex: 2,
    backgroundColor: '#f59e0b',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonPrimaryText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 14,
  },
  actionButtonIcon: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  tabHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    marginHorizontal: 20,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#f59e0b',
  },
  tabText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#f59e0b',
    fontWeight: '700',
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  menuItemCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  secretMenuItemCard: {
    borderColor: '#f59e0b',
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
  },
  menuItemMain: {},
  menuItemHeader: {
    marginBottom: 4,
  },
  secretBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#f59e0b',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  menuItemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981',
    marginTop: 2,
  },
  menuItemDesc: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  writeReviewButton: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  writeReviewText: {
    color: '#f59e0b',
    fontSize: 14,
    fontWeight: '700',
  },
  reviewCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  reviewUser: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  reviewRating: {
    color: '#f59e0b',
    fontWeight: '700',
    fontSize: 13,
  },
  reviewText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 18,
  },
});
