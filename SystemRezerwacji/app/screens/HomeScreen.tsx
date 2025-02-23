import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useQuery } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Text } from 'react-native-paper';
import ImageGrid from '../components/ImageGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const HomeScreen = () => {
  // Fetch listings from Supabase
  const { data: listings, error, isLoading } = useQuery(
    ['listings'],
    async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          price,
          images (
            url
          )
        `)
        .limit(10);

      if (error) throw error;
      return data;
    }
  );

  if (isLoading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error loading listings</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ImageGrid listings={listings} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default HomeScreen; 