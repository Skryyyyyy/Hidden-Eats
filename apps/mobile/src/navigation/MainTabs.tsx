import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { theme } from '../theme';
import Icon from 'react-native-vector-icons/Feather';

// Import our new Screens
import { HomeScreen } from '../screens/HomeScreen';
import { MapScreen } from '../screens/MapScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { DiscoverScreen } from '../screens/DiscoverScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background.dark }}>
    <Text style={{ color: theme.colors.text.dark, fontSize: 24, fontWeight: 'bold' }}>{name}</Text>
  </View>
);

export const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111111',
          borderTopColor: 'rgba(255,255,255,0.05)',
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.textMuted.dark,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color} /> }}
      />
      <Tab.Screen 
        name="Search" 
        component={() => <PlaceholderScreen name="Search" />} 
        options={{ tabBarIcon: ({ color }) => <Icon name="search" size={24} color={color} /> }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
        options={{ tabBarIcon: ({ color }) => <Icon name="map" size={24} color={color} /> }}
      />
      <Tab.Screen 
        name="Collections" // Note: Re-using the route name to avoid changing navigation types unnecessarily right now, but UI will show Discover
        component={DiscoverScreen} 
        options={{ tabBarIcon: ({ color }) => <Icon name="compass" size={24} color={color} /> }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarIcon: ({ color }) => <Icon name="user" size={24} color={color} /> }}
      />
    </Tab.Navigator>
  );
};
