import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { t } from 'ttag';

import StyleContext from '@styles/StyleContext';
import DeckButton from '@components/deck/controls/DeckButton';
import AppIcon from '@icons/AppIcon';
import space, { m } from '@styles/space';
import { MapLocation } from '@data/scenario/types';

interface Props {
  currentLocation?: MapLocation;
  onPress: () => void;
  isActive: boolean;
  last?: boolean;
}

export default function EmbarkCard({ onPress, last, currentLocation }: Props) {
  const { colors, shadow, typography } = useContext(StyleContext);
  const light = colors.D10;
  const color = colors.D30;
  const background = colors.L10;
  return (
    <View style={[
      space.paddingTopM,
      space.paddingLeftM,
      space.paddingRightM,
      space.marginBottomM,
      styles.card,
      { backgroundColor: background },
      shadow.large,
      last ? space.marginRightM : undefined,
    ]}>
      <View style={styles.icon}>
        <AppIcon size={80} color={colors.M} name="map" />
      </View>
      <Text style={[typography.small, typography.italic, { color: light }]}>
        { t`Embark` }
      </Text>
      <Text style={[typography.mediumGameFont, { color: color, marginRight: 80 }, space.marginBottomS]} numberOfLines={2}>
        { currentLocation ? t`Depart from ${currentLocation.name}` : t`Depart` }
      </Text>
      <View style={[styles.button, space.paddingBottomM]}>
        <DeckButton
          icon="right-arrow"
          title={t`Choose destination`}
          onPress={onPress}
          color="light_gray"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    top: m,
    right: m,
  },
  button: {
    marginRight: 80 + m,
  },
});
