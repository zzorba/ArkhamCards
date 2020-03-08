import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { map } from 'lodash';
import { t } from 'ttag';

import BulletsComponent from '../BulletsComponent';
import SetupStepWrapper from '../SetupStepWrapper';
import { InputStep } from '../../../../../data/scenario/types';
import CardTextComponent from '../../../../card/CardTextComponent';
import typography from '../../../../../styles/typography';

interface Props {
  step: InputStep;
}

export default class InputStepComponent extends React.Component<Props> {
  renderPrompt() {
    const { step } = this.props;
    switch (step.input.type) {
      case 'card_choice': {
        return (
          <Text style={typography.text}>
            Card Choice
          </Text>
        );
      }
      case 'choose_one':
        return (
          <Text style={typography.text}>
            {t`The investigators must decide (choose one):`}
          </Text>
        );
      case 'choose_many':
        return <Text>Choose Many</Text>;
      case 'counter':
        return <Text>Counter</Text>;
      case 'investigator_counter':
        return <Text>Investigator Counter</Text>;
      case 'supplies':
        return <Text>Supplies</Text>;
      case 'use_supplies':
        return <Text>Use Supplies</Text>;
      case 'investigator_choice':
        return <Text>Choose an investigator</Text>;
    }
  }

  renderChoices() {
    const { step } = this.props;
    switch (step.input.type) {
      case 'choose_one':
        return map(step.input.choices, (choice, idx) => (
          <CardTextComponent
            key={idx}
            text={`- ${choice.text}`}
          />
        ));
      case 'card_choice':
      case 'choose_many':
      case 'counter':
      case 'investigator_counter':
      case 'supplies':
      case 'use_supplies':
      case 'investigator_choice':
      default:
        return <Text>Choices for {step.input.type}</Text>;
    }
  }

  render() {
    const { step } = this.props;
    return (
      <SetupStepWrapper>
        { this.renderPrompt() }
        { !!step.text && (
          <CardTextComponent text={step.text} />
        ) }
        { this.renderChoices() }
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
