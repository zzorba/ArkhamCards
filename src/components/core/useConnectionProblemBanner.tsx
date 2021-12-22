import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { NetInfoStateType } from '@react-native-community/netinfo';
import { t } from 'ttag';

import useNetworkStatus from '@components/core/useNetworkStatus';
import StyleContext from '@styles/StyleContext';
import space, { s } from '@styles/space';
import COLORS from '@styles/colors';
import AppIcon from '@icons/AppIcon';

interface Props {
  width: number;
  arkhamdbState?: {
    error: string | undefined;
    reLogin: () => void;
  };
}

export default function useConnectionProblemBanner({ width, arkhamdbState }: Props): [React.ReactNode | null, number] {
  const { fontScale, colors, typography } = useContext(StyleContext);
  const [{ networkType, isConnected }] = useNetworkStatus();
  if (!arkhamdbState?.error && networkType !== NetInfoStateType.none) {
    return [null, 0];
  }
  if (!isConnected || networkType === NetInfoStateType.none) {
    const height = 2 * 18 * fontScale + s * 2;
    return [(
      <View style={[space.paddingS, styles.warning, { width, height }]} key="banner">
        <AppIcon size={32} color={colors.D30} name="warning" />
        <Text style={[space.paddingLeftS, typography.small, typography.black, { flex: 1 }]} numberOfLines={2}>
          { t`Unable to update: you appear to be offline.` }
        </Text>
      </View>
    ), height];
  }
  if (arkhamdbState) {
    const { error, reLogin } = arkhamdbState;
    const height = 4 * 18 * fontScale + s * 2;
    if (error === 'badAccessToken') {
      return [(
        <TouchableOpacity onPress={reLogin} style={[space.paddingS, styles.error, { width, height }]} key="banner">
          <AppIcon size={32} color="#FFFFFF" name="warning" />
          <Text style={[typography.small, typography.white, space.paddingS, { flex: 1 }]} numberOfLines={4}>
            { t`We're having trouble updating your decks at this time. If the problem persists tap here to reauthorize.` }
          </Text>
        </TouchableOpacity>
      ), 0];
    }
    return [(
      <TouchableOpacity onPress={reLogin} style={[space.paddingS, styles.error, { width, height }]} key="banner">
        <AppIcon size={32} color="#FFFFFF" name="warning" />
        <Text style={[typography.small, typography.white, space.paddingS, { flex: 1 }]} numberOfLines={4}>
          { t`An unexpected error occurred (${error}). If restarting the app doesn't fix the problem, tap here to reauthorize.` }
        </Text>
      </TouchableOpacity>
    ), 0];
  }
  return [null, 0];
}

const styles = StyleSheet.create({
  error: {
    backgroundColor: COLORS.red,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  warning: {
    backgroundColor: COLORS.yellow,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
