import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Animated, { FadeInUp, FadeInDown, SlideInDown, ZoomIn } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { theme } from '../theme';
import Icon from 'react-native-vector-icons/Feather';

const { height } = Dimensions.get('window');

type CartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cart'>;

interface Props {
  navigation: CartScreenNavigationProp;
}

// Dummy cart data
const CART_ITEMS = [
  { id: '1', name: 'Special Butter Podi Dosa', price: 80, quantity: 2 },
  { id: '2', name: 'Filter Kaapi', price: 30, quantity: 2 },
];

export const CartScreen: React.FC<Props> = ({ navigation }) => {
  const [items, setItems] = useState(CART_ITEMS);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxes = subtotal * 0.05;
  const deliveryFee = 40;
  const total = subtotal + taxes + deliveryFee;

  const handleCheckout = () => {
    setIsSuccess(true);
    setTimeout(() => {
      navigation.navigate('MainTabs');
    }, 3000);
  };

  if (isSuccess) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.successIcon}>
          <Icon name="check" size={60} color={theme.colors.background.dark} />
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(300)}>
          <Typography variant="h1" color={theme.colors.text.light} style={{ marginTop: 24, textAlign: 'center' }}>
            Order Placed!
          </Typography>
          <Typography variant="body" color={theme.colors.textMuted.light} style={{ marginTop: 8, textAlign: 'center' }}>
            The restaurant is preparing your food.
          </Typography>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="x" size={24} color={theme.colors.text.light} />
        </TouchableOpacity>
        <Typography variant="h2" color={theme.colors.text.light} style={{ flex: 1, textAlign: 'center', marginRight: 44 }}>
          Your Order
        </Typography>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Typography variant="h3" color={theme.colors.text.light} style={{ marginBottom: 16 }}>Raju's Midnight Dosa Cart</Typography>
          
          {items.map((item, index) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.itemMeta}>
                <Icon name="stop-circle" size={16} color={theme.colors.success} style={{ marginRight: 12 }} />
                <View>
                  <Typography variant="body" color={theme.colors.text.light} style={{ fontWeight: 'bold' }}>{item.name}</Typography>
                  <Typography variant="caption" color={theme.colors.textMuted.light} style={{ marginTop: 4 }}>₹{item.price}</Typography>
                </View>
              </View>
              <View style={styles.quantityControl}>
                <TouchableOpacity style={styles.qtyButton}>
                  <Icon name="minus" size={14} color={theme.colors.text.light} />
                </TouchableOpacity>
                <Typography variant="body" color={theme.colors.text.light} style={{ width: 24, textAlign: 'center' }}>
                  {item.quantity}
                </Typography>
                <TouchableOpacity style={styles.qtyButton}>
                  <Icon name="plus" size={14} color={theme.colors.text.light} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.billDetails}>
          <Typography variant="h3" color={theme.colors.text.light} style={{ marginBottom: 16 }}>Bill Details</Typography>
          
          <View style={styles.billRow}>
            <Typography variant="body" color={theme.colors.textMuted.light}>Item Total</Typography>
            <Typography variant="body" color={theme.colors.text.light}>₹{subtotal}</Typography>
          </View>
          <View style={styles.billRow}>
            <Typography variant="body" color={theme.colors.textMuted.light}>Delivery Partner Fee</Typography>
            <Typography variant="body" color={theme.colors.text.light}>₹{deliveryFee}</Typography>
          </View>
          <View style={styles.billRow}>
            <Typography variant="body" color={theme.colors.textMuted.light}>Taxes and Charges</Typography>
            <Typography variant="body" color={theme.colors.text.light}>₹{taxes.toFixed(2)}</Typography>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.billRow}>
            <Typography variant="h3" color={theme.colors.text.light}>To Pay</Typography>
            <Typography variant="h3" color={theme.colors.text.light}>₹{total.toFixed(2)}</Typography>
          </View>
        </Animated.View>
      </ScrollView>

      <Animated.View entering={SlideInDown.delay(300).springify()} style={styles.footer}>
        <View style={styles.paymentMethod}>
          <Icon name="credit-card" size={20} color={theme.colors.primary} />
          <Typography variant="body" color={theme.colors.text.light} style={{ marginLeft: 12, flex: 1, fontWeight: 'bold' }}>
            Pay via UPI
          </Typography>
          <Icon name="chevron-right" size={20} color={theme.colors.textMuted.light} />
        </View>
        <Button 
          title={`Place Order • ₹${total.toFixed(2)}`} 
          variant="primary" 
          onPress={handleCheckout} 
        />
      </Animated.View>
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
    padding: theme.spacing.lg,
    paddingBottom: 120,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.dark,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  qtyButton: {
    padding: 8,
  },
  billDetails: {
    backgroundColor: theme.colors.surface.dark,
    padding: theme.spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
    marginTop: 16,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.dark,
    marginVertical: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 40,
    backgroundColor: 'rgba(18,18,18,0.95)',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.dark,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.dark,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.success,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  }
});
