import React from 'react';
import {
  Button,
  Text,
} from 'react-native';
import { t } from 'ttag';

import EffectsComponent from '../EffectsComponent';
import SetupStepWrapper from '../SetupStepWrapper';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import CardTextComponent from 'components/card/CardTextComponent';
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
    scenarioState: ScenarioStateHelper
  ) {
    const { id, trueResult, falseResult } = this.props;
    const decision = scenarioState.decision(id);
    if (decision == undefined) {
      return null;
    }
    if (decision) {
      return !!trueResult && this.renderResult(trueResult);
    }
    return !!falseResult && this.renderResult(falseResult);
  }

  renderResult(choice: Option | Choice) {
    const { id } = this.props;
    return (
      <EffectsComponent
        id={id}
        effects={choice.effects || undefined}
      />
    );
  }

  render() {
    const { id, bulletType } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState }: ScenarioGuideContextType) => (
          <>
            <SetupStepWrapper bulletType={bulletType}>
              { this.renderPrompt(scenarioState) }
              { this.renderCorrectResults(scenarioState) }
            </SetupStepWrapper>
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
