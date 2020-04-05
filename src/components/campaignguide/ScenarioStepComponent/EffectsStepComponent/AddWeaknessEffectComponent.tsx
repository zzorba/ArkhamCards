import React from 'react';
import { Text } from 'react-native';
import { map } from 'lodash';
import { t } from 'ttag';

import Card from 'data/Card';
import { BASIC_WEAKNESS_QUERY } from 'data/query';
import BinaryPrompt from 'components/campaignguide/prompts/BinaryPrompt';
import { AddWeaknessEffect } from 'data/scenario/types';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import SetupStepWrapper from 'components/campaignguide/SetupStepWrapper';
import ScenarioStepContext, { ScenarioStepContextType } from '../../ScenarioStepContext';
import CardQueryWrapper from 'components/campaignguide/CardQueryWrapper';
import InvestigatorSelectorWrapper from 'components/campaignguide/InvestigatorSelectorWrapper';
import CampaignGuideTextComponent from 'components/campaignguide/CampaignGuideTextComponent';
import { safeValue } from 'lib/filters';

interface Props {
  id: string;
  effect: AddWeaknessEffect;
}

export default class AddWeaknessEffectComponent extends React.Component<Props> {
  firstDecisionId() {
    return `${this.props.id}_use_app`;
  }

  _renderInvestigators = (
    investigators: Card[],
    card: Card
  ) => {
    return map(investigators, (investigator, idx) => (
      <SetupStepWrapper bulletType="small" key={idx}>
        <CampaignGuideTextComponent
          text={`${investigator.name} earns ${card.name}`}
        />
      </SetupStepWrapper>
    ));
  };

  renderFirstPrompt() {
    const { id } = this.props;
    return (
      <BinaryPrompt
        id={this.firstDecisionId()}
        text={t`Do you want to use the app to randomize weaknesses?`}
      />
    );
  }

  renderSecondPrompt(scenarioState: ScenarioStateHelper) {
    const { id, effect } = this.props;
    const useAppDecision = scenarioState.decision(this.firstDecisionId());
    if (useAppDecision === undefined) {
      return null;
    }
    if (useAppDecision) {
      // randomize it;
      return <Text>Randomize weaknesses</Text>;
    }

    const traitPart = map(effect.weakness_traits,
      trait => `(traits_normalized CONTAINS[c] "${safeValue(trait)}")`
    ).join(' OR ');
    const query = `(${BASIC_WEAKNESS_QUERY} AND (${traitPart}))`;
    return (
      <CardQueryWrapper
        query={query}
        render={this._renderInvestigatorChoice}
        extraArg={undefined}
      />
    );
  }

  render() {
    return (
      <ScenarioStepContext.Consumer>
        { ({ scenarioState }: ScenarioStepContextType) => (
          <>
            { this.renderFirstPrompt() }
            { this.renderSecondPrompt(scenarioState) }
          </>
        ) }
      </ScenarioStepContext.Consumer>
    );
  }
}
