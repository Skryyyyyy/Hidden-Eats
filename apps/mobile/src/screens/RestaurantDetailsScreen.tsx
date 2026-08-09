import React, { useState, useEffect } from 'react';
import { RestaurantService, Restaurant, MenuItem } from '@hidden-eats/shared';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeInUp, SlideInDown, useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { theme } from '../theme';
import Icon from '@expo/vector-icons/Feather';

const { height, width } = Dimensions.get('window');

type DetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RestaurantDetails'>;
type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'RestaurantDetails'>;

interface Props {
  navigation: DetailsScreenNavigationProp;
  route: DetailsScreenRouteProp;
}



export const RestaurantDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { id } = route.params || { id: '1' };
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resData, menuData] = await Promise.all([
          RestaurantService.getRestaurantById(id),
          RestaurantService.getMenu(id)
        ]);
        setRestaurant(resData);
        setMenuItems(menuData);
      } catch (err) {
        console.error("Failed to load restaurant data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const groupedMenu = [
    {
      category: 'Recommended',
      items: menuItems
    }
  ];

  const [activeTab, setActiveTab] = useState('Recommended');
  const [cartState, setCartState] = useState<Record<string, number>>({}); 

  const updateCart = (id: string, delta: number) => {
    setCartState(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      const newState = { ...prev };
      if (next === 0) delete newState[id];
      else newState[id] = next;
      return newState;
    });
  };

  const totalItems = Object.values(cartState).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cartState).reduce((acc, [cartId, qty]) => {
    const item = menuItems.find(i => i.id === cartId);
    return acc + (item ? item.price * qty : 0);
  }, 0);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const heroAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-100, 0, 100],
            [-50, 0, 50],
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [-100, 0],
            [1.5, 1],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 120 }}
        onScroll={scrollHandler}
        scrollEventThrottle={1}
      >
        {/* Large Hero Image Gallery */}
        <Animated.View entering={FadeIn.duration(800)} style={[styles.heroContainer, heroAnimatedStyle]}>
          <Image 
            source={{ uri: restaurant?.image || 'https://images.unsplash.com/photo-1626804475297-41609ea064eb?w=800&q=80' }} 
            style={styles.heroImage} 
          />
          <View style={styles.heroOverlay}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-left" size={24} color={theme.colors.surface.light} />
            </TouchableOpacity>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="bookmark" size={20} color={theme.colors.surface.light} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="share-2" size={20} color={theme.colors.surface.light} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Details Content */}
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Typography variant="h1" color={theme.colors.text.dark}>{restaurant?.name || 'Loading...'}</Typography>
              <Typography variant="caption" color={theme.colors.primary} style={{ marginTop: 4, fontWeight: 'bold', textTransform: 'uppercase' }}>
                {restaurant?.cuisines?.join(' • ') || ''}
              </Typography>
            </View>
            <View style={styles.ratingBadge}>
              <Icon name="star" size={16} color="#111" />
              <Typography variant="h3" color="#111" style={{ marginLeft: 4 }}>{restaurant?.rating || '0.0'}</Typography>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Icon name="clock" size={16} color={theme.colors.textMuted.dark} />
              <Typography variant="caption" color={theme.colors.textMuted.dark} style={{ marginLeft: 6 }}>{restaurant?.time || '-- mins'}</Typography>
            </View>
            <View style={styles.metaItem}>
              <Icon name="map-pin" size={16} color={theme.colors.textMuted.dark} />
              <Typography variant="caption" color={theme.colors.textMuted.dark} style={{ marginLeft: 6 }}>{restaurant?.location?.address || 'Unknown Location'}</Typography>
            </View>
            <View style={styles.metaItem}>
              <Typography variant="caption" color={theme.colors.textMuted.dark} style={{ fontWeight: 'bold' }}>₹ (Budget)</Typography>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <Typography variant="h3" color={theme.colors.text.dark} style={{ marginBottom: 8 }}>The Vibe</Typography>
          <Typography variant="body" color={theme.colors.textMuted.dark} style={{ lineHeight: 24 }}>
            {restaurant?.about || 'Loading...'}
          </Typography>

          <View style={styles.divider} />

          {/* Must Try */}
          {/* Category Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -theme.spacing.lg, paddingHorizontal: theme.spacing.lg, marginBottom: 16 }}>
            {groupedMenu.map(cat => (
              <TouchableOpacity 
                key={cat.category}
                style={[styles.categoryTab, activeTab === cat.category && styles.categoryTabActive]}
                onPress={() => setActiveTab(cat.category)}
              >
                <Typography variant="body" color={activeTab === cat.category ? theme.colors.background.dark : theme.colors.text.dark}>
                  {cat.category}
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Menu Items for Active Tab */}
          {loading ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Typography color={theme.colors.textMuted.dark}>Loading menu...</Typography>
            </View>
          ) : (
            groupedMenu.find(c => c.category === activeTab)?.items.map(item => (
              <View key={item.id} style={styles.dishCard}>
                <View style={styles.dishInfo}>
                  <Icon name="stop-circle" size={12} color={theme.colors.success} style={{ marginBottom: 4 }} />
                  <Typography variant="body" color={theme.colors.text.dark} style={{ fontWeight: 'bold' }}>{item.name}</Typography>
                  <Typography variant="body" color={theme.colors.text.dark} style={{ fontWeight: 'bold', marginTop: 4 }}>₹{item.price}</Typography>
                  <Typography variant="caption" color={theme.colors.textMuted.dark} style={{ marginTop: 8 }} numberOfLines={2}>{item.description}</Typography>
                </View>
                <View style={styles.dishImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.dishImage} />
                <View style={styles.addButtonContainer}>
                  {cartState[item.id] ? (
                    <View style={styles.counterControl}>
                      <TouchableOpacity onPress={() => updateCart(item.id, -1)} style={styles.counterBtn}>
                        <Icon name="minus" size={14} color={theme.colors.primary} />
                      </TouchableOpacity>
                      <Typography variant="body" color={theme.colors.primary} style={{ fontWeight: 'bold' }}>
                        {cartState[item.id]}
                      </Typography>
                      <TouchableOpacity onPress={() => updateCart(item.id, 1)} style={styles.counterBtn}>
                        <Icon name="plus" size={14} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity onPress={() => updateCart(item.id, 1)} style={styles.addButton}>
                      <Typography variant="body" color={theme.colors.primary} style={{ fontWeight: 'bold' }}>ADD</Typography>
                      <Icon name="plus" size={12} color={theme.colors.primary} style={{ position: 'absolute', top: 4, right: 4 }} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              </View>
            ))
          )}

        </Animated.View>
      </Animated.ScrollView>

      {/* Floating Bottom Action */}
      {totalItems > 0 && (
        <Animated.View entering={SlideInDown.delay(100).springify()} style={styles.floatingAction}>
          <TouchableOpacity 
            style={styles.cartPill} 
            onPress={() => navigation.navigate('Cart')}
          >
            <View style={styles.cartInfo}>
              <Typography variant="caption" color={theme.colors.text.light} style={{ fontWeight: 'bold' }}>{totalItems} ITEM{totalItems > 1 ? 'S' : ''}</Typography>
              <Typography variant="body" color={theme.colors.text.light} style={{ fontWeight: 'bold' }}>₹{totalPrice}</Typography>
            </View>
            <View style={styles.cartAction}>
              <Typography variant="body" color={theme.colors.text.light} style={{ fontWeight: 'bold', marginRight: 8 }}>View Cart</Typography>
              <Icon name="shopping-bag" size={16} color={theme.colors.text.light} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.dark,
  },
  heroContainer: {
    width: width,
    height: height * 0.45,
    position: 'relative',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingTop: 60,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)', // Will translate to a blur view in native later if needed
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.dark,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.dark,
    marginVertical: 24,
  },
  dishCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface.dark,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
    padding: 16,
  },
  dishInfo: {
    flex: 1,
    paddingRight: 12,
  },
  dishImageContainer: {
    width: 130,
    alignItems: 'center',
  },
  dishImage: {
    width: 130,
    height: 110,
    borderRadius: 12,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: -15,
    backgroundColor: theme.colors.surface.dark,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  addButton: {
    width: 100,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterControl: {
    flexDirection: 'row',
    width: 100,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  counterBtn: {
    paddingHorizontal: 12,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
    marginRight: 12,
  },
  categoryTabActive: {
    backgroundColor: theme.colors.text.dark,
    borderColor: theme.colors.text.dark,
  },
  floatingAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 40,
    backgroundColor: 'rgba(18,18,18,0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  cartPill: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.success,
    borderRadius: 16,
    padding: 16,
    shadowColor: theme.colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cartInfo: {
    flexDirection: 'column',
  },
  cartAction: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
