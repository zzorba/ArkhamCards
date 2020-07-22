import React from 'react';
import { Text } from 'react-native';
import { upperFirst } from 'lodash';

import { CampaignLogEntry } from '@data/scenario/GuidedCampaignLog';
import typography from '@styles/typography';
import space from '@styles/space';

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
      typography.bigLabel,
      space.marginBottomS,
      crossedOut ? typography.strike : {},
    ]}>
      { upperFirst(actualText) }
    </Text>
  );
}
