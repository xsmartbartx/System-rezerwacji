import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Dialog, Portal } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation } from '../hooks/useQuery';
import { supabase } from '../lib/supabase';
import { queryClient } from '../providers/QueryClientProvider';
import DateRangePicker from '../components/DateRangePicker';
import DynamicPriceDisplay from '../components/DynamicPriceDisplay';
import LoadingSpinner from '../components/LoadingSpinner';

const BookingEditScreen = () => {
  const { id } = useLocalSearchParams();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  const { data: booking, isLoading } = useQuery(['booking', id], async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        properties (
          title,
          location,
          price
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  });

  const updateBooking = useMutation(async () => {
    if (!selectedDates.startDate || !selectedDates.endDate || !booking) {
      throw new Error('Please select dates');
    }

    const nights = Math.ceil(
      (selectedDates.endDate.getTime() - selectedDates.startDate.getTime()) / 
      (1000 * 60 * 60 * 24)
    );

    const { data: dynamicPrice } = await supabase
      .from('dynamic_pricing')
      .select('price')
      .eq('property_id', booking.property_id)
      .eq('date', selectedDates.startDate.toISOString().split('T')[0])
      .single();

    const pricePerNight = dynamicPrice?.price || booking.properties.price;
    const totalPrice = pricePerNight * nights;

    const { error } = await supabase
      .from('bookings')
      .update({
        start_date: selectedDates.startDate.toISOString(),
        end_date: selectedDates.endDate.toISOString(),
        total_price: totalPrice,
      })
      .eq('id', id);

    if (error) throw error;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
      router.back();
    },
  });

  const cancelBooking = useMutation(async () => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) throw error;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
      router.back();
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (!booking) return <Text>Booking not found</Text>;

  const isDateSelected = selectedDates.startDate && selectedDates.endDate;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium">{booking.properties.title}</Text>
        <Text variant="bodyLarge" style={styles.location}>
          {booking.properties.location}
        </Text>

        <View style={styles.priceContainer}>
          <DynamicPriceDisplay
            propertyId={booking.property_id}
            basePrice={booking.properties.price}
            date={selectedDates.startDate || new Date(booking.start_date)}
          />
          <Text variant="bodySmall" style={styles.perNight}>per night</Text>
        </View>

        <DateRangePicker
          onChange={setSelectedDates}
          propertyId={booking.property_id}
        />

        <View style={styles.buttons}>
          {isDateSelected && (
            <Button
              mode="contained"
              onPress={() => updateBooking.mutate()}
              loading={updateBooking.isLoading}
              style={styles.button}
            >
              Update Booking
            </Button>
          )}

          <Button
            mode="outlined"
            onPress={() => setShowCancelDialog(true)}
            style={[styles.button, styles.cancelButton]}
            textColor="red"
          >
            Cancel Booking
          </Button>
        </View>
      </View>

      <Portal>
        <Dialog visible={showCancelDialog} onDismiss={() => setShowCancelDialog(false)}>
          <Dialog.Title>Cancel Booking</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowCancelDialog(false)}>No, Keep It</Button>
            <Button
              onPress={() => {
                setShowCancelDialog(false);
                cancelBooking.mutate();
              }}
              textColor="red"
            >
              Yes, Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  location: {
    color: '#666',
    marginTop: 8,
  },
  priceContainer: {
    marginVertical: 16,
  },
  perNight: {
    color: '#666',
    marginTop: 4,
  },
  buttons: {
    marginTop: 24,
    gap: 12,
  },
  button: {
    width: '100%',
  },
  cancelButton: {
    borderColor: 'red',
  },
});

export default BookingEditScreen; 