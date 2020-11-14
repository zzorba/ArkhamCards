import React, { useContext, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Ripple from '@lib/react-native-material-ripple';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { FactionCodeType } from '@app_constants';
import AppIcon from '@icons/AppIcon';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props {
  title: string;
  faction: FactionCodeType;
  onPress?: () => void;
}

export default function DeckSectionHeader({ title, faction, onPress }: Props) {
  const { colors, fontScale, typography } = useContext(StyleContext);
  if (onPress) {
    return (
      <Ripple
        onPress={onPress}
        style={[space.marginTopS, styles.header, { backgroundColor: colors.faction[faction].darkBackground }]}
        rippleColor={colors.faction[faction].text}
      >
        <Text style={[typography.header, typography.white]}>
          { title }
        </Text>
        <View style={[styles.icon, { height: 40, width: 40 }]}>
          <AppIcon name="edit" size={18 * fontScale} color="#FFF" />
        </View>
      </Ripple>
    );
  }
  return (
    <View style={[space.marginTopS, styles.header, { backgroundColor: colors.faction[faction].background }]}>
      <Text style={[typography.header, typography.white]}>
        { title }
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
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
