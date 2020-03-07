import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import BulletsComponent from './BulletsComponent';
import SetupStepWrapper from './SetupStepWrapper';
import { RuleReminderStep } from '../../../../data/scenario/types';
import CardTextComponent from '../../../card/CardTextComponent';
import typography from '../../../../styles/typography';

interface Props {
  step: RuleReminderStep;
}

export default class GenericStepComponent extends React.Component<Props> {
  render() {
    const { step } = this.props;
    return (
      <SetupStepWrapper noBullet>
        { !!step.title && (
          <Text style={[typography.bigGameFont, { color: '#2E5344' }]}>
            { step.title }
          </Text>
        ) }
        <CardTextComponent text={step.text.replace(/\n/g, '\n\n')} />
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
