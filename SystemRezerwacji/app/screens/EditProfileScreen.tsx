import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Avatar } from 'react-native-paper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';
import type { User } from '../types';

const EditProfileScreen = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const { data: user, isLoading } = useQuery<User>(['user'], async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
      
    setName(profile.name);
    setEmail(profile.email);
    return profile;
  });

  const updateProfile = useMutation({
    mutationFn: async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('users')
        .update({
          name,
          email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentUser.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
      router.back();
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Avatar.Image 
          size={120} 
          source={{ uri: user?.profile_picture }} 
          style={styles.avatar}
        />
        
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Button 
          mode="contained" 
          onPress={() => updateProfile.mutate()}
          loading={updateProfile.isLoading}
          style={styles.button}
        >
          Save Changes
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
  avatar: {
    alignSelf: 'center',
    marginVertical: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default EditProfileScreen; 