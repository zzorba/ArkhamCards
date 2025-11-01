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
  if (Platform.OS === 'ios') {
    return (
      <RefreshControl
        {...props}
        tintColor="transparent"
        style={styles.hidden}
      />
    );
  }
  return (
    <RefreshControl
      {...props}
      colors={[colors.L20]}
      progressBackgroundColor={colors.D20}
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
