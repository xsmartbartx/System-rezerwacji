import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Listing } from '../types';
import { formatPrice } from '../utils';

interface PropertyInfoProps {
  listing: Listing;
}

const PropertyInfo = ({ listing }: PropertyInfoProps) => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">{listing.title}</Text>
      <Text variant="titleMedium" style={styles.price}>
        {formatPrice(listing.price)} / night
      </Text>
      
      <Divider style={styles.divider} />
      
      <View style={styles.location}>
        <MaterialCommunityIcons name="map-marker" size={24} color="#666" />
        <Text variant="bodyLarge" style={styles.locationText}>
          {listing.location}
        </Text>
      </View>
      
      <Divider style={styles.divider} />
      
      <Text variant="bodyMedium" style={styles.description}>
        {listing.description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  price: {
    marginTop: 8,
    color: '#666',
  },
  divider: {
    marginVertical: 16,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 8,
    color: '#666',
  },
  description: {
    lineHeight: 24,
  },
});

export default PropertyInfo; 