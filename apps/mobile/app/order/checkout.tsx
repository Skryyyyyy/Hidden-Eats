import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function OrderCheckoutScreen() {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  // Cart summary
  const items = [
    { name: "Chef's Secret Smoked Biryani 🔥", price: 340, qty: 1 },
    { name: 'Garlic Butter Naan', price: 60, qty: 2 },
  ];

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const handlePayment = async () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        'Order Placed! 🍲',
        `Pre-order confirmed! Total ₹${total} paid via Razorpay/Stripe.`
      );
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pre-Order Checkout</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Pre-Order Cart</Text>

          {items.map((item, idx) => (
            <View key={idx} style={styles.cartRow}>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>Qty: {item.qty}</Text>
              </View>
              <Text style={styles.itemPrice}>₹{item.price * item.qty}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>₹{subtotal}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Taxes (5% GST)</Text>
            <Text style={styles.priceValue}>₹{tax}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>

          <TouchableOpacity style={styles.payButton} onPress={handlePayment} disabled={submitting}>
            {submitting ? (
              <ActivityIndicator color="#0f172a" />
            ) : (
              <Text style={styles.payButtonText}>Pay ₹{total} via Razorpay / Stripe</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backText: {
    color: '#94a3b8',
    fontSize: 15,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 16,
  },
  cartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  itemQty: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  itemPrice: {
    color: '#10b981',
    fontWeight: '700',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    color: '#94a3b8',
    fontSize: 13,
  },
  priceValue: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  totalLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  totalValue: {
    color: '#f59e0b',
    fontSize: 18,
    fontWeight: '800',
  },
  payButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  payButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '800',
  },
});
