import React from 'react';

import SetupStepWrapper from '../SetupStepWrapper';
import BulletsComponent from './BulletsComponent';
import { RuleReminderStep } from '@data/scenario/types';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';

interface Props {
  step: RuleReminderStep;
}

export default class GenericStepComponent extends React.Component<Props> {
  render() {
    const { step } = this.props;
    return (
      <>
        <SetupStepWrapper bulletType="none">
          <CampaignGuideTextComponent text={step.text} />
        </SetupStepWrapper>
        <BulletsComponent bullets={step.bullets} normalBulletType />
        { !!step.example && (
          <SetupStepWrapper bulletType="none">
            <CampaignGuideTextComponent text={step.example} />
          </SetupStepWrapper>
        ) }
      </>
    );
  }
}
