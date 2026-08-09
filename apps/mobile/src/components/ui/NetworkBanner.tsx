import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';

interface NetworkBannerProps {
  forceState?: 'offline' | 'slow' | 'online';
}

export const NetworkBanner: React.FC<NetworkBannerProps> = ({ forceState }) => {
  const [isOffline, setIsOffline] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const slideAnim = useState(new Animated.Value(-100))[0];
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // In a real app, integrate @react-native-community/netinfo here.
    if (forceState) {
      setIsOffline(forceState === 'offline');
      setIsSlow(forceState === 'slow');
    }
  }, [forceState]);

  useEffect(() => {
    if (isOffline || isSlow) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOffline, isSlow, slideAnim]);

  if (!isOffline && !isSlow && !forceState) return null;

  const backgroundColor = isOffline ? '#dc2626' : '#d97706';
  const iconName = isOffline ? 'wifi-off' : 'activity';
  const title = isOffline ? 'No Internet Connection' : 'Slow Network';
  const message = isOffline ? 'Please check your connection.' : 'Requests may take longer.';

  return (
    <Animated.View style={[
      styles.container, 
      { 
        backgroundColor, 
        transform: [{ translateY: slideAnim }],
        paddingTop: insets.top > 0 ? insets.top : 40 
      }
    ]}>
      <Feather name={iconName} size={20} color="#ffffff" style={styles.icon} />
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 16,
    zIndex: 999,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  icon: {
    marginRight: 12,
  },
  title: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  message: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 2,
  },
});
