import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation } from '../hooks/useQuery';
import { supabase } from '../lib/supabase';
import { queryClient } from '../providers/QueryClientProvider';
import DateRangePicker from '../components/DateRangePicker';
import DynamicPriceDisplay from '../components/DynamicPriceDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Listing } from '../types';

const BookingScreen = () => {
  const { id } = useLocalSearchParams();
  const [selectedDates, setSelectedDates] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  const { data: listing, isLoading } = useQuery<Listing>(['listing', id], async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  });

  const createBooking = useMutation(async () => {
    if (!selectedDates.startDate || !selectedDates.endDate || !listing) {
      throw new Error('Please select dates');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const nights = Math.ceil(
      (selectedDates.endDate.getTime() - selectedDates.startDate.getTime()) / 
      (1000 * 60 * 60 * 24)
    );

    const { data: dynamicPrice } = await supabase
      .from('dynamic_pricing')
      .select('price')
      .eq('property_id', id)
      .eq('date', selectedDates.startDate.toISOString().split('T')[0])
      .single();

    const pricePerNight = dynamicPrice?.price || listing.price;
    const totalPrice = pricePerNight * nights;

    const { error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        property_id: id,
        start_date: selectedDates.startDate.toISOString(),
        end_date: selectedDates.endDate.toISOString(),
        total_price: totalPrice,
        status: 'pending',
      });

    if (error) throw error;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
      router.push('/booking-confirmation');
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (!listing) return <Text>Listing not found</Text>;

  const isDateSelected = selectedDates.startDate && selectedDates.endDate;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium">{listing.title}</Text>
        <Text variant="bodyLarge" style={styles.location}>
          {listing.location}
        </Text>

        <View style={styles.priceContainer}>
          <DynamicPriceDisplay
            propertyId={listing.id}
            basePrice={listing.price}
            date={selectedDates.startDate || new Date()}
          />
          <Text variant="bodySmall" style={styles.perNight}>per night</Text>
        </View>

        <DateRangePicker
          onChange={setSelectedDates}
          propertyId={listing.id}
        />

        {isDateSelected && (
          <Button
            mode="contained"
            onPress={() => createBooking.mutate()}
            loading={createBooking.isLoading}
            style={styles.bookButton}
          >
            Confirm Booking
          </Button>
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
  bookButton: {
    marginTop: 24,
  },
});

export default BookingScreen; 