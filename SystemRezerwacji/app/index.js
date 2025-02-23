import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { PaperProvider } from 'react-native-paper';
import { Stack } from 'expo-router';
import NotificationService from './services/NotificationService';
import { theme } from './theme';

const queryClient = new QueryClient();

export default function Layout() {
  React.useEffect(() => {
    NotificationService.initialize();
  }, []);

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
            name="index" 
            options={{ title: 'System Rezerwacji' }} 
          />
          <Stack.Screen 
            name="listing/[id]" 
            options={{ title: 'Property Details' }} 
          />
          <Stack.Screen 
            name="booking/[id]" 
            options={{ title: 'Book Your Stay' }} 
          />
          <Stack.Screen 
            name="booking-confirmation" 
            options={{ 
              title: 'Booking Confirmed',
              headerLeft: () => null, // Prevent going back
            }} 
          />
        </Stack>
      </PaperProvider>
    </QueryClientProvider>
  );
} 