import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeInUp, FadeInDown, SlideInDown } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Typography } from '../components/Typography';
import { theme } from '../theme';
import Icon from 'react-native-vector-icons/Feather';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

const { height } = Dimensions.get('window');

type OrderTrackingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderTracking'>;

interface Props {
  navigation: OrderTrackingNavigationProp;
}

// Dark map style matching the app's theme
const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] },
  { "featureType": "administrative.country", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] },
  { "featureType": "administrative.land_parcel", "stylers": [{ "visibility": "off" }] },
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#181818" }] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
  { "featureType": "poi.park", "elementType": "labels.text.stroke", "stylers": [{ "color": "#1b1b1b" }] },
  { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#8a8a8a" }] },
  { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#373737" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#3c3c3c" }] },
  { "featureType": "road.highway.controlled_access", "elementType": "geometry", "stylers": [{ "color": "#4e4e4e" }] },
  { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
  { "featureType": "transit", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#3d3d3d" }] }
];

export const OrderTrackingScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_DEFAULT}
          style={StyleSheet.absoluteFillObject}
          customMapStyle={darkMapStyle}
          initialRegion={{
            latitude: 13.0827,
            longitude: 80.2707,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker coordinate={{ latitude: 13.09, longitude: 80.27 }}>
            <View style={styles.driverMarker}>
              <Icon name="navigation" size={16} color="#000" />
            </View>
          </Marker>
          <Marker coordinate={{ latitude: 13.0827, longitude: 80.2707 }}>
            <View style={styles.homeMarker}>
              <Icon name="home" size={16} color="#fff" />
            </View>
          </Marker>
        </MapView>

        {/* Back Button Overlay */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={theme.colors.text.light} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Animated.View entering={SlideInDown.delay(300).springify()} style={styles.bottomSheet}>
        {/* Drag Handle */}
        <View style={styles.handle} />
        
        <View style={styles.etaHeader}>
          <Typography variant="h2" color={theme.colors.text.light}>Arriving in 12 mins</Typography>
          <Typography variant="body" color={theme.colors.textMuted.light}>Expected at 8:45 PM</Typography>
        </View>

        {/* Order Timeline */}
        <View style={styles.timeline}>
          <View style={styles.timelineLine} />
          
          <View style={styles.timelineStep}>
            <View style={[styles.stepDot, styles.stepCompleted]}><Icon name="check" size={12} color="#000" /></View>
            <Typography variant="body" color={theme.colors.text.light} style={styles.stepText}>Order Accepted</Typography>
          </View>
          
          <View style={styles.timelineStep}>
            <View style={[styles.stepDot, styles.stepCompleted]}><Icon name="check" size={12} color="#000" /></View>
            <Typography variant="body" color={theme.colors.text.light} style={styles.stepText}>Preparing Food</Typography>
          </View>

          <View style={styles.timelineStep}>
            <View style={[styles.stepDot, styles.stepActive]}>
              <View style={styles.activePulse} />
            </View>
            <Typography variant="body" color={theme.colors.primary} style={[styles.stepText, { fontWeight: 'bold' }]}>On the Way</Typography>
          </View>

          <View style={styles.timelineStep}>
            <View style={styles.stepDot} />
            <Typography variant="body" color={theme.colors.textMuted.light} style={styles.stepText}>Delivered</Typography>
          </View>
        </View>

        {/* Driver Info */}
        <View style={styles.driverCard}>
          <View style={styles.driverAvatar}>
            <Icon name="user" size={24} color={theme.colors.text.light} />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Typography variant="h3" color={theme.colors.text.light}>Ramesh K.</Typography>
            <Typography variant="caption" color={theme.colors.textMuted.light}>4.9 ★ • 1.2k deliveries</Typography>
          </View>
          <View style={styles.driverActions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Icon name="message-circle" size={20} color={theme.colors.text.light} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}>
              <Icon name="phone" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.dark,
  },
  mapContainer: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: theme.spacing.lg,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  driverMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  homeMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  bottomSheet: {
    backgroundColor: theme.colors.surface.dark,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: theme.spacing.xl,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border.dark,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  etaHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timeline: {
    marginLeft: 12,
    marginBottom: 32,
  },
  timelineLine: {
    position: 'absolute',
    left: 9,
    top: 10,
    bottom: 20,
    width: 2,
    backgroundColor: theme.colors.border.dark,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.background.dark,
    borderWidth: 2,
    borderColor: theme.colors.border.dark,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  stepCompleted: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  stepActive: {
    borderColor: theme.colors.primary,
  },
  activePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  stepText: {
    marginLeft: 16,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.border.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
