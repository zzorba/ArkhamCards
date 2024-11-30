import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { upperFirst } from 'lodash';

import { CampaignLogEntry } from '@data/scenario/GuidedCampaignLog';
import space, { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';
import { ArkhamSlimIcon } from '@icons/ArkhamIcon';
import TextWithIcons from '@components/core/TextWithIcons';

interface Props {
  text: string;
  icon?: string;
  crossedOut?: boolean;
  entry: CampaignLogEntry;
  decoration?: 'circle';
  button?: React.ReactNode;
  first?: boolean;
  last?: boolean;
  noWrapper?: boolean;
}

export default function TextEntryComponent({ text, icon, crossedOut, entry, decoration, button, first, last, noWrapper }: Props) {
  const { colors, typography, fontScale } = useContext(StyleContext);
  const actualText = entry.type === 'count' ?
    text.replace('#X#', `${entry.count}`) :
    text;
  return (
    <View style={icon ? [
      { backgroundColor: colors.L20 },
      noWrapper ? undefined : space.paddingSideS,
      first ? { borderTopLeftRadius: 4, borderTopRightRadius: 4, marginTop: xs } : undefined,
      last ? { borderBottomLeftRadius: 4, borderBottomRightRadius: 4, marginBottom: s } : undefined,
    ] : undefined}>
      <View style={[
        noWrapper ? undefined : styles.wrapper, 
        space.paddingTopS, space.paddingBottomS, !last && icon ? { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.L10 } : undefined
      ]}>
        { !!icon && <View style={space.paddingRightS}><AppIcon name={icon} size={36} color={colors.M} /></View> }
        { actualText.startsWith('[') && actualText.endsWith(']') ? (
          <ArkhamSlimIcon name={actualText.substring(1, actualText.length - 1)} color={colors.D30} size={36} />
        ) : (
          <Text style={[
            icon ? typography.menuText : typography.large,
            icon ? undefined : noWrapper ? undefined : space.marginBottomS,
            icon ? { color: colors.D20 } : undefined,
            crossedOut ? typography.strike : undefined,
            decoration === 'circle' ? typography.underline : undefined,
            decoration === 'circle' ? typography.bold : undefined,
            { flex: 1 },
          ]}>
            <TextWithIcons text={upperFirst(actualText)} size={16 * fontScale} color={colors.darkText} />
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
  noWrapper: {
    alignItems: 'center',
  },
});
