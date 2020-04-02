import React from 'react';
import {
  View,
} from 'react-native';
import { map } from 'lodash';

import CampaignGuideTextComponent from '../CampaignGuideTextComponent';

interface Props {
  bullets: { text: string }[] | undefined;
}

export default function BulletsComponent({ bullets }: Props) {
  if (!bullets) {
    return null;
  }
  return (
    <View>
      { map(bullets, (bullet, idx) => (
        <CampaignGuideTextComponent key={idx} text={`- ${bullet.text}`} />
      )) }
    </View>
  );
}
