import space, { m } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import ArkhamLoadingSpinner from './ArkhamLoadingSpinner';

export default function LoadingSpinner({ large, inline, message }: { large?: boolean; inline?: boolean; message?: string }) {
  const { backgroundStyle, colors, typography } = useContext(StyleContext);
  const spinner = large ? <ArkhamLoadingSpinner autoPlay loop large /> : <ActivityIndicator size="small" color={colors.lightText} animating />;
  if (inline) {
    return (
      <View style={styles.inline}>
        { spinner }
      </View>
    );
  }
  return (
    <View style={[styles.loading, backgroundStyle]}>
      { !!message && <Text style={[typography.text, typography.light, space.marginBottomS]}>{message}</Text> }
      { spinner }
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  inline: {
    padding: m,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
