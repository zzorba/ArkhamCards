
import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { upperFirst, map } from 'lodash';

import { CampaignLogEntry } from 'data/scenario/GuidedCampaignLog';
import typography from 'styles/typography';

interface Props {
  text: string;
  crossedOut?: boolean;
  entry: CampaignLogEntry;
}

export default function TextEntryComponent({ text, crossedOut, entry }: Props) {
  const actualText = entry.type === 'count' ?
    text.replace('#X#', `${entry.count}`) :
    text;
  return (
    <Text style={[
      typography.mediumGameFont,
      styles.text,
      crossedOut ? styles.crossedOut : {},
    ]}>
      { upperFirst(actualText) }
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    marginBottom: 8,
  },
  crossedOut: {
    textDecorationLine: 'line-through',
  },
});
