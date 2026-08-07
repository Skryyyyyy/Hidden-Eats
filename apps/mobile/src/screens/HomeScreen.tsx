import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, Modal } from 'react-native';
import Animated, { FadeIn, FadeInDown, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { Typography } from '../components/Typography';
import { theme } from '../theme';
import Icon from 'react-native-vector-icons/Feather';
import { BlurView } from 'expo-blur';

const CATEGORIES = [
  { id: '1', name: 'Tiffins', icon: 'https://images.unsplash.com/photo-1630445396366-8dafbecad045?w=200&q=80' },
  { id: '2', name: 'Biryani', icon: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=200&q=80' },
  { id: '3', name: 'Meals', icon: 'https://images.unsplash.com/photo-1615486171448-4ca3f982701b?w=200&q=80' },
  { id: '4', name: 'Sweets', icon: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=200&q=80' },
];

const HIDDEN_GEMS = [
  { id: '1', name: 'Sangeetha Veg', rating: '4.8', distance: '1.2km', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=100' },
  { id: '2', name: 'A2B - Adyar Ananda Bhavan', rating: '4.6', distance: '2.5km', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=100' },
  { id: '3', name: 'Murugan Idli Shop', rating: '4.9', distance: '3.1km', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=100' },
  { id: '4', name: 'Dindigul Thalappakatti', rating: '4.7', distance: '4.5km', image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=1200&q=100' },
];

const QUICK_ACTIONS = [
  { id: 'menu', title: 'Menu', icon: 'book-open' },
  { id: 'about', title: 'About Us', icon: 'info' },
  { id: 'book', title: 'Book Appointment', icon: 'calendar' },
  { id: 'gift', title: 'Gift Card', icon: 'gift' },
];

export const HomeScreen = () => {
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isLocationVisible, setIsLocationVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Recommended');
  const [activeDiet, setActiveDiet] = useState('All');
  const [currentLocation, setCurrentLocation] = useState('Anna Nagar, Chennai');
  const [isLocating, setIsLocating] = useState(false);

  const handleUseGPS = () => {
    setIsLocating(true);
    setTimeout(() => {
      setCurrentLocation('14th Cross St, Indiranagar');
      setIsLocating(false);
      setIsLocationVisible(false);
    }, 1500);
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <BlurView intensity={80} tint="dark" style={styles.header}>
        <TouchableOpacity onPress={() => setIsLocationVisible(true)}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Typography variant="caption" color={theme.colors.textMuted.dark}>Current Location</Typography>
            <Icon name="chevron-down" size={14} color={theme.colors.primary} style={{ marginLeft: 4 }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
            <Icon name="map-pin" size={14} color={theme.colors.primary} style={{ marginRight: 4 }} />
            <Typography variant="h3" color={theme.colors.text.dark}>{currentLocation}</Typography>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileAvatar}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80' }} style={styles.avatarImage} />
        </TouchableOpacity>
      </BlurView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Active Order Banner */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.activeOrderBanner}>
          <TouchableOpacity 
            style={styles.activeOrderContent}
            onPress={() => rootNavigation.navigate('OrderTracking')}
          >
            <View style={styles.activeOrderIcon}>
              <Icon name="package" size={20} color="#000" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Typography variant="body" color={theme.colors.text.dark} style={{ fontWeight: 'bold' }}>Arriving in 12 mins</Typography>
              <Typography variant="caption" color={theme.colors.primary}>Track Order</Typography>
            </View>
            <Icon name="chevron-right" size={20} color={theme.colors.textMuted.dark} />
          </TouchableOpacity>
        </Animated.View>

        {/* Search & Filter Bar */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color={theme.colors.textMuted.dark} />
            <Typography variant="body" color={theme.colors.textMuted.dark} style={{ marginLeft: 12 }}>
              Search for hidden gems...
            </Typography>
          </View>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setIsFilterVisible(true)}
          >
            <Icon name="sliders" size={20} color={theme.colors.text.dark} />
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Actions (Swiggy / Uber Eats Style) */}
        <Animated.View entering={FadeInDown.delay(250).springify()}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsContainer}
          >
            {QUICK_ACTIONS.map(action => (
              <TouchableOpacity 
                key={action.id} 
                style={styles.actionPill}
                onPress={() => rootNavigation.navigate('GenericScreen', { title: action.title })}
              >
                <Icon name={action.icon} size={16} color={theme.colors.text.dark} />
                <Typography variant="caption" color={theme.colors.text.dark} style={{ marginLeft: 6, fontWeight: 'bold' }}>
                  {action.title}
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Categories */}
        <Animated.View entering={FadeIn.delay(300)}>
          <View style={styles.sectionHeader}>
            <Typography variant="h2" color={theme.colors.text.dark}>Categories</Typography>
            <TouchableOpacity><Typography color={theme.colors.primary}>See All</Typography></TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={CATEGORIES}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingHorizontal: theme.spacing.lg, gap: theme.spacing.md }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.categoryItem}>
                <View style={styles.categoryImageContainer}>
                  <Image source={{ uri: item.icon }} style={styles.categoryImage} />
                  <View style={styles.categoryOverlay} />
                </View>
                <Typography variant="caption" color={theme.colors.text.dark} style={{ marginTop: 8 }}>{item.name}</Typography>
              </TouchableOpacity>
            )}
          />
        </Animated.View>

        {/* Nearby Hidden Gems */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <View style={styles.sectionHeader}>
            <Typography variant="h2" color={theme.colors.text.dark}>Nearby Hidden Gems</Typography>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={HIDDEN_GEMS}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingHorizontal: theme.spacing.lg, gap: theme.spacing.lg, paddingBottom: 40 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.gemCard}>
                <Image source={{ uri: item.image }} style={styles.gemImage} />
                <View style={styles.gemGradient} />
                <View style={styles.gemInfo}>
                  <Typography variant="h3" color={theme.colors.text.dark}>{item.name}</Typography>
                  <View style={styles.gemMeta}>
                    <View style={styles.gemRating}>
                      <Icon name="star" size={12} color="#111" />
                      <Typography variant="caption" color="#111" style={{ fontWeight: 'bold', marginLeft: 4 }}>{item.rating}</Typography>
                    </View>
                    <Typography variant="caption" color={theme.colors.textMuted.dark}>{item.distance}</Typography>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </Animated.View>

      </ScrollView>

      {/* Filter Bottom Sheet Overlay */}
      <Modal visible={isFilterVisible} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={StyleSheet.absoluteFillObject} 
            activeOpacity={1} 
            onPress={() => setIsFilterVisible(false)} 
          />
          <Animated.View entering={SlideInDown.springify().damping(20)} exiting={SlideOutDown} style={styles.filterSheet}>
            <View style={styles.handle} />
            <View style={styles.sheetHeader}>
              <Typography variant="h2" color={theme.colors.text.dark}>Sort & Filters</Typography>
              <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                <Typography variant="body" color={theme.colors.primary} style={{ fontWeight: 'bold' }}>Done</Typography>
              </TouchableOpacity>
            </View>

            {/* Sort Section */}
            <Typography variant="h3" color={theme.colors.text.dark} style={{ marginBottom: 12, marginTop: 8 }}>Sort By</Typography>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24, paddingBottom: 8 }}>
              {['Recommended', 'Delivery Time', 'Rating', 'Cost: Low to High'].map(item => (
                <TouchableOpacity 
                  key={item} 
                  style={[styles.filterPill, activeFilter === item && styles.filterPillActive]}
                  onPress={() => setActiveFilter(item)}
                >
                  <Typography variant="body" color={activeFilter === item ? theme.colors.background.dark : theme.colors.text.dark}>
                    {item}
                  </Typography>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Diet Section */}
            <Typography variant="h3" color={theme.colors.text.dark} style={{ marginBottom: 12 }}>Dietary Preferences</Typography>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 32 }}>
              {['All', 'Veg Only', 'Vegan'].map(item => (
                <TouchableOpacity 
                  key={item} 
                  style={[styles.filterPill, activeDiet === item && styles.filterPillActive]}
                  onPress={() => setActiveDiet(item)}
                >
                  <Typography variant="body" color={activeDiet === item ? theme.colors.background.dark : theme.colors.text.dark}>
                    {item}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>

          </Animated.View>
        </View>
      </Modal>

      {/* Location Bottom Sheet */}
      <Modal visible={isLocationVisible} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={StyleSheet.absoluteFillObject} 
            activeOpacity={1} 
            onPress={() => setIsLocationVisible(false)} 
          />
          <Animated.View entering={SlideInDown.springify().damping(20)} exiting={SlideOutDown} style={styles.filterSheet}>
            <View style={styles.handle} />
            <View style={styles.sheetHeader}>
              <Typography variant="h2" color={theme.colors.text.dark}>Select Location</Typography>
              <TouchableOpacity onPress={() => setIsLocationVisible(false)}>
                <Icon name="x" size={24} color={theme.colors.textMuted.dark} />
              </TouchableOpacity>
            </View>

            {/* GPS Option */}
            <TouchableOpacity 
              style={styles.locationOption}
              onPress={handleUseGPS}
              disabled={isLocating}
            >
              <View style={styles.gpsIconContainer}>
                <Icon name="crosshair" size={20} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Typography variant="body" color={theme.colors.primary} style={{ fontWeight: 'bold' }}>
                  {isLocating ? 'Locating...' : 'Use Current Location'}
                </Typography>
                <Typography variant="caption" color={theme.colors.textMuted.dark}>Using GPS</Typography>
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Saved Addresses */}
            <Typography variant="caption" color={theme.colors.textMuted.dark} style={{ marginBottom: 12, letterSpacing: 1 }}>SAVED ADDRESSES</Typography>
            
            <TouchableOpacity 
              style={styles.locationOption}
              onPress={() => { setCurrentLocation('Home • Anna Nagar East'); setIsLocationVisible(false); }}
            >
              <Icon name="home" size={20} color={theme.colors.text.dark} style={{ marginRight: 16 }} />
              <View>
                <Typography variant="body" color={theme.colors.text.dark} style={{ fontWeight: 'bold' }}>Home</Typography>
                <Typography variant="caption" color={theme.colors.textMuted.dark}>Block D, Anna Nagar East, Chennai</Typography>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.locationOption}
              onPress={() => { setCurrentLocation('Work • Tidel Park'); setIsLocationVisible(false); }}
            >
              <Icon name="briefcase" size={20} color={theme.colors.text.dark} style={{ marginRight: 16 }} />
              <View>
                <Typography variant="body" color={theme.colors.text.dark} style={{ fontWeight: 'bold' }}>Work</Typography>
                <Typography variant="caption" color={theme.colors.textMuted.dark}>Tidel Park, Taramani, Chennai</Typography>
              </View>
            </TouchableOpacity>

          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.dark,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxl + 10,
    paddingBottom: theme.spacing.md,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingTop: 120,
    paddingBottom: 100,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.dark,
    paddingHorizontal: theme.spacing.lg,
    height: 56,
    borderRadius: theme.spacing.borderRadius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
  },
  filterButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.surface.dark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
  },
  activeOrderBanner: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    backgroundColor: 'rgba(248, 177, 28, 0.1)',
    borderRadius: theme.spacing.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(248, 177, 28, 0.3)',
  },
  activeOrderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  activeOrderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.dark,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: theme.spacing.borderRadius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryImageContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.surface.dark,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  gemCard: {
    width: 280,
    height: 200,
    borderRadius: theme.spacing.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface.dark,
  },
  gemImage: {
    width: '100%',
    height: '100%',
  },
  gemGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    top: '40%',
  },
  gemInfo: {
    position: 'absolute',
    bottom: theme.spacing.md,
    left: theme.spacing.md,
    right: theme.spacing.md,
  },
  gemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  gemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  filterSheet: {
    backgroundColor: theme.colors.background.dark,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: theme.spacing.lg,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.dark,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border.dark,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
    marginRight: 12,
  },
  filterPillActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  gpsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(248, 177, 28, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.dark,
    marginVertical: 16,
  }
});
