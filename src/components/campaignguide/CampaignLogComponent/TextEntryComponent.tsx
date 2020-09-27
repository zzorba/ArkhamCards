import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { upperFirst } from 'lodash';

import AppIcon from '@icons/AppIcon';
import { CampaignLogEntry } from '@data/scenario/GuidedCampaignLog';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  text: string;
  crossedOut?: boolean;
  entry: CampaignLogEntry;
  decoration?: 'circle';
}

export default function TextEntryComponent({ text, crossedOut, entry, decoration }: Props) {
  const { colors,  typography } = useContext(StyleContext);
  const actualText = entry.type === 'count' ?
    text.replace('#X#', `${entry.count}`) :
    text;
  return (
    <View style={styles.wrapper}>
      <Text style={[
        typography.large,
        space.marginBottomS,
        crossedOut ? typography.strike : undefined,
        decoration === 'circle' ? typography.underline  : undefined,
        decoration === 'circle' ? typography.bold : undefined,
      ]}>
        { upperFirst(actualText) }
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
