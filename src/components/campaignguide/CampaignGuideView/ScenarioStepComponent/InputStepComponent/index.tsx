import React from 'react';
import {
  Button,
  Text,
} from 'react-native';
import { map } from 'lodash';
import { t } from 'ttag';

import BinaryPrompt from '../BinaryPrompt';
import InputCounter from './InputCounter';
import SetupStepWrapper from '../SetupStepWrapper';
import ScenarioStateHelper from '../../ScenarioStateHelper';
import { InputStep } from 'data/scenario/types';
import CampaignGuide from 'data/scenario/CampaignGuide';
import ScenarioGuide from 'data/scenario/ScenarioGuide';
import CardTextComponent from 'components/card/CardTextComponent';
import typography from 'styles/typography';

interface Props {
  step: InputStep;
  scenarioState: ScenarioStateHelper;
  guide: CampaignGuide,
  scenario: ScenarioGuide;
}

export default class InputStepComponent extends React.Component<Props> {

  _yes = () => {

  };

  _no = () => {

  };

  _countChange = (count: number) => {

  };


  renderDecision() {
    const { step, scenarioState } = this.props;
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
              <Text>
                { scenarioState.decision(step.id) ? t`Yes` : t`No` }
              </Text>
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

  renderPrompt() {
    const { step, scenarioState } = this.props;
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
              <Button title="Yes4" onPress={this._yes} />
              <Button title="No4" onPress={this._no} />
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
    const { step, scenarioState, guide, scenario } = this.props;
    if (step.input.type === 'choose_one' &&
      step.input.choices.length === 1) {
      return (
        <BinaryPrompt
          id={step.id}
          text={step.input.choices[0].text}
          trueResult={step.input.choices[0]}
          guide={guide}
          scenario={scenario}
          scenarioState={scenarioState}
        />
      );
    }
    return (
      <SetupStepWrapper>
        { scenarioState.hasDecision(step.id) ?
          this.renderDecision() :
          this.renderPrompt() }
        { !!step.text && (
          <CardTextComponent text={step.text} />
        ) }
      </SetupStepWrapper>
    );
  }
}
