import React from 'react';

import BulletsComponent from './BulletsComponent';
import SetupStepWrapper from '../SetupStepWrapper';
import { GenericStep } from '@data/scenario/types';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';

interface Props {
  step: GenericStep;
}

export default class GenericStepComponent extends React.Component<Props> {
  render() {
    const { step } = this.props;
    if (!step.title && !step.text && !step.bullets) {
      return null;
    }
    if (step.hidden) {
      return null;
    }
    return (
      <>
        <SetupStepWrapper bulletType={step.title ? 'none' : step.bullet_type}>
          { !!step.text && (
            <CampaignGuideTextComponent text={step.text} />
          ) }
        </SetupStepWrapper>
        <BulletsComponent bullets={step.bullets} />
      </>
    );
  }
}
