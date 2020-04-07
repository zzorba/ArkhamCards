import React from 'react';
import {
  Text,
} from 'react-native';

import SetupStepWrapper from '../SetupStepWrapper';
import BulletsComponent from './BulletsComponent';
import { RuleReminderStep } from 'data/scenario/types';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import typography from 'styles/typography';
import { COLORS } from 'styles/colors';

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
