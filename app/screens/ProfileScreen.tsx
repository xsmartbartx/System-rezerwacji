import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Avatar, List } from 'react-native-paper';
import { router } from 'expo-router';
import { useQuery } from '../hooks/useQuery';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfileScreen = () => {
  const { data: profile, isLoading } = useQuery(['profile'], async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/auth');
  };

  if (isLoading) return <LoadingSpinner />;
  if (!profile) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Image
          size={80}
          source={profile.avatar_url ? { uri: profile.avatar_url } : require('../assets/default-avatar.png')}
        />
        <Text variant="headlineSmall" style={styles.name}>
          {profile.full_name || 'User'}
        </Text>
        <Text variant="bodyLarge" style={styles.email}>
          {profile.email}
        </Text>
      </View>

      <List.Section>
        <List.Item
          title="My Bookings"
          left={props => <List.Icon {...props} icon="calendar" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => router.push('/bookings')}
        />
        <List.Item
          title="Favorites"
          left={props => <List.Icon {...props} icon="heart" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => router.push('/favorites')}
        />
        <List.Item
          title="Edit Profile"
          left={props => <List.Icon {...props} icon="account-edit" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => router.push('/edit-profile')}
        />
        <List.Item
          title="Settings"
          left={props => <List.Icon {...props} icon="cog" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => router.push('/settings')}
        />
      </List.Section>

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={signOut}
          textColor="red"
          style={styles.signOutButton}
        >
          Sign Out
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
  header: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: {
    marginTop: 16,
  },
  email: {
    color: '#666',
    marginTop: 4,
  },
  footer: {
    padding: 16,
  },
  signOutButton: {
    borderColor: 'red',
  },
});

export default ProfileScreen; 