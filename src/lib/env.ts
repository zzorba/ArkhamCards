import Config from 'react-native-config';
import Constants from 'expo-constants';

/**
 * Get environment variable with fallback to expo-constants
 * react-native-config doesn't work properly with Expo builds on Android
 */
export function getEnvVar(key: string): string {
  const fromConfig = Config[key];
  if (fromConfig) {
    return fromConfig;
  }
  // Fallback to expo-constants extra
  return Constants.expoConfig?.extra?.[key] || process.env[key] || '';
}
