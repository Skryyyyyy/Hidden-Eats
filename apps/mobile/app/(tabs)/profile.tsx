import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { router } from 'expo-router';

export default function ExplorerProfileScreen() {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/(auth)/login');
    }
  };

  const explorerBadges = profile?.badges || ['Secret Finder 💎', 'Biryani Critic 🍲', 'First 500 Explorer 🌟'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Avatar & Explorer Bio */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>
                {(profile?.username || user?.email || 'E')[0].toUpperCase()}
              </Text>
            )}
          </View>
          <Text style={styles.username}>@{profile?.username || 'foodie_explorer'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>🧭 FOOD EXPLORER</Text>
          </View>
          <Text style={styles.email}>{user?.email || 'explorer@hiddeneats.com'}</Text>

          {/* Explorer Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Collections</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </View>
          </View>
        </View>

        {/* Explorer Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earned Explorer Badges</Text>
          <View style={styles.badgeContainer}>
            {explorerBadges.map((badge, idx) => (
              <View key={idx} style={styles.badgeChip}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Saved & Activity Shortcuts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Activity & Saved Items</Text>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/collections')}>
            <Text style={styles.menuItemText}>📚 Saved Food Collections</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/booking/new')}>
            <Text style={styles.menuItemText}>📅 My Table Reservations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings')}>
            <Text style={styles.menuItemText}>⚙️ Preferences & Notifications</Text>
          </TouchableOpacity>
        </View>

        {/* Partner Transition Callout CTA */}
        <View style={styles.partnerCTA}>
          <Text style={styles.ctaTitle}>Own a Restaurant or Cafe? 🏢</Text>
          <Text style={styles.ctaSub}>
            Claim your Google Place ID, publish secret off-menu items, and receive direct reservations.
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => Alert.alert('Partner Portal', 'Open the Next.js Partner Studio on web at /dashboard to claim your restaurant profile.')}
          >
            <Text style={styles.ctaButtonText}>Switch to Partner Studio →</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  avatarContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#f59e0b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  username: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  roleBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  roleBadgeText: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '800',
  },
  email: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#334155',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badgeChip: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  badgeText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  menuItem: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  menuItemText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '600',
  },
  partnerCTA: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  ctaTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f59e0b',
    marginBottom: 4,
  },
  ctaSub: {
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 18,
    marginBottom: 12,
  },
  ctaButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800',
  },
  signOutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '700',
  },
});
