import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { NetInfoStateType } from '@react-native-community/netinfo';
import { t } from 'ttag';

import useNetworkStatus from '@components/core/useNetworkStatus';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import COLORS from '@styles/colors';

interface Props {
  width: number;
  arkhamdbState?: {
    error: string | undefined;
    reLogin: () => void;
  };
}

export default function ConnectionProblemBanner({ width, arkhamdbState }: Props) {
  const { typography } = useContext(StyleContext);
  const [{ networkType, isConnected }] = useNetworkStatus();
  if (!arkhamdbState?.error && networkType !== NetInfoStateType.none) {
    return null;
  }
  if (!isConnected || networkType === NetInfoStateType.none) {
    return (
      <View style={[space.paddingS, styles.warning, { width }]}>
        <Text style={[typography.small, typography.black]}>
          { t`Unable to update: you appear to be offline.` }
        </Text>
      </View>
    );
  }
  if (arkhamdbState) {
    const { error, reLogin } = arkhamdbState;
    if (error === 'badAccessToken') {
      return (
        <TouchableOpacity onPress={reLogin} style={[space.paddingS, styles.error, { width }]}>
          <Text style={[typography.small, typography.white, space.paddingS]}>
            { t`We're having trouble updating your decks at this time. If the problem persists tap here to reauthorize.` }
          </Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={reLogin} style={[space.paddingS, styles.error, { width }]}>
        <Text style={[typography.small, typography.white, space.paddingS]}>
          { t`An unexpected error occurred (${error}). If restarting the app doesn't fix the problem, tap here to reauthorize.` }
        </Text>
      </TouchableOpacity>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  error: {
    backgroundColor: COLORS.red,
  },
  warning: {
    backgroundColor: COLORS.yellow,
  },
});
