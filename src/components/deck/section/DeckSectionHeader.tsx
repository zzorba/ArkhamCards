import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Ripple from '@lib/react-native-material-ripple';
import StyleContext from '@styles/StyleContext';
import { FactionCodeType } from '@app_constants';
import AppIcon from '@icons/AppIcon';
import { usePressCallback } from '@components/core/hooks';
import space from '@styles/space';

interface Props {
  title: string;
  faction: FactionCodeType;
  onPress?: () => void;
}

export default function DeckSectionHeader({ title, faction, onPress }: Props) {
  const { colors, fontScale, typography } = useContext(StyleContext);
  const throttleOnPress = usePressCallback(onPress);
  if (throttleOnPress) {
    return (
      <Ripple
        onPress={throttleOnPress}
        style={[styles.header, { backgroundColor: colors.faction[faction].background }]}
        rippleColor={colors.faction[faction].text}
      >
        <View style={space.paddingTopXs}>
          <Text style={[typography.header, typography.white]}>
            { title }
          </Text>
        </View>
        <View style={[styles.icon, { height: 40, width: 40 }]}>
          <AppIcon name="edit" size={28 * fontScale} color="#FFF" />
        </View>
      </Ripple>
    );
  }
  return (
    <View style={[styles.header, { backgroundColor: colors.faction[faction].background }]}>
      <View style={space.paddingTopXs}>
        <Text style={[typography.header, typography.white]}>
          { title }
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderTopWidth: 0,
    minHeight: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
