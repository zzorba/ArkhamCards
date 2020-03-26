import React from 'react';
import {
  Text,
} from 'react-native';

import CardTextComponent from 'components/card/CardTextComponent';
import SetupStepWrapper from '../SetupStepWrapper';
import CardChoicePrompt from '../prompts/CardChoicePrompt';
import ChooseInvestigatorPrompt from '../prompts/ChooseInvestigatorPrompt';
import InvestigatorCounterComponent from '../prompts/InvestigatorCounterComponent';
import ChooseOnePrompt from '../prompts/ChooseOnePrompt';
import BinaryPrompt from '../prompts/BinaryPrompt';
import NumberPrompt from '../prompts/NumberPrompt';
import SuppliesPrompt from '../prompts/SuppliesPrompt';
import InvestigatorChoicePrompt from '../prompts/InvestigatorChoicePrompt';
import { InputStep } from 'data/scenario/types';
import typography from 'styles/typography';

interface Props {
  step: InputStep;
}

export default class InputStepComponent extends React.Component<Props> {
  renderPrompt() {
    const { step } = this.props;
    switch (step.input.type) {
      case 'choose_one':
        if (step.input.choices.length === 1) {
          return (
            <BinaryPrompt
              id={step.id}
              bulletType={step.bullet_type}
              text={step.input.choices[0].text}
              trueResult={step.input.choices[0]}
            />
          );
        }
        return (
          <ChooseOnePrompt
            id={step.id}
            bulletType={step.bullet_type}
            text={step.text}
            input={step.input}
          />
        );
      case 'counter':
        return (
          <NumberPrompt
            id={step.id}
            bulletType={step.bullet_type}
            prompt={step.input.text}
            effects={step.input.effects}
            text={step.text}
          />
        );
      case 'choose_many':
        return <Text>Choose Many</Text>;
      case 'investigator_counter':
        return (
          <>
            <SetupStepWrapper bulletType={step.bullet_type}>
              { !!step.text && <CardTextComponent text={step.text} /> }
            </SetupStepWrapper>
            <InvestigatorCounterComponent
              id={step.id}
            />
          </>
        );
      case 'supplies':
        return (
          <SuppliesPrompt
            id={step.id}
            bulletType={step.bullet_type}
            text={step.text}
            input={step.input}
          />
        );
      case 'card_choice':
        return (
          <CardChoicePrompt
            id={step.id}
            text={step.text}
            input={step.input}
          />
        );
      case 'use_supplies':
        return <Text>Use Supplies</Text>;
      case 'investigator_choice':
        if (step.input.investigator === 'any') {
          return (
            <ChooseInvestigatorPrompt
              id={step.id}
              title={step.input.choices[0].text}
              required
            />
          );
        }
        return (
          <InvestigatorChoicePrompt
            id={step.id}
            text={step.text}
            bulletType={step.bullet_type}
            choices={step.input.choices}
            detailed={step.input.detailed}
            optional={step.input.investigator === 'choice'}
          />
        );
    }
  }

  render() {
    const { step } = this.props;
    return (
      <>
        { !!step.title && (
          <Text style={[typography.bigGameFont, typography.center]}>
            { step.title }
          </Text>
        ) }
        { this.renderPrompt() }
      </>
    );
  }
}
