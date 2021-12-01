import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { upperFirst } from 'lodash';

import { CampaignLogEntry } from '@data/scenario/GuidedCampaignLog';
import space, { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';
import ArkhamIcon from '@icons/ArkhamIcon';

interface Props {
  text: string;
  icon?: string;
  crossedOut?: boolean;
  entry: CampaignLogEntry;
  decoration?: 'circle';
  button?: React.ReactNode;
  first?: boolean;
  last?: boolean;
}

export default function TextEntryComponent({ text, icon, crossedOut, entry, decoration, button, first, last }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const actualText = entry.type === 'count' ?
    text.replace('#X#', `${entry.count}`) :
    text;
  return (
    <View style={icon ? [
      { backgroundColor: colors.L20 },
      space.paddingSideS,
      first ? { borderTopLeftRadius: 4, borderTopRightRadius: 4, marginTop: xs } : undefined,
      last ? { borderBottomLeftRadius: 4, borderBottomRightRadius: 4, marginBottom: s } : undefined,
    ] : undefined}>
      <View style={[styles.wrapper, space.paddingTopS, space.paddingBottomS, !last && icon ? { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.L10 } : undefined]}>
        { !!icon && <View style={space.paddingRightS}><AppIcon name={icon} size={36} color={colors.M} /></View> }
        { actualText.startsWith('[') && actualText.endsWith(']') ? (
          <ArkhamIcon name={actualText.substr(1, actualText.length - 2)} color={colors.D30} size={36} />
        ) : (
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
        ) }
        { !!button && button}
      </View>
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
});
