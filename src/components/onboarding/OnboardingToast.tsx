import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import StyleContext from '@styles/StyleContext';
import { useShowOnboarding } from './hooks';
import space, { s } from '@styles/space';
import AppIcon from '@icons/AppIcon';

interface Props {
  onPress: () => void;
  text: string;
  hide?: boolean;
  setting: string;
  background: string;
}
export default function OnboardingToast({ onPress, hide, text, background, setting }: Props) {
  const [show, onDismiss] = useShowOnboarding(setting);
  const { width, fontScale, typography, shadow } = useContext(StyleContext);
  const height = 2 * 18 * fontScale + s * 2;
  if (!show || hide) {
    return null;
  }
  return (
    <View style={[space.paddingRightS, styles.banner, shadow.small, { backgroundColor: background, width, height: height }]} key="banner">
      <View style={[styles.banner, { flex: 1 }, space.paddingS]}>
        <TouchableOpacity onPress={onPress}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <View>
              <AppIcon size={32} color="#FFF" name="logo" />
            </View>
            <Text numberOfLines={2} style={[
              space.paddingLeftS,
              typography.small,
              typography.white,
            ]}>
              { text }
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onDismiss}>
        <View style={space.paddingXs}>
          <AppIcon size={18} color="#FFF" name="dismiss" />
        </View>
      </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
