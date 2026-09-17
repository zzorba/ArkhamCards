import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// This mimics the providerWrapper from the original screens.tsx
export function createScreenWrapper<Props extends Record<string, unknown>>(
  ScreenComponent: React.ComponentType<Props>
) {
  return (props: Props) => (
    <GestureHandlerRootView>
      <ScreenComponent {...props} />
    </GestureHandlerRootView>
  );
}
