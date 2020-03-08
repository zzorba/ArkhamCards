import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import BulletsComponent from './BulletsComponent';
import SetupStepWrapper from './SetupStepWrapper';
import { GenericStep } from 'data/scenario/types';
import CardTextComponent from 'components/card/CardTextComponent';
import typography from 'styles/typography';

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
      </SetupStepWrapper>
    );
  }
}

const styles = StyleSheet.create({
  step: {
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
  },
})
