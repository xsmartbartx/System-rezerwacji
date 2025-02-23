import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { QueryClientProvider } from './providers/QueryClientProvider';
import { BackgroundJobs } from './services/BackgroundJobs';
import { theme } from './styles/theme';

export default function Layout() {
  useEffect(() => {
    BackgroundJobs.startJobs();
    return () => BackgroundJobs.stopJobs();
  }, []);

  return (
    <QueryClientProvider>
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
            name="index" 
            options={{ title: 'System Rezerwacji' }} 
          />
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
          <Stack.Screen 
            name="booking-confirmation" 
            options={{
              title: 'Booking Confirmed',
              headerLeft: () => null, // Prevent going back
            }}
          />
          <Stack.Screen 
            name="bookings" 
            options={{ title: 'My Bookings' }} 
          />
          <Stack.Screen 
            name="booking/[id]/edit" 
            options={{ title: 'Modify Booking' }} 
          />
          <Stack.Screen 
            name="booking/[id]" 
            options={{ title: 'Booking Details' }} 
          />
        </Stack>
      </PaperProvider>
    </QueryClientProvider>
  );
} 