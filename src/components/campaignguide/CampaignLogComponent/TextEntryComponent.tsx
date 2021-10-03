import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { upperFirst } from 'lodash';

import { CampaignLogEntry } from '@data/scenario/GuidedCampaignLog';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';

interface Props {
  text: string;
  icon?: string;
  crossedOut?: boolean;
  entry: CampaignLogEntry;
  decoration?: 'circle';
  button?: React.ReactNode;
}

export default function TextEntryComponent({ text, icon, crossedOut, entry, decoration, button }: Props) {
  const { colors, typography, shadow } = useContext(StyleContext);
  const actualText = entry.type === 'count' ?
    text.replace('#X#', `${entry.count}`) :
    text;
  return (
    <View style={icon ? [
      styles.wrapper,
      { backgroundColor: colors.L20 },
      styles.iconWrapper,
      shadow.small,
    ] : styles.wrapper}>
      { !!icon && <View style={space.paddingRightS}><AppIcon name={icon} size={36} color={colors.M} /></View> }
      <Text style={[
        icon ? typography.menuText : typography.large,
        icon ? undefined : space.marginBottomS,
        icon ? { color: colors.D20 } : undefined,
        crossedOut ? typography.strike : undefined,
        decoration === 'circle' ? typography.underline : undefined,
        decoration === 'circle' ? typography.bold : undefined,
        { flex: 1 },
      ]}>
        { upperFirst(actualText) }
      </Text>
      { !!button && button}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  iconWrapper: {
    borderRadius: 4,
    marginBottom: s,
    padding: s,
  },
});
