import React, { useContext, useMemo } from 'react';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { t } from 'ttag';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import NavButton from '@components/core/NavButton';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { usePressCallback } from '@components/core/hooks';

interface Props {
  title: string;
  status: 'placeholder' | 'locked' | 'completed' | 'started' | 'playable' | 'played' | 'skipped';
  onPress: () => void;
}

export default function CampaignScenarioButton({ onPress, status, title }: Props) {
  const { fontScale, colors, typography } = useContext(StyleContext);
  const debouncedOnPress = usePressCallback(onPress);
  const icon = useMemo(() => {
    const iconSize = 24 * fontScale;
    switch (status) {
      case 'placeholder':
      case 'locked':
        return (
          <MaterialCommunityIcons
            name="lock"
            size={iconSize}
            color={colors.lightText}
          />
        );
      case 'completed':
        return (
          <MaterialCommunityIcons
            name="checkbox-marked"
            size={iconSize}
            color={colors.navButton}
          />
        );
      case 'started':
        return (
          <MaterialCommunityIcons
            name="checkbox-intermediate"
            size={iconSize}
            color={colors.navButton}
          />
        );
      case 'playable':
        return (
          <MaterialCommunityIcons
            name="checkbox-blank-outline"
            size={iconSize}
            color={colors.navButton}
          />
        );
      case 'skipped':
        return (
          <MaterialCommunityIcons
            name="close-box-outline"
            size={iconSize}
            color={colors.navButton}
          />
        );
    }
  }, [status, colors, fontScale]);

  const content = useMemo(() => {
    switch (status) {
      case 'locked':
        return (
          <Text style={[typography.gameFont, typography.light]} numberOfLines={2}>
            { title }
          </Text>
        );
      case 'placeholder':
        return (
          <>
            <Text style={[typography.gameFont, typography.light]} numberOfLines={2}>
              { title }
            </Text>
            <Text style={[typography.small, typography.light]} numberOfLines={1}>
              { t`Coming soon` }
            </Text>
          </>
        );
      case 'completed':
        return (
          <Text style={typography.gameFont} numberOfLines={2}>
            { title }
          </Text>
        );
      case 'started':
      case 'playable':
        return (
          <Text style={[typography.gameFont, styles.playable]} numberOfLines={2}>
            { title }
          </Text>
        );
      case 'skipped':
        return (
          <Text style={[typography.gameFont, styles.skipped]} numberOfLines={2}>
            { title }
          </Text>
        );
    }
  }, [status, typography, title]);

  return (
    <NavButton
      onPress={debouncedOnPress}
      disabled={(status === 'locked' || status === 'skipped' || status === 'placeholder')}
    >
      <View style={styles.wrapper}>
        <View style={[space.marginLeftS, space.marginRightM]}>
          { icon }
        </View>
        <View style={styles.flex}>
          { content }
        </View>
      </View>
    </NavButton>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  wrapper: {
    paddingTop: s,
    paddingBottom: s,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  skipped: {
    textDecorationLine: 'line-through',
  },
  playable: {
    textDecorationLine: 'underline',
  },
});
