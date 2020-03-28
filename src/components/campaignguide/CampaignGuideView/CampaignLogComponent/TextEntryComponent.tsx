
import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { upperFirst, map } from 'lodash';

import CampaignGuide from 'data/scenario/CampaignGuide';
import { EntrySection, CampaignLogEntry } from 'data/scenario/GuidedCampaignLog';
import typography from 'styles/typography';

interface Props {
  text: string;
  crossedOut?: boolean;
}

export default function TextEntryComponent({ text, crossedOut }: Props) {
  return (
    <Text style={[
      typography.mediumGameFont,
      styles.text,
      crossedOut ? styles.crossedOut : {},
    ]}>
      { upperFirst(text) }
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
