import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FeedbackState } from '../components/ui/FeedbackState';
import { NetworkBanner } from '../components/ui/NetworkBanner';
import { LoadingState } from '../components/ui/LoadingState';
import { InputFeedback, FormInputError } from '../components/ui/InputFeedback';

export const TestStatesScreen = () => {
  const [networkState, setNetworkState] = useState<'online' | 'offline' | 'slow'>('online');
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState('Secret Burger Place');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Absolute positioned Network Banner */}
      <NetworkBanner forceState={networkState} />

      {/* Full Screen Loader */}
      {isLoading && <LoadingState fullScreen text="Loading Map Data..." />}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>UI States Testing</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Network States</Text>
          <View style={styles.buttonGroup}>
            <Button title="Online" onPress={() => setNetworkState('online')} />
            <Button title="Offline" color="#dc2626" onPress={() => setNetworkState('offline')} />
            <Button title="Slow" color="#d97706" onPress={() => setNetworkState('slow')} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Loading State</Text>
          <View style={styles.loaderBox}>
            <LoadingState size="small" />
            <LoadingState text="Finding places..." />
            <Button 
              title="Test Full Screen Loader (2s)" 
              onPress={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 2000);
              }} 
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Form Feedback & Success</Text>
          <View style={styles.formBox}>
            <Text style={styles.label}>Restaurant Name</Text>
            <TextInput 
              style={styles.inputError}
              value={inputText}
              onChangeText={setInputText}
            />
            <FormInputError message="This restaurant is already registered." />
            
            <View style={{ marginTop: 16 }}>
              <InputFeedback type="error" message="Please fix the errors above before submitting." />
            </View>
            <View style={{ marginTop: 16 }}>
              <InputFeedback type="success" message="Review submitted successfully! It is now live." />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Feedback States</Text>
          
          <View style={styles.card}>
            <FeedbackState 
              iconName="package"
              title="No Hidden Eats Found"
              description="You haven't saved any restaurants yet. Start exploring your neighborhood!"
              actionButton={{ label: "Explore Map", onPress: () => console.log("Navigating...") }}
            />
          </View>

          <View style={styles.card}>
            <FeedbackState 
              variant="error"
              iconName="alert-triangle"
              title="Failed to Load Places"
              description="We couldn't connect to our servers to fetch nearby restaurants."
              actionButton={{ label: "Try Again", onPress: () => console.log("Retrying...") }}
            />
          </View>

          <View style={styles.card}>
            <FeedbackState 
              variant="warning"
              iconName="lock"
              title="Location Required"
              description="We need your location to show you nearby hidden gems."
              actionButton={{ label: "Enable Location", onPress: () => console.log("Prompting...") }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#111827',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#374151',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
  },
  loaderBox: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    gap: 16,
  },
  formBox: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
});
