import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useQuery } from '../hooks/useQuery';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../utils';

interface PriceAnalyticsProps {
  propertyId: string;
  basePrice: number;
}

const PriceAnalytics = ({ propertyId, basePrice }: PriceAnalyticsProps) => {
  const { data: analytics } = useQuery(['priceAnalytics', propertyId], async () => {
    const { data: prices } = await supabase
      .from('dynamic_pricing')
      .select('price')
      .eq('property_id', propertyId);

    if (!prices?.length) return null;

    const priceValues = prices.map(p => p.price);
    return {
      min: Math.min(...priceValues),
      max: Math.max(...priceValues),
      avg: priceValues.reduce((a, b) => a + b, 0) / priceValues.length,
    };
  });

  if (!analytics) return null;

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>Price Analysis</Text>
      <View style={styles.cards}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="labelMedium">Lowest Price</Text>
            <Text variant="titleLarge">{formatPrice(analytics.min)}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="labelMedium">Average Price</Text>
            <Text variant="titleLarge">{formatPrice(analytics.avg)}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="labelMedium">Highest Price</Text>
            <Text variant="titleLarge">{formatPrice(analytics.max)}</Text>
          </Card.Content>
        </Card>
      </View>
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
  cards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default PriceAnalytics; 