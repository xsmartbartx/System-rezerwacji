import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { useQuery } from '../hooks/useQuery';
import { supabase } from '../lib/supabase';
import { theme } from '../styles/theme';
import LoadingSpinner from './LoadingSpinner';

interface PriceChartProps {
  propertyId: string;
  days?: number;
}

const PriceChart = ({ propertyId, days = 30 }: PriceChartProps) => {
  const { data: prices, isLoading } = useQuery(['priceHistory', propertyId], async () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('dynamic_pricing')
      .select('date, price')
      .eq('property_id', propertyId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  });

  if (isLoading) return <LoadingSpinner />;
  if (!prices?.length) return null;

  const labels = prices.map(p => {
    const date = new Date(p.date);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });

  const priceData = prices.map(p => p.price);

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>Price Trends</Text>
      <LineChart
        data={{
          labels,
          datasets: [{
            data: priceData,
          }],
        }}
        width={Dimensions.get('window').width - 32}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => theme.colors.primary,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default PriceChart; 