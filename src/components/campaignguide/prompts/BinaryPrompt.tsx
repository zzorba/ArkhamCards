import React from 'react';
import {
  Button,
  Text,
} from 'react-native';
import { t } from 'ttag';

import EffectsComponent from '../EffectsComponent';
import SetupStepWrapper from '../SetupStepWrapper';
import StepsComponent from '../StepsComponent';
import ResolutionComponent from '../ResolutionComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import CardTextComponent from 'components/card/CardTextComponent';
import ScenarioGuide from 'data/scenario/ScenarioGuide';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import { Choice, Option } from 'data/scenario/types';

interface Props {
  id: string;
  text?: string;
  trueResult?: Choice | Option;
  falseResult?: Choice | Option;
}

export default class BinaryPrompt extends React.Component<Props> {
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;

  _yes = () => {
    const {
      id,
    } = this.props;
    this.context.scenarioState.setDecision(id, true);
  };

  _no = () => {
    const {
      id,
    } = this.props;
    this.context.scenarioState.setDecision(id, false);
  };

  renderPrompt(scenarioState: ScenarioStateHelper) {
    const { id, text } = this.props;
    return (
      <>
        { !!text && <CardTextComponent text={text} /> }
        { scenarioState.hasDecision(id) && (
          <Text>
            { scenarioState.decision(id) ? t`Yes` : t`No` }
          </Text>
        ) }
      </>
    );
  }


  renderCorrectResults(
    scenarioGuide: ScenarioGuide,
    scenarioState: ScenarioStateHelper,
    stepsOnly: boolean
  ) {
    const { id, trueResult, falseResult } = this.props;
    if (!scenarioState.hasDecision(id)) {
      return null;
    }
    if (scenarioState.decision(id)) {
      return !!trueResult && this.renderResult(scenarioGuide, stepsOnly, trueResult);
    }
    return !!falseResult && this.renderResult(scenarioGuide, stepsOnly, falseResult);
  }

  renderResult(
    scenarioGuide: ScenarioGuide,
    stepsOnly: boolean,
    choice: Option | Choice
  ) {
    if (choice.steps) {
      return stepsOnly ? (
        <StepsComponent
          steps={choice.steps}
        />
      ) : null;
    }
    if (choice.effects) {
      return stepsOnly ? null : (
        <EffectsComponent
          effects={choice.effects}
        />
      );
    }
    if (choice.resolution) {
      if (!stepsOnly) {
        return null;
      }
      const nextResolution = scenarioGuide.resolution(choice.resolution);
      if (nextResolution) {
        return (
          <ResolutionComponent
            resolution={nextResolution}
            secondary
          />
        );
      }
      return stepsOnly ? null : (
        <Text>Resolution { choice.resolution }</Text>
      );
    }
    return <Text>Unknown!</Text>;
  }

  render() {
    const { id } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioGuide, scenarioState }: ScenarioGuideContextType) => (
          <>
            <SetupStepWrapper>
              { this.renderPrompt(scenarioState) }
              { this.renderCorrectResults(scenarioGuide, scenarioState, false) }
            </SetupStepWrapper>
            { this.renderCorrectResults(scenarioGuide, scenarioState, true) }
            { !scenarioState.hasDecision(id) && (
              <>
                <Button title="Yes" onPress={this._yes} />
                <Button title="No" onPress={this._no} />
              </>
            ) }
          </>
        ) }
      </ScenarioGuideContext.Consumer>
    );
  }
}
