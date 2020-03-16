import React from 'react';

import BulletsComponent from './BulletsComponent';
import EffectsComponent from '../EffectsComponent';
import SetupStepWrapper from '../SetupStepWrapper';
import { GenericStep } from 'data/scenario/types';
import CardTextComponent from 'components/card/CardTextComponent';

interface Props {
  step: GenericStep;
}

export default class GenericStepComponent extends React.Component<Props> {
  render() {
    const { step } = this.props;
    return (
      <SetupStepWrapper>
        { !!step.text && (
          <CardTextComponent text={step.text} />
        ) }
        <BulletsComponent bullets={step.bullets} />
        <EffectsComponent effects={step.effects} />
      </SetupStepWrapper>
    );
  }
}
