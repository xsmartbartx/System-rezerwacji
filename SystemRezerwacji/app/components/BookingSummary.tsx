import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { useQuery } from '../hooks/useQuery';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../utils';

interface BookingSummaryProps {
  bookingId: string;
}

const BookingSummary = ({ bookingId }: BookingSummaryProps) => {
  const { data: booking } = useQuery(['booking', bookingId], async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        properties (
          title,
          location
        )
      `)
      .eq('id', bookingId)
      .single();

    if (error) throw error;
    return data;
  });

  if (!booking) return null;

  const startDate = new Date(booking.start_date);
  const endDate = new Date(booking.end_date);
  const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const pricePerNight = booking.total_price / nights;

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        {booking.properties.title}
      </Text>
      
      <Text variant="bodyLarge" style={styles.location}>
        {booking.properties.location}
      </Text>

      <View style={styles.dates}>
        <Text variant="bodyMedium">
          {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
        </Text>
        <Text variant="bodyMedium" style={styles.nights}>
          {nights} {nights === 1 ? 'night' : 'nights'}
        </Text>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.priceBreakdown}>
        <View style={styles.priceRow}>
          <Text variant="bodyMedium">
            {formatPrice(pricePerNight)} × {nights} nights
          </Text>
          <Text variant="bodyMedium">{formatPrice(booking.total_price)}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text variant="bodyMedium">Service fee</Text>
          <Text variant="bodyMedium">{formatPrice(booking.total_price * 0.12)}</Text>
        </View>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.priceRow}>
        <Text variant="titleMedium">Total</Text>
        <Text variant="titleMedium">
          {formatPrice(booking.total_price + (booking.total_price * 0.12))}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
  },
  title: {
    marginBottom: 4,
  },
  location: {
    color: '#666',
    marginBottom: 16,
  },
  dates: {
    marginBottom: 16,
  },
  nights: {
    color: '#666',
    marginTop: 4,
  },
  divider: {
    marginVertical: 16,
  },
  priceBreakdown: {
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default BookingSummary; 