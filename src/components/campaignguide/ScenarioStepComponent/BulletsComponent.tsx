import React from 'react';
import {
  View,
} from 'react-native';
import { map } from 'lodash';

import SetupStepWrapper from '../SetupStepWrapper';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';

interface Props {
  bullets: { text: string }[] | undefined;
  normalBulletType?: boolean;
}

export default function BulletsComponent({ bullets, normalBulletType }: Props) {
  if (!bullets) {
    return null;
  }
  return (
    <View>
      { map(bullets, (bullet, idx) => (
        <SetupStepWrapper
          key={idx}
          bulletType={normalBulletType ? undefined : 'small'}
        >
          <CampaignGuideTextComponent text={bullet.text} />
        </SetupStepWrapper>
      )) }
    </View>
  );
}
