import React from 'react';
import { View, StyleSheet, Image, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Typography } from '../components/Typography';
import { theme } from '../theme';
import Icon from '@expo/vector-icons/Feather';

const { height, width } = Dimensions.get('window');

type MapScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

interface Props {
  navigation: MapScreenNavigationProp;
}

// Dummy data highlighting niche street food, small stalls, and AI ML extracted spots
const NEARBY_STALLS = [
  { id: 'ml_1', name: 'Sri Balaji Mutton Mess (AI ML Discovered)', rating: '4.9', distance: '180m', type: 'AI ML Spot', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', description: 'Extracted via OpenAI Whisper ASR & SpaCy NER from YouTube vlogger audio.', latitude: 34.0535, longitude: -118.2440 },
  { id: '1', name: 'Raju\'s Midnight Dosa Cart', rating: '4.9', distance: '150m', type: 'Street Cart', image: 'https://images.unsplash.com/photo-1626804475297-41609ea064eb?w=400&q=80', description: 'Legendary crispy dosas served till 3 AM.', latitude: 34.0522, longitude: -118.2437 },
  { id: '2', name: 'Amma\'s Filter Coffee', rating: '4.8', distance: '300m', type: 'Tiny Cafe', image: 'https://images.unsplash.com/photo-1621287950201-92582dfd663e?w=400&q=80', description: 'Authentic frothy degree coffee in a brass dabarah.', latitude: 34.0532, longitude: -118.2447 },
  { id: '3', name: 'Hidden Biryani Master', rating: '5.0', distance: '450m', type: 'Home Kitchen', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', description: 'Secret wood-fired biryani behind the post office.', latitude: 34.0512, longitude: -118.2427 },
];

const mapCustomStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
];

export const MapScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapBackground}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: 34.0522,
          longitude: -118.2437,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        customMapStyle={mapCustomStyle}
      >
        {NEARBY_STALLS.map((stall) => (
          <Marker 
            key={stall.id}
            coordinate={{ latitude: stall.latitude, longitude: stall.longitude }}
          >
            <View style={styles.markerContainer}>
              <View style={styles.markerDot} />
            </View>
          </Marker>
        ))}
      </MapView>
      <View style={styles.mapOverlay} />

      {/* Top Floating Controls */}
      <View style={styles.topControls}>
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.searchBar}>
          <Icon name="search" size={20} color={theme.colors.text.light} />
          <Typography variant="body" color={theme.colors.textMuted.light} style={{ marginLeft: 12 }}>
            Find small stalls near me...
          </Typography>
        </Animated.View>
        <Animated.View entering={FadeIn.delay(300)} style={styles.filterButton}>
          <Icon name="sliders" size={20} color={theme.colors.surface.light} />
        </Animated.View>
      </View>

      {/* Floating Action Buttons on Map */}
      <View style={styles.mapActions}>
        <TouchableOpacity style={styles.fab}>
          <Icon name="crosshair" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Draggable Bottom Sheet (Placeholder UI) */}
      <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.bottomSheet}>
        <View style={styles.dragHandle} />
        
        <View style={styles.sheetHeader}>
          <Typography variant="h3" color={theme.colors.text.dark}>Hidden Gems Around You</Typography>
          <Typography variant="caption" color={theme.colors.textMuted.dark}>Found 12 local spots</Typography>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={NEARBY_STALLS}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          snapToInterval={width * 0.8 + 16}
          decelerationRate="fast"
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.stallCard}
              onPress={() => navigation.navigate('RestaurantDetails', { id: item.id })}
            >
              <Image source={{ uri: item.image }} style={styles.stallImage} />
              <View style={styles.stallInfo}>
                <View style={styles.stallHeader}>
                  <View>
                    <Typography variant="h3" color={theme.colors.text.light}>{item.name}</Typography>
                    <Typography variant="caption" color={theme.colors.primary} style={{ fontWeight: 'bold' }}>{item.type}</Typography>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Typography variant="caption" color={theme.colors.text.dark} style={{ fontWeight: 'bold' }}>{item.rating}</Typography>
                    <Icon name="star" size={10} color={theme.colors.text.dark} style={{ marginLeft: 4 }} />
                  </View>
                </View>
                <Typography variant="caption" color={theme.colors.textMuted.light} style={{ marginTop: 8 }}>
                  {item.description}
                </Typography>
                <View style={styles.distanceChip}>
                  <Icon name="map-pin" size={10} color={theme.colors.text.light} />
                  <Typography variant="caption" color={theme.colors.text.light} style={{ marginLeft: 4 }}>
                    {item.distance}
                  </Typography>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.dark,
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    padding: 4,
    backgroundColor: 'rgba(248, 177, 28, 0.2)',
    borderRadius: 20,
  },
  markerDot: {
    width: 16,
    height: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#111',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)', // Darken map slightly for premium contrast
  },
  topControls: {
    flexDirection: 'row',
    position: 'absolute',
    top: 60,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.light,
    paddingHorizontal: theme.spacing.lg,
    height: 52,
    borderRadius: theme.spacing.borderRadius.pill,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  filterButton: {
    width: 52,
    height: 52,
    backgroundColor: theme.colors.primary,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  mapActions: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: height * 0.35,
  },
  fab: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.surface.light,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.32,
    backgroundColor: theme.colors.surface.dark,
    borderTopLeftRadius: theme.spacing.borderRadius.lg,
    borderTopRightRadius: theme.spacing.borderRadius.lg,
    paddingTop: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border.dark,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  sheetHeader: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.lg,
    gap: 16,
    paddingBottom: theme.spacing.lg,
  },
  stallCard: {
    width: width * 0.8,
    backgroundColor: theme.colors.surface.light,
    borderRadius: theme.spacing.borderRadius.md,
    overflow: 'hidden',
  },
  stallImage: {
    width: '100%',
    height: 120,
    backgroundColor: theme.colors.border.light,
  },
  stallInfo: {
    padding: theme.spacing.md,
  },
  stallHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.spacing.borderRadius.pill,
  },
  distanceChip: {
    position: 'absolute',
    top: -108,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.spacing.borderRadius.pill,
  },
});
