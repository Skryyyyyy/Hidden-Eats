import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface CheckIn {
  id: string;
  status: 'Busy' | 'Moderate' | 'Empty';
  waitTimeMinutes: number;
  timestamp: string; // ISO string
}

interface LiveCrowdIndicatorProps {
  checkIns: CheckIn[];
}

export const LiveCrowdIndicator: React.FC<LiveCrowdIndicatorProps> = ({ checkIns }) => {
  // 1. Filter check-ins within the last 2 hours
  const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
  const recentCheckIns = checkIns.filter(
    (c) => new Date(c.timestamp).getTime() >= twoHoursAgo
  );

  // 2. Rule: Don't show indicator if fewer than 3 check-ins in window
  if (recentCheckIns.length < 3) {
    return null;
  }

  // 3. Aggregate votes & wait times
  const counts = { Busy: 0, Moderate: 0, Empty: 0 };
  let totalWaitTime = 0;

  for (const c of recentCheckIns) {
    counts[c.status]++;
    totalWaitTime += c.waitTimeMinutes;
  }

  const majorityStatus = (Object.keys(counts) as Array<keyof typeof counts>).reduce(
    (a, b) => (counts[a] >= counts[b] ? a : b)
  );

  const avgWaitTime = Math.round(totalWaitTime / recentCheckIns.length);

  const statusColor =
    majorityStatus === 'Busy'
      ? '#ef4444'
      : majorityStatus === 'Moderate'
      ? '#f59e0b'
      : '#10b981';

  return (
    <View style={[styles.container, { borderColor: statusColor }]}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <Text style={styles.title}>Live Crowd Level</Text>
        </View>
        <Text style={[styles.statusText, { color: statusColor }]}>{majorityStatus}</Text>
      </View>

      <Text style={styles.waitText}>
        ⏱️ Est. Wait Time: <Text style={styles.waitValue}>{avgWaitTime} mins</Text>
      </Text>
      <Text style={styles.metaText}>
        Based on {recentCheckIns.length} community check-ins in the last 2 hours
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  waitText: {
    fontSize: 13,
    color: '#cbd5e1',
    marginBottom: 4,
  },
  waitValue: {
    color: '#ffffff',
    fontWeight: '700',
  },
  metaText: {
    fontSize: 11,
    color: '#64748b',
  },
});
