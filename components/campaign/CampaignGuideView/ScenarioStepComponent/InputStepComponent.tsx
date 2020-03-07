import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import BulletsComponent from './BulletsComponent';
import SetupStepWrapper from './SetupStepWrapper';
import { InputStep } from '../../../../data/scenario/types';
import CardTextComponent from '../../../card/CardTextComponent';
import typography from '../../../../styles/typography';

interface Props {
  step: InputStep;
}

export default class InputStepComponent extends React.Component<Props> {
  render() {
    const { step } = this.props;
    return (
      <SetupStepWrapper>
        <Text>Input:</Text>
        { !!step.text && (
          <CardTextComponent text={step.text} />
        ) }
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
