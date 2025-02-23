import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import BookingSummary from '../components/BookingSummary';

const BookingConfirmationScreen = () => {
  const { bookingId } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="check-circle"
            size={64}
            color={theme.colors.primary}
          />
          <Text variant="headlineMedium" style={styles.title}>
            Booking Confirmed!
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Your reservation has been successfully confirmed.
          </Text>
        </View>

        <BookingSummary bookingId={bookingId as string} />

        <Text variant="bodyMedium" style={styles.info}>
          You'll receive a confirmation email with all the details shortly.
        </Text>

        <View style={styles.buttons}>
          <Button
            mode="contained"
            onPress={() => router.push('/bookings')}
            style={styles.button}
          >
            View My Bookings
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.push('/')}
            style={styles.button}
          >
            Back to Home
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
  },
  info: {
    textAlign: 'center',
    color: '#666',
  },
  buttons: {
    marginTop: 24,
    gap: 12,
  },
  button: {
    width: '100%',
  },
});

export default BookingConfirmationScreen; 