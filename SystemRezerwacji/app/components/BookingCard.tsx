import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { formatPrice } from '../utils';

interface BookingCardProps {
  booking: {
    id: string;
    start_date: string;
    end_date: string;
    total_price: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    properties: {
      title: string;
      location: string;
      images: { url: string }[];
    };
  };
}

const BookingCard = ({ booking }: BookingCardProps) => {
  const startDate = new Date(booking.start_date);
  const endDate = new Date(booking.end_date);
  const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: booking.properties.images[0]?.url }} />
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Text variant="titleMedium" numberOfLines={1}>
            {booking.properties.title}
          </Text>
          <Chip
            mode="flat"
            selectedColor={getStatusColor(booking.status)}
            style={styles.statusChip}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Chip>
        </View>

        <Text variant="bodyMedium" style={styles.location}>
          {booking.properties.location}
        </Text>

        <View style={styles.details}>
          <Text variant="bodyMedium">
            {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
          </Text>
          <Text variant="bodySmall" style={styles.nights}>
            {nights} {nights === 1 ? 'night' : 'nights'}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text variant="titleMedium">Total</Text>
          <Text variant="titleMedium">
            {formatPrice(booking.total_price)}
          </Text>
        </View>
      </Card.Content>

      <Card.Actions style={styles.actions}>
        <Button
          mode="outlined"
          onPress={() => router.push(`/booking/${booking.id}`)}
        >
          View Details
        </Button>
        {booking.status === 'pending' && (
          <Button
            mode="contained"
            onPress={() => router.push(`/booking/${booking.id}/edit`)}
          >
            Modify
          </Button>
        )}
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  content: {
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusChip: {
    height: 24,
  },
  location: {
    color: '#666',
    marginBottom: 12,
  },
  details: {
    marginBottom: 12,
  },
  nights: {
    color: '#666',
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    justifyContent: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default BookingCard; 