import React from 'react';
import {
  Button,
} from 'react-native';
import { t } from 'ttag';

import SetupStepWrapper from '../SetupStepWrapper';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import CardTextComponent from 'components/card/CardTextComponent';
import { BulletType, Choice, Option } from 'data/scenario/types';
import BinaryResult from '../BinaryResult';

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

  render() {
    const { id, text, bulletType } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState }: ScenarioGuideContextType) => {
          const decision = scenarioState.decision(id);
          return decision === undefined ? (
            <>
              <SetupStepWrapper bulletType={bulletType}>
                { !!text && <CardTextComponent text={text} /> }
              </SetupStepWrapper>
              <Button title={t`Yes`} onPress={this._yes} />
              <Button title={t`No`} onPress={this._no} />
            </>
          ) : (
            <BinaryResult
              bulletType={bulletType}
              prompt={text}
              result={decision}
            />
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}
