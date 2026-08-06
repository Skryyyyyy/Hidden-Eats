import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const [themeMode, setThemeMode] = useState<'dark' | 'midnight' | 'system'>('dark');
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>('km');
  const [notifyNewGems, setNotifyNewGems] = useState(true);
  const [notifyBookings, setNotifyBookings] = useState(true);
  const [notifySecretMenu, setNotifySecretMenu] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>App Settings</Text>
        </View>

        {/* Section 1: Appearance & Theme */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance & Theme</Text>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Color Theme</Text>
            <View style={styles.themeRow}>
              {(['dark', 'midnight', 'system'] as const).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[styles.themeOption, themeMode === mode && styles.themeOptionActive]}
                  onPress={() => setThemeMode(mode)}
                >
                  <Text
                    style={[
                      styles.themeOptionText,
                      themeMode === mode && styles.themeOptionTextActive,
                    ]}
                  >
                    {mode === 'dark' ? '🌙 Dark' : mode === 'midnight' ? '🌌 Midnight' : '📱 System'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Section 2: Units & Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>Distance Measurement</Text>
              <View style={styles.unitRow}>
                <TouchableOpacity
                  style={[styles.unitChip, distanceUnit === 'km' && styles.unitChipActive]}
                  onPress={() => setDistanceUnit('km')}
                >
                  <Text style={[styles.unitChipText, distanceUnit === 'km' && styles.unitChipTextActive]}>
                    KM
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.unitChip, distanceUnit === 'mi' && styles.unitChipActive]}
                  onPress={() => setDistanceUnit('mi')}
                >
                  <Text style={[styles.unitChipText, distanceUnit === 'mi' && styles.unitChipTextActive]}>
                    MILES
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Section 3: Push Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingText}>New Hidden Gems</Text>
                <Text style={styles.settingDesc}>Get notified when top-rated secret spots open nearby</Text>
              </View>
              <Switch
                value={notifyNewGems}
                onValueChange={setNotifyNewGems}
                trackColor={{ false: '#334155', true: '#f59e0b' }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingText}>Booking Updates</Text>
                <Text style={styles.settingDesc}>Table reservation confirmations and alerts</Text>
              </View>
              <Switch
                value={notifyBookings}
                onValueChange={setNotifyBookings}
                trackColor={{ false: '#334155', true: '#f59e0b' }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingText}>Off-Menu Secret Drops</Text>
                <Text style={styles.settingDesc}>Alerts when local chefs launch secret dishes</Text>
              </View>
              <Switch
                value={notifySecretMenu}
                onValueChange={setNotifySecretMenu}
                trackColor={{ false: '#334155', true: '#f59e0b' }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backText: {
    color: '#94a3b8',
    fontSize: 15,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  themeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  themeOption: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  themeOptionActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  themeOptionText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  themeOptionTextActive: {
    color: '#0f172a',
    fontWeight: '800',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  settingDesc: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  unitRow: {
    flexDirection: 'row',
    gap: 6,
  },
  unitChip: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  unitChipActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  unitChipText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
  },
  unitChipTextActive: {
    color: '#0f172a',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
  },
});
