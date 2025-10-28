import React from 'react';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

// This mimics the providerWrapper from the original screens.tsx
export function createScreenWrapper<Props extends Record<string, unknown>>(
  ScreenComponent: React.ComponentType<Props>
) {
  return gestureHandlerRootHOC((props: Props) => (
    <ScreenComponent {...props} />
  ));
}