import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeInUp, FadeInDown, Layout } from 'react-native-reanimated';
import { Typography } from '../components/Typography';
import { theme } from '../theme';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

const ACHIEVEMENTS = [
  { id: '1', title: 'Midnight Owl', icon: 'moon', desc: 'Visited 5 late-night stalls.', color: '#7E57C2' },
  { id: '2', title: 'Spice King', icon: 'zap', desc: 'Conquered 10 spicy challenges.', color: '#E91E63' },
  { id: '3', title: 'Local Legend', icon: 'map', desc: 'Found 20 hidden gems.', color: '#FFC107' },
  { id: '4', title: 'Street Foodie', icon: 'coffee', desc: 'Visited 50 street carts.', color: '#4CAF50' },
];

export const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Header / Avatar Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Typography variant="h2" color={theme.colors.text.dark}>Food Passport</Typography>
            <TouchableOpacity>
              <Icon name="settings" size={24} color={theme.colors.text.dark} />
            </TouchableOpacity>
          </View>

          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80' }} 
                style={styles.avatarImage} 
              />
              <View style={styles.levelBadge}>
                <Typography variant="caption" color={theme.colors.text.light} style={{ fontWeight: 'bold' }}>Lv 12</Typography>
              </View>
            </View>
            
            <View style={styles.profileInfo}>
              <Typography variant="h2" color={theme.colors.text.dark}>Alex Hunter</Typography>
              <Typography variant="body" color={theme.colors.primary} style={{ fontWeight: 'bold', marginTop: 4 }}>
                Local Explorer
              </Typography>
            </View>

            {/* XP Progress Bar */}
            <View style={styles.xpContainer}>
              <View style={styles.xpHeader}>
                <Typography variant="caption" color={theme.colors.textMuted.dark}>2,450 XP</Typography>
                <Typography variant="caption" color={theme.colors.textMuted.dark}>3,000 XP to Next Level</Typography>
              </View>
              <View style={styles.xpTrack}>
                <View style={[styles.xpFill, { width: '75%' }]} />
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Stats Row */}
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.statsRow}>
          <View style={styles.statBox}>
            <Typography variant="display" color={theme.colors.text.dark}>42</Typography>
            <Typography variant="caption" color={theme.colors.textMuted.dark} align="center">Gems Found</Typography>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Typography variant="display" color={theme.colors.text.dark}>18</Typography>
            <Typography variant="caption" color={theme.colors.textMuted.dark} align="center">Reviews</Typography>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Typography variant="display" color={theme.colors.text.dark}>156</Typography>
            <Typography variant="caption" color={theme.colors.textMuted.dark} align="center">Photos</Typography>
          </View>
        </Animated.View>

        {/* Achievements Grid */}
        <View style={styles.sectionContainer}>
          <Typography variant="h3" color={theme.colors.text.dark} style={{ marginBottom: theme.spacing.lg }}>
            Achievements
          </Typography>
          
          <View style={styles.achievementsGrid}>
            {ACHIEVEMENTS.map((item, index) => (
              <Animated.View 
                key={item.id} 
                entering={FadeInUp.delay(300 + (index * 100)).springify()} 
                style={styles.achievementCard}
              >
                <View style={[styles.achievementIconWrapper, { backgroundColor: `${item.color}20` }]}>
                  <Icon name={item.icon} size={24} color={item.color} />
                </View>
                <Typography variant="body" color={theme.colors.text.dark} align="center" style={{ fontWeight: 'bold', marginTop: 12 }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" color={theme.colors.textMuted.dark} align="center" style={{ marginTop: 4 }}>
                  {item.desc}
                </Typography>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Collections Link */}
        <Animated.View entering={FadeInUp.delay(700).springify()} style={styles.sectionContainer}>
          <TouchableOpacity style={styles.menuRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.menuIconWrapper, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                <Icon name="bookmark" size={20} color={theme.colors.text.dark} />
              </View>
              <Typography variant="h3" color={theme.colors.text.dark} style={{ marginLeft: 16 }}>Saved Collections</Typography>
            </View>
            <Icon name="chevron-right" size={20} color={theme.colors.textMuted.dark} />
          </TouchableOpacity>
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxl + 10,
    paddingBottom: theme.spacing.xl,
    backgroundColor: theme.colors.surface.dark,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  profileCard: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.surface.dark,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  xpContainer: {
    width: '100%',
    marginTop: theme.spacing.xl,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: theme.colors.secondary,
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginTop: theme.spacing.md,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border.dark,
  },
  sectionContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: theme.spacing.lg,
  },
  achievementCard: {
    width: (width - theme.spacing.lg * 2 - theme.spacing.md) / 2, // 2 columns
    backgroundColor: theme.colors.surface.dark,
    borderRadius: theme.spacing.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
  },
  achievementIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.dark,
    padding: theme.spacing.md,
    borderRadius: theme.spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
  },
  menuIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
