import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { RootNavigator } from './RootNavigator';

export const AppNavigator = () => {
  // Using DarkTheme as base to match our premium aesthetic
  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#121212',
    },
  };

  return (
    <NavigationContainer theme={customDarkTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
};
