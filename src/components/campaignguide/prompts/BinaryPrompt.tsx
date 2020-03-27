import React from 'react';
import {
  Button,
  Text,
} from 'react-native';
import { t } from 'ttag';

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

  render() {
    const { id, bulletType } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState }: ScenarioGuideContextType) => (
          <>
            <SetupStepWrapper bulletType={bulletType}>
              { this.renderPrompt(scenarioState) }
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
