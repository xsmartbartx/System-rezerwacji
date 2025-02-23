import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useQuery } from '../hooks/useQuery';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../utils';

interface DynamicPriceDisplayProps {
  propertyId: string;
  basePrice: number;
  date: Date;
}

const DynamicPriceDisplay = ({ propertyId, basePrice, date }: DynamicPriceDisplayProps) => {
  const { data: dynamicPrice, isLoading } = useQuery(
    ['dynamicPrice', propertyId, date.toISOString()],
    async () => {
      const { data } = await supabase
        .from('dynamic_pricing')
        .select('price')
        .eq('property_id', propertyId)
        .eq('date', date.toISOString().split('T')[0])
        .single();

      return data?.price;
    }
  );

  if (isLoading || !dynamicPrice) {
    return <Text>{formatPrice(basePrice)}</Text>;
  }

  const priceChange = ((dynamicPrice - basePrice) / basePrice) * 100;
  const isDiscount = priceChange < 0;

  return (
    <View style={styles.container}>
      <Text variant="titleLarge">{formatPrice(dynamicPrice)}</Text>
      {basePrice !== dynamicPrice && (
        <View style={styles.priceChange}>
          <Text
            variant="bodySmall"
            style={[
              styles.changeText,
              { color: isDiscount ? '#4CAF50' : '#F44336' },
            ]}
          >
            {isDiscount ? '↓' : '↑'} {Math.abs(priceChange).toFixed(0)}%
          </Text>
          <Text variant="bodySmall" style={styles.basePrice}>
            from {formatPrice(basePrice)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  priceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  changeText: {
    marginRight: 4,
  },
  basePrice: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
});

export default DynamicPriceDisplay; 