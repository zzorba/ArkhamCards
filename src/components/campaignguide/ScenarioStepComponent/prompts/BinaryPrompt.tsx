import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
} from 'react-native';
import { t } from 'ttag';

import EffectsComponent from '../EffectsComponent';
import SetupStepWrapper from '../SetupStepWrapper';
import ScenarioStateHelper from '../../ScenarioStateHelper';
import StepsComponent from '../../StepsComponent';
import ResolutionComponent from '../../ResolutionComponent';
import CardTextComponent from 'components/card/CardTextComponent';
import CampaignGuide from 'data/scenario/CampaignGuide';
import ScenarioGuide from 'data/scenario/ScenarioGuide';
import { Choice, Option } from 'data/scenario/types';

interface Props {
  id: string;
  text: string;
  trueResult?: Choice | Option;
  falseResult?: Choice | Option;
  guide: CampaignGuide,
  scenario: ScenarioGuide;
  scenarioState: ScenarioStateHelper;
}

export default class BinaryPrompt extends React.Component<Props> {
  _yes = () => {
    const {
      id,
      scenarioState,
    } = this.props;
    scenarioState.setDecision(id, true);
  };

  _no = () => {
    const {
      id,
      scenarioState,
    } = this.props;
    scenarioState.setDecision(id, false);
  };

  renderPrompt() {
    const { id, text, scenarioState } = this.props;
    return (
      <>
        <CardTextComponent text={text} />
        { scenarioState.hasDecision(id) && (
          <Text>
            { scenarioState.decision(id) ? t`Yes` : t`No` }
          </Text>
        ) }
      </>
    );
  }


  renderCorrectResults(stepsOnly: boolean) {
    const { id, scenarioState, trueResult, falseResult } = this.props;
    if (!scenarioState.hasDecision(id)) {
      return null;
    }
    if (scenarioState.decision(id)) {
      return !!trueResult && this.renderResult(stepsOnly, trueResult);
    }
    return !!falseResult && this.renderResult(stepsOnly, falseResult);
  }

  renderResult(stepsOnly: boolean, choice: Option | Choice) {
    const { scenario, scenarioState, guide } = this.props;
    if (choice.steps) {
      return stepsOnly ? (
        <StepsComponent
          steps={choice.steps}
          guide={guide}
          scenario={scenario}
          scenarioState={scenarioState}
        />
      ) : null;
    }
    if (choice.effects) {
      return stepsOnly ? null : (
        <EffectsComponent
          effects={choice.effects}
          guide={guide}
        />
      );
    }
    if (choice.resolution) {
      if (!stepsOnly) {
        return null;
      }
      const nextResolution = scenario.resolution(choice.resolution);
      if (nextResolution) {
        return (
          <ResolutionComponent
            resolution={nextResolution}
            guide={guide}
            scenario={scenario}
            scenarioState={scenarioState}
            secondary
          />
        );
      }
      return stepsOnly ? null : (
        <Text>Resolution {choice.resolution}</Text>
      )
    }
    return <Text>Unknown!</Text>;
  }

  render() {
    const { id, scenarioState } = this.props;
    return (
      <>
        <SetupStepWrapper>
          { this.renderPrompt() }
          { this.renderCorrectResults(false) }
        </SetupStepWrapper>
        { this.renderCorrectResults(true) }
        { !scenarioState.hasDecision(id) && (
         <>
           <Button title="Yes" onPress={this._yes} />
           <Button title="No" onPress={this._no} />
         </>
        ) }
      </>
    );
  }
}

const styles = StyleSheet.create({
  margin: {
    marginLeft: 32,
    marginRight :32,
  },
})
