import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedGestureHandler,
  withSpring,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { Typography } from '../components/Typography';
import { theme } from '../theme';
import Icon from '@expo/vector-icons/Feather';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

const DISCOVERY_CARDS = [
  { id: '1', name: 'Midnight Biryani Checkpoint', type: 'Street Cart', rating: '4.9', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80', description: 'Hidden behind the old post office. Opens at 12 AM.' },
  { id: '2', name: 'Crispy Corner Vada Pav', type: 'Stall', rating: '4.7', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', description: 'The spiciest garlic chutney in the city.' },
  { id: '3', name: 'Secret Garden Cafe', type: 'Cafe', rating: '4.8', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80', description: 'Unmarked door in the alley. Knock twice.' },
];

export const DiscoverScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const handleNextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % DISCOVERY_CARDS.length);
  };

  const panGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: () => {},
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onEnd: (event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        // Swipe away
        translateX.value = withSpring(Math.sign(event.translationX) * width * 1.5, {}, () => {
          runOnJS(handleNextCard)();
          translateX.value = 0;
          translateY.value = 0;
        });
      } else {
        // Spring back to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const animatedCardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(translateX.value, [-width / 2, 0, width / 2], [-15, 0, 15]);
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const activeCard = DISCOVERY_CARDS[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2" color={theme.colors.text.dark}>Discover</Typography>
        <Typography variant="caption" color={theme.colors.textMuted.dark}>Swipe right to save to Passport</Typography>
      </View>

      <View style={styles.cardContainer}>
        {/* Background Card Placeholder */}
        <View style={[styles.card, styles.backgroundCard]}>
          <Typography variant="h3" color={theme.colors.textMuted.dark}>Loading next gem...</Typography>
        </View>

        {/* Active Draggable Card */}
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View style={[styles.card, animatedCardStyle]}>
            <Image source={{ uri: activeCard.image }} style={styles.cardImage} />
            <View style={styles.cardOverlay}>
              <View style={styles.tagBadge}>
                <Typography variant="caption" color={theme.colors.primary} style={{ fontWeight: 'bold' }}>
                  {activeCard.type}
                </Typography>
              </View>
              <View style={styles.cardInfo}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h2" color={theme.colors.text.light} style={{ flex: 1 }}>{activeCard.name}</Typography>
                  <View style={styles.ratingBadge}>
                    <Icon name="star" size={14} color="#111" />
                    <Typography variant="caption" color="#111" style={{ fontWeight: 'bold', marginLeft: 4 }}>
                      {activeCard.rating}
                    </Typography>
                  </View>
                </View>
                <Typography variant="body" color={theme.colors.text.light} style={{ marginTop: 8 }}>
                  {activeCard.description}
                </Typography>
              </View>
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.actionButton, { borderColor: theme.colors.error }]}
          onPress={() => {
            translateX.value = withSpring(-width * 1.5, {}, () => {
              runOnJS(handleNextCard)();
              translateX.value = 0;
            });
          }}
        >
          <Icon name="x" size={32} color={theme.colors.error} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { borderColor: theme.colors.success }]}
          onPress={() => {
            translateX.value = withSpring(width * 1.5, {}, () => {
              runOnJS(handleNextCard)();
              translateX.value = 0;
            });
          }}
        >
          <Icon name="heart" size={32} color={theme.colors.success} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.dark,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxl + 10,
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  card: {
    width: width * 0.85,
    height: height * 0.6,
    borderRadius: theme.spacing.borderRadius.xl,
    backgroundColor: theme.colors.surface.dark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
    position: 'absolute', // To stack cards
  },
  backgroundCard: {
    transform: [{ scale: 0.95 }, { translateY: 20 }],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
  },
  tagBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.spacing.borderRadius.pill,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  cardInfo: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: theme.spacing.md,
    borderRadius: theme.spacing.borderRadius.lg,
    backdropFilter: 'blur(10px)',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.spacing.borderRadius.pill,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingBottom: 40,
    paddingTop: 20,
  },
  actionButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.dark,
  },
});
