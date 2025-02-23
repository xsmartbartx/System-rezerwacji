import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Text, Button } from 'react-native-paper';
import { supabase } from '../lib/supabase';
import ImageGallery from '../components/ImageGallery';
import PropertyInfo from '../components/PropertyInfo';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatPrice } from '../utils';
import type { Listing } from '../types';

const ListingScreen = () => {
  const { id } = useLocalSearchParams();

  const { data: listing, error, isLoading } = useQuery<Listing>(['listing', id], async () => {
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

  if (error || !listing) {
    return (
      <View style={styles.container}>
        <Text>Error loading listing</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ImageGallery images={listing.images} />
      <View style={styles.content}>
        <PropertyInfo listing={listing} />
        <Button 
          mode="contained" 
          style={styles.bookButton}
          onPress={() => router.push(`/booking/${id}`)}
        >
          Book for {formatPrice(listing.price)}/night
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
  bookButton: {
    marginTop: 16,
  },
});

export default ListingScreen; 