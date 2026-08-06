import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface TypographyProps extends TextProps {
  variant?: 'display' | 'hero' | 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'button';
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'black';
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = theme.colors.text.light,
  align = 'left',
  weight,
  style,
  children,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'hero':
        return { fontSize: theme.typography.size.hero, fontWeight: theme.typography.weight.black };
      case 'display':
        return { fontSize: theme.typography.size.display, fontWeight: theme.typography.weight.bold };
      case 'h1':
        return { fontSize: theme.typography.size.xxl, fontWeight: theme.typography.weight.bold };
      case 'h2':
        return { fontSize: theme.typography.size.xl, fontWeight: theme.typography.weight.bold };
      case 'h3':
        return { fontSize: theme.typography.size.lg, fontWeight: theme.typography.weight.semibold };
      case 'button':
        return { fontSize: theme.typography.size.md, fontWeight: theme.typography.weight.bold, textTransform: 'uppercase' as const };
      case 'caption':
        return { fontSize: theme.typography.size.xs, fontWeight: theme.typography.weight.regular };
      case 'body':
      default:
        return { fontSize: theme.typography.size.sm, fontWeight: theme.typography.weight.regular };
    }
  };

  const variantStyles = getVariantStyles();
  
  return (
    <Text
      style={[
        styles.base,
        variantStyles,
        { color, textAlign: align },
        weight && { fontWeight: theme.typography.weight[weight] },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: theme.typography.fontFamily.regular,
  },
});
