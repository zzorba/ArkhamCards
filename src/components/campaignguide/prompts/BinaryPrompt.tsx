import React from 'react';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import SetupStepWrapper from '../SetupStepWrapper';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import { DisplayChoice } from '@data/scenario';
import { BulletType } from '@data/scenario/types';
import BinaryResult from '../BinaryResult';

interface Props {
  id: string;
  bulletType?: BulletType;
  text?: string;
  trueResult?: DisplayChoice;
  falseResult?: DisplayChoice;
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
                { !!text && <CampaignGuideTextComponent text={text} /> }
              </SetupStepWrapper>
              <BasicButton title={t`Yes`} onPress={this._yes} />
              <BasicButton title={t`No`} onPress={this._no} />
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
