import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import type { Listing } from '../types';
import { formatPrice } from '../utils';

interface BookingSummaryProps {
  listing: Listing;
  startDate: Date;
  endDate: Date;
}

const BookingSummary = ({ listing, startDate, endDate }: BookingSummaryProps) => {
  const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const subtotal = listing.price * nights;
  const serviceFee = subtotal * 0.12; // 12% service fee
  const total = subtotal + serviceFee;

  return (
    <View style={styles.container}>
      <Text variant="titleLarge">Booking Summary</Text>
      
      <View style={styles.dates}>
        <Text variant="bodyLarge">
          {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
        </Text>
        <Text variant="bodyMedium" style={styles.nights}>
          {nights} nights
        </Text>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.priceRow}>
        <Text variant="bodyLarge">
          {formatPrice(listing.price)} × {nights} nights
        </Text>
        <Text variant="bodyLarge">{formatPrice(subtotal)}</Text>
      </View>

      <View style={styles.priceRow}>
        <Text variant="bodyLarge">Service fee</Text>
        <Text variant="bodyLarge">{formatPrice(serviceFee)}</Text>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.priceRow}>
        <Text variant="titleMedium">Total</Text>
        <Text variant="titleMedium">{formatPrice(total)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 16,
  },
  dates: {
    marginTop: 8,
  },
  nights: {
    color: '#666',
    marginTop: 4,
  },
  divider: {
    marginVertical: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
});

export default BookingSummary; 