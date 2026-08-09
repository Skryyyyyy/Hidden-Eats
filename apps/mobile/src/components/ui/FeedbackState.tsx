import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

interface FeedbackStateProps {
  iconName: string;
  title: string;
  description: string;
  actionButton?: {
    label: string;
    onPress: () => void;
  };
  variant?: 'default' | 'error' | 'warning' | 'success';
}

export const FeedbackState: React.FC<FeedbackStateProps> = ({
  iconName,
  title,
  description,
  actionButton,
  variant = 'default',
}) => {
  const getIconColor = () => {
    switch (variant) {
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'success': return '#22c55e';
      default: return '#9ca3af';
    }
  };

  const getIconBackgroundColor = () => {
    switch (variant) {
      case 'error': return '#fef2f2';
      case 'warning': return '#fffbeb';
      case 'success': return '#f0fdf4';
      default: return '#f9fafb';
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: getIconBackgroundColor() }]}>
        <Feather name={iconName} size={40} color={getIconColor()} />
      </View>
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {actionButton && (
        <TouchableOpacity style={styles.button} onPress={actionButton.onPress}>
          <Text style={styles.buttonText}>{actionButton.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    minHeight: 300,
  },
  iconContainer: {
    padding: 16,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});
