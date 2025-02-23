import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { router } from 'expo-router';
import { formatPrice } from '../utils';
import FavoriteButton from './FavoriteButton';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    location: string;
    price: number;
    images: { url: string }[];
  };
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Card 
      style={styles.card}
      onPress={() => router.push(`/listing/${property.id}`)}
    >
      <Card.Cover source={{ uri: property.images[0]?.url }} />
      <Card.Content style={styles.content}>
        <Text variant="titleMedium" numberOfLines={1}>
          {property.title}
        </Text>
        <Text variant="bodyMedium" style={styles.location}>
          {property.location}
        </Text>
        <Text variant="titleMedium">
          {formatPrice(property.price)}
          <Text variant="bodySmall" style={styles.perNight}> per night</Text>
        </Text>
      </Card.Content>
      <FavoriteButton
        propertyId={property.id}
        style={styles.favoriteButton}
        size={24}
      />
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
  location: {
    color: '#666',
    marginVertical: 8,
  },
  perNight: {
    color: '#666',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
  },
});

export default PropertyCard; 