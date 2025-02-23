import { Dimensions } from 'react-native';
import config from '../config';

export const getGridItemWidth = () => {
  const { width } = Dimensions.get('window');
  const { spacing, columns } = config.grid;
  return (width - (spacing * (columns + 1))) / columns;
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const getImageThumbnail = (url: string) => {
  // Add any image optimization logic here
  return url;
}; 