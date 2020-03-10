import React from 'react';
import {
  Button,
  Text,
} from 'react-native';
import { map } from 'lodash';
import { t } from 'ttag';

import InputCounter from './InputCounter';
import SetupStepWrapper from '../SetupStepWrapper';
import { InputStep } from 'data/scenario/types';
import CardTextComponent from 'components/card/CardTextComponent';
import typography from 'styles/typography';

interface Props {
  step: InputStep;
}

export default class InputStepComponent extends React.Component<Props> {

  _yes = () => {

  };

  _proceed = () => {

  };

  _countChange = (count: number) => {

  };

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
        if (step.input.choices.length === 1) {
          return (
            <>
              <CardTextComponent
                text={step.input.choices[0].text}
              />
              <Button title="Yes" onPress={this._yes} />
              <Button title="No" onPress={this._proceed} />
            </>
          );
        }
        return (
          <>
            <CardTextComponent text={t`The investigators must decide (choose one):`} />
            { map(step.input.choices, (choice, idx) => (
              <CardTextComponent
                key={idx}
                text={`- ${choice.text}`}
              />
            )) }
          </>
        );
        return null;
      case 'choose_many':
        return <Text>Choose Many</Text>;
      case 'counter':
        return (
          <InputCounter
            input={step.input}
            onCountChange={this._countChange}
          />
        );
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
      case 'counter':
        return null;
      case 'choose_one':
      case 'card_choice':
      case 'choose_many':
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
      </SetupStepWrapper>
    );
  }
}
