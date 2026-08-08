export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Welcome: undefined;
  MainTabs: undefined;
  GenericScreen: { title: string };
  RestaurantDetails: { id: string };
  Cart: undefined;
  OrderTracking: undefined;
  Reviews: { restaurantId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Map: undefined;
  Collections: undefined;
  Profile: undefined;
};
