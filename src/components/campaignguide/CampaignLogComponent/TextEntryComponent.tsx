import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { upperFirst } from 'lodash';

import { CampaignLogEntry } from '@data/scenario/GuidedCampaignLog';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  text: string;
  crossedOut?: boolean;
  entry: CampaignLogEntry;
  decoration?: 'circle';
}

export default function TextEntryComponent({ text, crossedOut, entry }: Props) {
  const { typography } = useContext(StyleContext);
  const actualText = entry.type === 'count' ?
    text.replace('#X#', `${entry.count}`) :
    text;
  return (
    <View>
      <Text style={[
        typography.large,
        space.marginBottomS,
        crossedOut ? typography.strike : {},
      ]}>
        { upperFirst(actualText) }
      </Text>
    </View>
  );
}
