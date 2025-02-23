import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useQuery, useMutation } from '../hooks/useQuery';
import { supabase } from '../lib/supabase';
import { queryClient } from '../providers/QueryClientProvider';

interface FavoriteButtonProps {
  propertyId: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const FavoriteButton = ({ propertyId, size = 24, style }: FavoriteButtonProps) => {
  const { data: isFavorite, isLoading } = useQuery(['favorite', propertyId], async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', propertyId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  });

  const toggleFavorite = useMutation(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId);
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, property_id: propertyId });
    }
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['favorite', propertyId]);
      queryClient.invalidateQueries(['favorites']);
    },
  });

  if (isLoading) return null;

  return (
    <IconButton
      icon={isFavorite ? 'heart' : 'heart-outline'}
      size={size}
      onPress={() => toggleFavorite.mutate()}
      style={[styles.button, style]}
      iconColor={isFavorite ? '#F44336' : undefined}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 0,
  },
});

export default FavoriteButton; 