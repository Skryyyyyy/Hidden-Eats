import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface CravingChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export const CravingChip: React.FC<CravingChipProps> = ({ label, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.chip, isSelected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.label, isSelected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  label: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
  },
  labelSelected: {
    color: '#0f172a',
    fontWeight: '700',
  },
});
