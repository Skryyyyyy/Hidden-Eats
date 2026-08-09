import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { Typography } from '../components/Typography';
import { theme } from '../theme';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type DriverState = 'OFFLINE' | 'SEARCHING' | 'INCOMING_ORDER' | 'ACCEPTED_DELIVERY';

export const DriverScreen = () => {
  const navigation = useNavigation();
  const [driverState, setDriverState] = useState<DriverState>('OFFLINE');

  // Simulate finding an order after 3 seconds of searching
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (driverState === 'SEARCHING') {
      timer = setTimeout(() => {
        setDriverState('INCOMING_ORDER');
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [driverState]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={theme.colors.text.dark} />
        </TouchableOpacity>
        <Typography variant="h2" color={theme.colors.text.dark}>Driver Mode</Typography>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        
        {driverState === 'OFFLINE' && (
          <Animated.View entering={FadeIn} style={styles.centerBox}>
            <View style={styles.iconCircle}>
              <Icon name="power" size={40} color={theme.colors.textMuted.dark} />
            </View>
            <Typography variant="h3" color={theme.colors.text.dark} style={{ marginTop: 20 }}>You are Offline</Typography>
            <Typography variant="body" color={theme.colors.textMuted.dark} align="center" style={{ marginTop: 8 }}>
              Go online to start receiving delivery requests.
            </Typography>
            
            <TouchableOpacity style={styles.primaryButton} onPress={() => setDriverState('SEARCHING')}>
              <Typography variant="body" color="#FFF" style={{ fontWeight: 'bold' }}>GO ONLINE</Typography>
            </TouchableOpacity>
          </Animated.View>
        )}

        {driverState === 'SEARCHING' && (
          <Animated.View entering={FadeIn} style={styles.centerBox}>
            <View style={[styles.iconCircle, { borderColor: theme.colors.primary }]}>
              <Icon name="loader" size={40} color={theme.colors.primary} />
            </View>
            <Typography variant="h3" color={theme.colors.text.dark} style={{ marginTop: 20 }}>Finding Deliveries...</Typography>
            <Typography variant="body" color={theme.colors.textMuted.dark} align="center" style={{ marginTop: 8 }}>
              Searching for restaurants near you.
            </Typography>
            
            <TouchableOpacity style={styles.outlineButton} onPress={() => setDriverState('OFFLINE')}>
              <Typography variant="body" color={theme.colors.text.dark} style={{ fontWeight: 'bold' }}>GO OFFLINE</Typography>
            </TouchableOpacity>
          </Animated.View>
        )}

        {driverState === 'INCOMING_ORDER' && (
          <Animated.View entering={FadeIn} style={styles.centerBox}>
            {/* Background simulated map */}
            <View style={[styles.iconCircle, { borderColor: theme.colors.secondary, backgroundColor: `${theme.colors.secondary}20` }]}>
              <Icon name="bell" size={40} color={theme.colors.secondary} />
            </View>
            
            <Animated.View entering={FadeInDown.springify()} exiting={FadeOutDown} style={styles.orderCard}>
              <Typography variant="h2" color={theme.colors.text.dark} align="center">$7.50</Typography>
              <Typography variant="caption" color={theme.colors.textMuted.dark} align="center" style={{ marginBottom: 16 }}>Estimated Earnings</Typography>
              
              <View style={styles.orderDetailRow}>
                <Icon name="map-pin" size={16} color={theme.colors.primary} />
                <Typography variant="body" color={theme.colors.text.dark} style={{ marginLeft: 8 }}>Spice Kitchen</Typography>
              </View>
              <View style={styles.orderDetailRow}>
                <Icon name="navigation" size={16} color={theme.colors.secondary} />
                <Typography variant="body" color={theme.colors.text.dark} style={{ marginLeft: 8 }}>3.2 miles total</Typography>
              </View>
              <View style={styles.orderDetailRow}>
                <Icon name="package" size={16} color={theme.colors.textMuted.dark} />
                <Typography variant="body" color={theme.colors.text.dark} style={{ marginLeft: 8 }}>2 items</Typography>
              </View>

              <TouchableOpacity style={[styles.primaryButton, { width: '100%', marginTop: 24 }]} onPress={() => setDriverState('ACCEPTED_DELIVERY')}>
                <Typography variant="body" color="#FFF" style={{ fontWeight: 'bold' }}>ACCEPT DELIVERY</Typography>
              </TouchableOpacity>
              
              <TouchableOpacity style={{ marginTop: 16 }} onPress={() => setDriverState('SEARCHING')}>
                <Typography variant="body" color={theme.colors.textMuted.dark} align="center">Decline</Typography>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        )}

        {driverState === 'ACCEPTED_DELIVERY' && (
          <Animated.View entering={FadeIn} style={styles.centerBox}>
            <View style={[styles.iconCircle, { borderColor: theme.colors.success, backgroundColor: `${theme.colors.success}20` }]}>
              <Icon name="check" size={40} color={theme.colors.success} />
            </View>
            <Typography variant="h3" color={theme.colors.text.dark} style={{ marginTop: 20 }}>Order Accepted!</Typography>
            <Typography variant="body" color={theme.colors.textMuted.dark} align="center" style={{ marginTop: 8 }}>
              Please head to Spice Kitchen for pickup.
            </Typography>
            
            <View style={styles.actionCard}>
               <Typography variant="h3" color={theme.colors.text.dark} align="center">Spice Kitchen</Typography>
               <Typography variant="caption" color={theme.colors.textMuted.dark} align="center">123 Hidden Alley, SF</Typography>
               <TouchableOpacity style={[styles.primaryButton, { width: '100%', marginTop: 24 }]} onPress={() => {}}>
                  <Typography variant="body" color="#FFF" style={{ fontWeight: 'bold' }}>OPEN MAPS</Typography>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.outlineButton, { width: '100%', marginTop: 12 }]} onPress={() => setDriverState('SEARCHING')}>
                  <Typography variant="body" color={theme.colors.text.dark} style={{ fontWeight: 'bold' }}>FINISH DEMO</Typography>
                </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
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
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.dark,
  },
  backButton: {
    padding: theme.spacing.sm,
    marginLeft: -theme.spacing.sm,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  centerBox: {
    alignItems: 'center',
    width: '100%',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: theme.colors.border.dark,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.dark,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 40,
    alignItems: 'center',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  orderCard: {
    backgroundColor: theme.colors.surface.dark,
    width: '100%',
    borderRadius: 16,
    padding: 24,
    marginTop: 32,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  orderDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionCard: {
    backgroundColor: theme.colors.surface.dark,
    width: '100%',
    borderRadius: 16,
    padding: 24,
    marginTop: 32,
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
  }
});
