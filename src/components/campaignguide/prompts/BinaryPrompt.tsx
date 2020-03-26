import React from 'react';
import {
  Button,
  Text,
} from 'react-native';
import { t } from 'ttag';

import EffectsComponent from '../EffectsComponent';
import SetupStepWrapper from '../SetupStepWrapper';
import ResolutionComponent from '../ResolutionComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import CardTextComponent from 'components/card/CardTextComponent';
import ScenarioGuide from 'data/scenario/ScenarioGuide';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import { BulletType, Choice, Option } from 'data/scenario/types';

interface Props {
  id: string;
  bulletType?: BulletType;
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
    const decision = scenarioState.decision(id)
    return (
      <>
        { !!text && <CardTextComponent text={text} /> }
        { (decision !== undefined) && (
          <Text>
            { decision ? t`Yes` : t`No` }
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
    const decision = scenarioState.decision(id);
    if (decision == undefined) {
      return null;
    }
    if (decision) {
      return !!trueResult && this.renderResult(scenarioGuide, stepsOnly, trueResult);
    }
    return !!falseResult && this.renderResult(scenarioGuide, stepsOnly, falseResult);
  }

  renderResult(
    scenarioGuide: ScenarioGuide,
    stepsOnly: boolean,
    choice: Option | Choice
  ) {
    const { id } = this.props;
    if (choice.steps) {
      return null;
    }
    if (choice.effects) {
      return stepsOnly ? null : (
        <EffectsComponent
          id={id}
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
    const { id, bulletType } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioGuide, scenarioState }: ScenarioGuideContextType) => (
          <>
            <SetupStepWrapper bulletType={bulletType}>
              { this.renderPrompt(scenarioState) }
              { this.renderCorrectResults(scenarioGuide, scenarioState, false) }
            </SetupStepWrapper>
            { this.renderCorrectResults(scenarioGuide, scenarioState, true) }
            { (scenarioState.decision(id) === undefined) && (
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
