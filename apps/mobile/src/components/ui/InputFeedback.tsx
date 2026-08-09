import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

interface InputFeedbackProps {
  type: 'error' | 'success';
  message: string;
}

export const InputFeedback: React.FC<InputFeedbackProps> = ({ type, message }) => {
  if (!message) return null;

  const isError = type === 'error';
  const color = isError ? '#dc2626' : '#16a34a';
  const bgColor = isError ? '#fef2f2' : '#f0fdf4';
  const borderColor = isError ? '#fecaca' : '#bbf7d0';
  const iconName = isError ? 'alert-circle' : 'check-circle';

  return (
    <View style={[styles.container, { backgroundColor: bgColor, borderColor }]}>
      <Feather name={iconName} size={16} color={color} style={styles.icon} />
      <Text style={[styles.message, { color }]}>{message}</Text>
    </View>
  );
};

interface FormInputErrorProps {
  message?: string;
}

export const FormInputError: React.FC<FormInputErrorProps> = ({ message }) => {
  if (!message) return null;
  return (
    <View style={styles.inlineContainer}>
      <Feather name="alert-circle" size={12} color="#dc2626" />
      <Text style={styles.inlineMessage}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  icon: {
    marginTop: 2,
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  inlineMessage: {
    color: '#dc2626',
    fontSize: 12,
    marginLeft: 4,
  },
});
