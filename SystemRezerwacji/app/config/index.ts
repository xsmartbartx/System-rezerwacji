import { Platform } from 'react-native';

export const config = {
  // API Configuration
  api: {
    timeout: 15000, // 15 seconds
    retries: 3,
  },
  
  // Image Configuration
  images: {
    thumbnailQuality: Platform.OS === 'ios' ? 0.7 : 0.5,
    maxWidth: 1200,
    maxHeight: 1200,
  },
  
  // Grid Configuration
  grid: {
    spacing: 8,
    columns: 2,
  },
  
  // Animation Configuration
  animation: {
    duration: 300,
  },
};

export default config; 