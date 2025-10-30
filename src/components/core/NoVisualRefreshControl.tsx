import StyleContext from '@styles/StyleContext';
import React, { useContext } from 'react';
import { RefreshControl, RefreshControlProps, Platform, StyleSheet } from 'react-native';

/**
 * A RefreshControl that provides pull-to-refresh functionality
 * but renders no visual feedback (no spinner).
 * Used when you have custom loading indicators.
 */
export default function NoVisualRefreshControl(props: Pick<RefreshControlProps, 'progressViewOffset' | 'onRefresh' | 'refreshing'>) {
  const { colors } = useContext(StyleContext);
  return (
    <RefreshControl
      {...props}
      // iOS uses tintColor
      tintColor="transparent"
      // Android uses colors array
      colors={[colors.D20]}
      progressBackgroundColor={Platform.OS === 'android' ? colors.L20 : 'transparent'}
      // Try to hide it completely
      style={styles.hidden}
    />
  );
}

const styles = StyleSheet.create({
  hidden: {
    backgroundColor: 'transparent',
    height: 0,
    overflow: 'hidden',
  },
});
