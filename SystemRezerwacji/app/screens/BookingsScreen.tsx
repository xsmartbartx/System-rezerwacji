import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, SegmentedButtons } from 'react-native-paper';
import { useQuery } from '../hooks/useQuery';
import { supabase } from '../lib/supabase';
import BookingCard from '../components/BookingCard';
import LoadingSpinner from '../components/LoadingSpinner';

type BookingStatus = 'all' | 'upcoming' | 'past' | 'cancelled';

const BookingsScreen = () => {
  const [filter, setFilter] = useState<BookingStatus>('upcoming');

  const { data: bookings, isLoading } = useQuery(['bookings', filter], async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const today = new Date().toISOString();
    let query = supabase
      .from('bookings')
      .select(`
        *,
        properties (
          title,
          location,
          images (url)
        )
      `)
      .eq('user_id', user.id);

    switch (filter) {
      case 'upcoming':
        query = query.gte('start_date', today).not('status', 'eq', 'cancelled');
        break;
      case 'past':
        query = query.lt('end_date', today).not('status', 'eq', 'cancelled');
        break;
      case 'cancelled':
        query = query.eq('status', 'cancelled');
        break;
    }

    const { data, error } = await query.order('start_date', { ascending: true });
    if (error) throw error;
    return data;
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={filter}
        onValueChange={value => setFilter(value as BookingStatus)}
        buttons={[
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'past', label: 'Past' },
          { value: 'cancelled', label: 'Cancelled' },
        ]}
        style={styles.filter}
      />

      <ScrollView style={styles.content}>
        {!bookings?.length ? (
          <View style={styles.empty}>
            <Text variant="bodyLarge">No bookings found</Text>
          </View>
        ) : (
          bookings.map(booking => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filter: {
    margin: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
});

export default BookingsScreen; 