import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { Typography } from '../components/Typography';
import { theme } from '../theme';
import Icon from 'react-native-vector-icons/Feather';

const CATEGORIES = [
  { id: '1', name: 'Burgers', icon: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&q=80' },
  { id: '2', name: 'Coffee', icon: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80' },
  { id: '3', name: 'Pizza', icon: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80' },
  { id: '4', name: 'Desserts', icon: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&q=80' },
];

const HIDDEN_GEMS = [
  { id: '1', name: 'The Secret Kitchen', rating: '4.9', distance: '1.2km', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80' },
  { id: '2', name: 'Alleyway Bakes', rating: '4.8', distance: '2.5km', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80' },
];

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Typography variant="caption" color={theme.colors.textMuted.dark}>Current Location</Typography>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
            <Icon name="map-pin" size={14} color={theme.colors.primary} style={{ marginRight: 4 }} />
            <Typography variant="h3" color={theme.colors.text.dark}>Anna Nagar, Chennai</Typography>
          </View>
        </View>
        <TouchableOpacity style={styles.profileAvatar}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80' }} style={styles.avatarImage} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Search Bar */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.searchBar}>
          <Icon name="search" size={20} color={theme.colors.textMuted.dark} />
          <Typography variant="body" color={theme.colors.textMuted.dark} style={{ marginLeft: 12 }}>
            Search for hidden gems...
          </Typography>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.dark,
  },
  header: {
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
    paddingBottom: 100,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.dark,
    marginHorizontal: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    height: 56,
    borderRadius: theme.spacing.borderRadius.pill,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
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
});
