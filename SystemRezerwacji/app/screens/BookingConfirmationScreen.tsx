import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

const BookingConfirmationScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons 
            name="check-circle" 
            size={80} 
            color={theme.colors.primary} 
          />
        </View>

        <Text variant="headlineMedium" style={styles.title}>
          Booking Confirmed!
        </Text>

        <Text variant="bodyLarge" style={styles.message}>
          Your booking request has been confirmed. You'll receive an email with all the details shortly.
        </Text>

        <View style={styles.buttonContainer}>
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
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginVertical: 32,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
  },
});

export default BookingConfirmationScreen; 