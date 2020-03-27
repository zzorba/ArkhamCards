import React from 'react';
import { Text } from 'react-native';

import BulletsComponent from './BulletsComponent';
import SetupStepWrapper from '../SetupStepWrapper';
import { GenericStep } from 'data/scenario/types';
import CardTextComponent from 'components/card/CardTextComponent';
import typography from 'styles/typography';

interface Props {
  step: GenericStep;
}

export default class GenericStepComponent extends React.Component<Props> {
  render() {
    const { step } = this.props;
    if (!step.title && !step.text && !step.bullets) {
      return null;
    }
    return (
      <SetupStepWrapper bulletType={step.title ? 'none' : step.bullet_type}>
        { !!step.title && (
          <Text style={[typography.bigGameFont, { color: '#2E5344' }]}>
            { step.title }
          </Text>
        ) }
        { !!step.text && (
          <CardTextComponent text={step.text} />
        ) }
        <BulletsComponent bullets={step.bullets} />
      </SetupStepWrapper>
    );
  }
}
