import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Restaurant, calculateDistanceKm } from '@hidden-eats/shared';
import { usePlaceDetails } from '../hooks/usePlaceDetails';

interface RestaurantCardProps {
  restaurant: Restaurant;
  userLat?: number | null;
  userLng?: number | null;
  onPress: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  userLat,
  userLng,
  onPress,
}) => {
  const { details, loading } = usePlaceDetails(restaurant.google_place_id);

  const distance =
    userLat && userLng && restaurant.cached_lat && restaurant.cached_lng
      ? calculateDistanceKm(
          userLat,
          userLng,
          Number(restaurant.cached_lat),
          Number(restaurant.cached_lng)
        )
      : null;

  const isHiddenGem = restaurant.hidden_gem_score && restaurant.hidden_gem_score >= 8.0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Photo Header */}
      <View style={styles.photoContainer}>
        {loading ? (
          <View style={styles.photoPlaceholder}>
            <ActivityIndicator color="#f59e0b" />
          </View>
        ) : (
          <Image
            source={{
              uri:
                details?.photos?.[0]?.photo_reference
                  ? `https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop`
                  : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop',
            }}
            style={styles.photo}
          />
        )}

        {/* Hidden Gem Badge */}
        {isHiddenGem && (
          <View style={styles.gemBadge}>
            <Text style={styles.gemBadgeIcon}>💎</Text>
            <Text style={styles.gemBadgeText}>
              {restaurant.hidden_gem_score} GEM
            </Text>
          </View>
        )}

        {/* Price Level */}
        <View style={styles.priceTag}>
          <Text style={styles.priceTagText}>
            {'₹'.repeat(details?.price_level || 2)}
          </Text>
        </View>
      </View>

      {/* Details Footer */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {details?.name || `Restaurant #${restaurant.id.slice(0, 4)}`}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.ratingText}>
            ★ {details?.rating || '4.8'}{' '}
            <Text style={styles.ratingCount}>
              ({details?.user_rating_count || 85})
            </Text>
          </Text>

          {distance !== null && (
            <Text style={styles.distanceText}>• {distance} km away</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 220,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  photoContainer: {
    width: '100%',
    height: 130,
    backgroundColor: '#0f172a',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gemBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gemBadgeIcon: {
    fontSize: 10,
    marginRight: 4,
  },
  gemBadgeText: {
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '800',
  },
  priceTag: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priceTagText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f59e0b',
  },
  ratingCount: {
    color: '#64748b',
    fontWeight: '400',
  },
  distanceText: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 4,
  },
});
