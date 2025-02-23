import React from 'react';
import { View, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';

interface Listing {
  id: string;
  title: string;
  price: number;
  images: { url: string }[];
}

interface ImageGridProps {
  listings: Listing[];
}

const ImageGrid = ({ listings }: ImageGridProps) => {
  const handlePress = (id: string) => {
    router.push(`/listing/${id}`);
  };

  return (
    <View style={styles.grid}>
      {listings.map((listing) => (
        <Pressable 
          key={listing.id} 
          style={styles.item}
          onPress={() => handlePress(listing.id)}
        >
          <Image
            source={{ uri: listing.images[0]?.url }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.details}>
            <Text variant="titleMedium" numberOfLines={1}>
              {listing.title}
            </Text>
            <Text variant="labelLarge">
              ${listing.price} / night
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const { width } = Dimensions.get('window');
const itemWidth = (width - 24) / 2; // 2 columns with 24px total padding

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 8,
  },
  item: {
    width: itemWidth,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: itemWidth,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  details: {
    padding: 8,
  },
});

export default ImageGrid; 