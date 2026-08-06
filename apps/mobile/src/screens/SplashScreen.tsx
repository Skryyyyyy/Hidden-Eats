import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Typography } from '../components/Typography';
import { theme } from '../theme';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    // Artificial delay to simulate loading resources
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animated.View entering={ZoomIn.duration(800).springify()} exiting={FadeOut.duration(400)}>
        <Typography variant="display" color={theme.colors.surface.light} align="center">
          Hidden Eats
        </Typography>
        <Animated.View entering={FadeIn.delay(600).duration(800)}>
          <Typography 
            variant="body" 
            color={theme.colors.surfaceGlass.light} 
            align="center"
            style={{ marginTop: theme.spacing.md }}
          >
            Skip the chains. Eat like a local.
          </Typography>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
