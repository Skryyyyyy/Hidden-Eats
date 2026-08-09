import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Typography } from '../components/Typography';
import { theme } from '../theme';
import Icon from '@expo/vector-icons/Feather';

const { width } = Dimensions.get('window');

type GenericScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GenericScreen'>;
type GenericScreenRouteProp = RouteProp<RootStackParamList, 'GenericScreen'>;

interface Props {
  navigation: GenericScreenNavigationProp;
  route: GenericScreenRouteProp;
}

export const GenericScreen: React.FC<Props> = ({ navigation, route }) => {
  const { title } = route.params;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={theme.colors.text.dark} />
        </TouchableOpacity>
        <Typography variant="h2" color={theme.colors.text.dark} style={{ flex: 1, textAlign: 'center', marginRight: 44 }}>
          {title}
        </Typography>
      </View>

      {/* Placeholder Content */}
      <View style={styles.content}>
        <Icon name="coffee" size={48} color={theme.colors.primary} style={{ marginBottom: 20 }} />
        <Typography variant="h3" color={theme.colors.text.dark} style={{ textAlign: 'center', marginBottom: 12 }}>
          {title} coming soon
        </Typography>
        <Typography variant="body" color={theme.colors.textMuted.dark} style={{ textAlign: 'center', paddingHorizontal: 40 }}>
          We are currently crafting this experience for you. Check back later!
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.dark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxl + 10,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.dark,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
