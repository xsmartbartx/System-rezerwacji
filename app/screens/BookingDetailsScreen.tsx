import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Chip } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '../hooks/useQuery';
import { supabase } from '../lib/supabase';
import BookingSummary from '../components/BookingSummary';
import LoadingSpinner from '../components/LoadingSpinner';

const BookingDetailsScreen = () => {
  const { id } = useLocalSearchParams();

  const { data: booking, isLoading } = useQuery(['booking', id], async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        properties (
          title,
          location,
          images (url)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  });

  if (isLoading) return <LoadingSpinner />;
  if (!booking) return <Text>Booking not found</Text>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="headlineMedium">{booking.properties.title}</Text>
          <Chip
            mode="flat"
            selectedColor={getStatusColor(booking.status)}
            style={styles.statusChip}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Chip>
        </View>

        <BookingSummary bookingId={id as string} />

        {booking.status === 'pending' && (
          <View style={styles.buttons}>
            <Button
              mode="contained"
              onPress={() => router.push(`/booking/${id}/edit`)}
              style={styles.button}
            >
              Modify Booking
            </Button>
          </View>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusChip: {
    height: 32,
  },
  buttons: {
    marginTop: 24,
    gap: 12,
  },
  button: {
    width: '100%',
  },
});

export default BookingDetailsScreen; 