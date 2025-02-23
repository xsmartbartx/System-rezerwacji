import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '../hooks/useQuery';
import { supabase } from '../lib/supabase';
import ImageGallery from '../components/ImageGallery';
import DynamicPriceDisplay from '../components/DynamicPriceDisplay';
import FavoriteButton from '../components/FavoriteButton';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Listing } from '../types';
import PriceChart from '../components/PriceChart';
import PriceAnalytics from '../components/PriceAnalytics';

const ListingScreen = () => {
  const { id } = useLocalSearchParams();
  const today = new Date();

  const { data: listing, isLoading } = useQuery<Listing>(['listing', id], async () => {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        images (
          id,
          url
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  });

  if (isLoading) return <LoadingSpinner />;
  if (!listing) return <Text>Listing not found</Text>;

  return (
    <ScrollView style={styles.container}>
      <ImageGallery images={listing.images} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="headlineMedium">{listing.title}</Text>
          <FavoriteButton propertyId={listing.id} size={32} />
        </View>

        <Text variant="bodyLarge" style={styles.location}>
          {listing.location}
        </Text>

        <View style={styles.priceContainer}>
          <DynamicPriceDisplay
            propertyId={listing.id}
            basePrice={listing.price}
            date={today}
          />
          <Text variant="bodySmall" style={styles.perNight}>per night</Text>
        </View>

        <Text style={styles.description}>{listing.description}</Text>

        <PriceChart propertyId={listing.id} />
        <PriceAnalytics propertyId={listing.id} basePrice={listing.price} />

        <Button
          mode="contained"
          onPress={() => router.push(`/booking/${id}`)}
          style={styles.bookButton}
        >
          Book Now
        </Button>
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
    alignItems: 'flex-start',
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
  description: {
    marginBottom: 24,
    lineHeight: 24,
  },
  bookButton: {
    marginTop: 8,
  },
});

export default ListingScreen; 