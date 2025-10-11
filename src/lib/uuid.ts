import uuid from 'react-native-uuid';

/**
 * Generate a UUID v4 string.
 * Wraps react-native-uuid to ensure the return type is always string.
 */
export function generateUuid(): string {
  return uuid.v4() as string;
}
