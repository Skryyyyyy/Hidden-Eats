import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Background Graphic */}
      <View style={styles.backgroundContainer}>
        <View style={styles.maroonBackdrop} />
        <Animated.Image 
          source={{ uri: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' }} 
          style={styles.heroImage}
          entering={FadeInDown.duration(1000).springify()}
        />
        <View style={styles.overlay} />
      </View>

      <View style={styles.contentContainer}>
        <Animated.View entering={FadeInUp.delay(300).duration(800).springify()} style={styles.textBlock}>
          <Typography variant="hero" color={theme.colors.surface.light} style={{ lineHeight: 48 }}>
            DESIGN{'\n'}BEYOND{'\n'}LIMITS.
          </Typography>
          <Typography variant="h2" color={theme.colors.secondary} style={{ marginTop: theme.spacing.sm }}>
            WHERE EVERY BITE{'\n'}HITS DIFFERENT
          </Typography>
          <Typography variant="body" color={theme.colors.surfaceGlass.light} style={{ marginTop: theme.spacing.lg }}>
            Discover the best hidden gems, local favorites, and top-tier dining experiences in your city.
          </Typography>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(600).duration(800).springify()} style={styles.buttonContainer}>
          <Button 
            title="Get Started" 
            variant="secondary"
            onPress={() => navigation.navigate('MainTabs')} 
          />
          <Button 
            title="Log In" 
            variant="glass"
            style={{ marginTop: theme.spacing.md }}
            onPress={() => {}} 
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#671212', // Maroon to match the web landing page
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
  },
  maroonBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#671212',
  },
  heroImage: {
    width: width * 1.5,
    height: height * 0.6,
    position: 'absolute',
    top: -height * 0.05,
    right: -width * 0.25,
    opacity: 0.8,
    transform: [{ rotate: '-10deg' }],
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(103, 18, 18, 0.4)', // Maroon tint overlay
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
  },
  textBlock: {
    marginBottom: theme.spacing.xxl,
  },
  buttonContainer: {
    width: '100%',
  },
});
