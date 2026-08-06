import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeInUp, SlideInDown } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { theme } from '../theme';
import Icon from 'react-native-vector-icons/Feather';

const { height, width } = Dimensions.get('window');

type DetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RestaurantDetails'>;
type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'RestaurantDetails'>;

interface Props {
  navigation: DetailsScreenNavigationProp;
  route: DetailsScreenRouteProp;
}

export const RestaurantDetailsScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Large Hero Image Gallery (Placeholder for one large image) */}
        <Animated.View entering={FadeIn.duration(800)} style={styles.heroContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1626804475297-41609ea064eb?w=800&q=80' }} 
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
              <Typography variant="h1" color={theme.colors.text.dark}>Raju's Midnight Dosa Cart</Typography>
              <Typography variant="caption" color={theme.colors.primary} style={{ marginTop: 4, fontWeight: 'bold' }}>
                STREET CART • SOUTH INDIAN
              </Typography>
            </View>
            <View style={styles.ratingBadge}>
              <Icon name="star" size={16} color="#111" />
              <Typography variant="h3" color="#111" style={{ marginLeft: 4 }}>4.9</Typography>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Icon name="clock" size={16} color={theme.colors.textMuted.dark} />
              <Typography variant="caption" color={theme.colors.textMuted.dark} style={{ marginLeft: 6 }}>10:00 PM - 3:00 AM</Typography>
            </View>
            <View style={styles.metaItem}>
              <Icon name="map-pin" size={16} color={theme.colors.textMuted.dark} />
              <Typography variant="caption" color={theme.colors.textMuted.dark} style={{ marginLeft: 6 }}>Anna Nagar East</Typography>
            </View>
            <View style={styles.metaItem}>
              <Typography variant="caption" color={theme.colors.textMuted.dark} style={{ fontWeight: 'bold' }}>₹ (Budget)</Typography>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <Typography variant="h3" color={theme.colors.text.dark} style={{ marginBottom: 8 }}>The Vibe</Typography>
          <Typography variant="body" color={theme.colors.textMuted.dark} style={{ lineHeight: 24 }}>
            A true hidden gem known only to locals. Raju sets up his cart at 10 PM sharp, serving the crispiest, butter-drenched dosas on the pavement. The signature "Podi Masala Dosa" is legendary. No seating, just pure authentic street food magic under the streetlights.
          </Typography>

          <View style={styles.divider} />

          {/* Must Try */}
          <Typography variant="h3" color={theme.colors.text.dark} style={{ marginBottom: 12 }}>Must Try Items</Typography>
          
          <View style={styles.dishCard}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1626804475297-41609ea064eb?w=200&q=80' }} style={styles.dishImage} />
            <View style={styles.dishInfo}>
              <Typography variant="body" color={theme.colors.text.dark} style={{ fontWeight: 'bold' }}>Special Butter Podi Dosa</Typography>
              <Typography variant="caption" color={theme.colors.textMuted.dark} style={{ marginTop: 4 }}>Crispy dosa smothered in ghee and spicy gunpowder.</Typography>
              <Typography variant="body" color={theme.colors.secondary} style={{ marginTop: 8, fontWeight: 'bold' }}>₹80</Typography>
            </View>
          </View>

          <View style={styles.dishCard}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1510431198580-7727c9fa1e3a?w=200&q=80' }} style={styles.dishImage} />
            <View style={styles.dishInfo}>
              <Typography variant="body" color={theme.colors.text.dark} style={{ fontWeight: 'bold' }}>Filter Kaapi</Typography>
              <Typography variant="caption" color={theme.colors.textMuted.dark} style={{ marginTop: 4 }}>Strong, frothy, midnight fuel.</Typography>
              <Typography variant="body" color={theme.colors.secondary} style={{ marginTop: 8, fontWeight: 'bold' }}>₹30</Typography>
            </View>
          </View>

        </Animated.View>
      </ScrollView>

      {/* Floating Bottom Action */}
      <Animated.View entering={SlideInDown.delay(500).springify()} style={styles.floatingAction}>
        <Button 
          title="Get Directions" 
          variant="primary" 
          style={{ flex: 1, marginRight: 12 }} 
        />
        <TouchableOpacity style={styles.secondaryAction}>
          <Icon name="check-circle" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </Animated.View>
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
  },
  dishImage: {
    width: 100,
    height: 100,
  },
  dishInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
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
    flexDirection: 'row',
  },
  secondaryAction: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.surface.dark,
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
