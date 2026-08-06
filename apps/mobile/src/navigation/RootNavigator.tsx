import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { SplashScreen } from '../screens/SplashScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { MainTabs } from './MainTabs';
import { RestaurantDetailsScreen } from '../screens/RestaurantDetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'fade', // Smooth transitions between root screens
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen 
        name="RestaurantDetails" 
        component={RestaurantDetailsScreen} 
        options={{ animation: 'slide_from_bottom' }} // Apple-style modal slide
      />
    </Stack.Navigator>
  );
};
