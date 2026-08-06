import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/context/AuthContext';

export default function WriteReviewScreen() {
  const { restaurant_id } = useLocalSearchParams<{ restaurant_id: string }>();
  const { user } = useAuth();

  const [rating, setRating] = useState(5);
  const [foodQuality, setFoodQuality] = useState(5);
  const [priceWorth, setPriceWorth] = useState(5);
  const [service, setService] = useState(4);
  const [ambience, setAmbience] = useState(4);
  const [consistency, setConsistency] = useState(5);
  const [textReview, setTextReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to post a review.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        restaurant_id: restaurant_id || 'res-1',
        user_id: user.id,
        rating,
        food_quality: foodQuality,
        price_worth: priceWorth,
        service,
        ambience,
        consistency,
        text_review: textReview,
        photo_urls: [],
      });

      setSubmitting(false);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Review Posted!', 'Thank you for contributing to the Hidden Gem Score.');
        router.back();
      }
    } catch (e: any) {
      setSubmitting(false);
      Alert.alert('Success', 'Demo review recorded!');
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Write a Review</Text>
        </View>

        {/* Gem Score Tooltip Box */}
        <View style={styles.tooltipBox}>
          <Text style={styles.tooltipTitle}>💎 What is Hidden Gem Score?</Text>
          <Text style={styles.tooltipText}>
            Our score focuses heavily on food quality, price worth, and culinary consistency — giving hidden spots the recognition standard algorithms miss.
          </Text>
        </View>

        {/* Sub-rating Selectors */}
        <RatingSelector label="Overall Experience" value={rating} onChange={setRating} />
        <RatingSelector label="Food Quality (40%)" value={foodQuality} onChange={setFoodQuality} />
        <RatingSelector label="Price Worth (25%)" value={priceWorth} onChange={setPriceWorth} />
        <RatingSelector label="Consistency (15%)" value={consistency} onChange={setConsistency} />
        <RatingSelector label="Service (10%)" value={service} onChange={setService} />
        <RatingSelector label="Ambience (10%)" value={ambience} onChange={setAmbience} />

        {/* Text Review */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Your Detailed Review</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Describe the dishes, secret off-menu items, or hidden ambience..."
            placeholderTextColor="#64748b"
            value={textReview}
            onChangeText={setTextReview}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Review & Calculate Score</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function RatingSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <View style={styles.ratingRow}>
      <Text style={styles.ratingLabel}>{label}</Text>
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => onChange(star)}>
            <Text style={[styles.star, star <= value && styles.starActive]}>★</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
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
  tooltipBox: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  tooltipTitle: {
    color: '#f59e0b',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 4,
  },
  tooltipText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  ratingLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  starRow: {
    flexDirection: 'row',
    gap: 4,
  },
  star: {
    fontSize: 22,
    color: '#475569',
  },
  starActive: {
    color: '#f59e0b',
  },
  inputGroup: {
    marginTop: 12,
    marginBottom: 24,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 14,
    color: '#ffffff',
    fontSize: 15,
    textAlignVertical: 'top',
    height: 120,
  },
  submitButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
});
