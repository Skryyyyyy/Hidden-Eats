export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Welcome: undefined;
  MainTabs: undefined;
  RestaurantDetails: { id: string };
  Reviews: { restaurantId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Map: undefined;
  Collections: undefined;
  Profile: undefined;
};
