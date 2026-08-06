import React from 'react';
import { StyleSheet, Pressable, PressableProps, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { theme } from '../theme';
import { Typography } from './Typography';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass';
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  style,
  onPress,
  ...props
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(0.8, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(1, { duration: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          container: { backgroundColor: theme.colors.secondary },
          text: theme.colors.text.light,
        };
      case 'outline':
        return {
          container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.text.light },
          text: theme.colors.text.light,
        };
      case 'glass':
        return {
          container: { backgroundColor: theme.colors.surfaceGlass.light, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
          text: theme.colors.text.light,
        };
      case 'primary':
      default:
        return {
          container: { backgroundColor: theme.colors.primary },
          text: '#FFFFFF',
        };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={[styles.base, vStyles.container, animatedStyle, style]}
      {...props}
    >
      <Typography variant="button" color={vStyles.text}>
        {title}
      </Typography>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: theme.spacing.borderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
});
