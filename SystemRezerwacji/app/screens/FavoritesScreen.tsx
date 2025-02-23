import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useQuery } from '../hooks/useQuery';
import { supabase } from '../lib/supabase';
import PropertyCard from '../components/PropertyCard';
import LoadingSpinner from '../components/LoadingSpinner';

const FavoritesScreen = () => {
  const { data: favorites, isLoading } = useQuery(['favorites'], async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        property_id,
        properties (
          id,
          title,
          location,
          price,
          images (url)
        )
      `)
      .eq('user_id', user.id);

    if (error) throw error;
    return data;
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {!favorites?.length ? (
          <View style={styles.empty}>
            <Text variant="bodyLarge">No favorites yet</Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              Properties you favorite will appear here
            </Text>
          </View>
        ) : (
          favorites.map(favorite => (
            <PropertyCard
              key={favorite.property_id}
              property={favorite.properties}
            />
          ))
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
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptySubtext: {
    color: '#666',
    marginTop: 8,
  },
});

export default FavoritesScreen; 