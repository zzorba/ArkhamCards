import React from 'react';

import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import { CheckCampaignLogCountEffect } from '@data/scenario/types'
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';

interface Props {
  effect: CheckCampaignLogCountEffect;
  numberInput?: number[];
}

export default function CheckCampaignLogCountComponent({ effect, numberInput }: Props) {
  const count = numberInput?.length ? numberInput[0] : 0;
  return (
    <SetupStepWrapper bulletType={effect.bullet_type}>
      <CampaignGuideTextComponent text={effect.text.replace('#X#', `${count}`)} />
    </SetupStepWrapper>
  );
}