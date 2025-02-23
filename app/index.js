import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { Stack } from 'expo-router';
import { theme } from '../styles/theme';

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="profile" 
            options={{ title: 'My Profile' }} 
          />
          <Stack.Screen 
            name="favorites" 
            options={{ title: 'My Favorites' }} 
          />
          <Stack.Screen 
            name="edit-profile" 
            options={{ title: 'Edit Profile' }} 
          />
          <Stack.Screen 
            name="settings" 
            options={{ title: 'Settings' }} 
          />
        </Stack>
      </PaperProvider>
    </QueryClientProvider>
  );
} 