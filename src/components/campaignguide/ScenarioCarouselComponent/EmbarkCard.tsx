import React, { useContext, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { t } from 'ttag';

import StyleContext from '@styles/StyleContext';
import DeckButton from '@components/deck/controls/DeckButton';
import AppIcon from '@icons/AppIcon';
import space, { m } from '@styles/space';
import { MapLocation } from '@data/scenario/types';
import LanguageContext from '@lib/i18n/LanguageContext';
import { RUSSIAN_LOCATIONS } from '@components/campaign/constants';

interface Props {
  currentLocation?: MapLocation;
  onPress: () => void;
  last?: boolean;
}

function russianDeparture(location: MapLocation) {
  const genitiveCityName = RUSSIAN_LOCATIONS[location.id]?.genitive;
  const currentLocation = { name: genitiveCityName || location.name };
  return t`Depart from ${currentLocation.name}`;
}

export default function EmbarkCard({ onPress, last, currentLocation }: Props) {
  const { colors, shadow, typography } = useContext(StyleContext);
  const { lang } = useContext(LanguageContext);
  const light = colors.D10;
  const color = colors.D30;
  const background = colors.L10;
  const departText = useMemo(() => {
    if (lang !== 'ru' || !currentLocation) {
      return currentLocation ? t`Depart from ${currentLocation.name}` : t`Depart`;
    }
    return russianDeparture(currentLocation);
  }, [currentLocation, lang]);
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
        { departText }
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
