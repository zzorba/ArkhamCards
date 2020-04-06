import React from 'react';
import { Text } from 'react-native';
import { map, sortBy } from 'lodash';
import { t } from 'ttag';

import Card from 'data/Card';
import { BASIC_WEAKNESS_QUERY } from 'data/query';
import InvestigatorChoicePrompt from 'components/campaignguide/prompts/InvestigatorChoicePrompt';
import InvestigatorSelectorWrapper from 'components/campaignguide/InvestigatorSelectorWrapper';
import BinaryPrompt from 'components/campaignguide/prompts/BinaryPrompt';
import { AddWeaknessEffect } from 'data/scenario/types';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import SetupStepWrapper from 'components/campaignguide/SetupStepWrapper';
import ScenarioStepContext, { ScenarioStepContextType } from '../../ScenarioStepContext';
import CardQueryWrapper from 'components/campaignguide/CardQueryWrapper';
import CampaignGuideTextComponent from 'components/campaignguide/CampaignGuideTextComponent';
import { safeValue } from 'lib/filters';

interface Props {
  id: string;
  effect: AddWeaknessEffect;
  input?: string[];
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

  _renderCardChoice = (cards: Card[], investigators: Card[]) => {
    const { id } = this.props;
    return (
      <InvestigatorChoicePrompt
        bulletType="none"
        investigators={investigators}
        id={`${id}_weakness`}
        options={{
          type: 'universal',
          choices: map(
            sortBy(cards, card => card.name),
            card => {
              return {
                id: card.code,
                code: card.code,
                text: card.name,
              };
            }
          ),
        }}
      />
    );
  };

  _renderSecondPrompt = (
    investigators: Card[],
    scenarioState: ScenarioStateHelper
  ) => {
    const { effect } = this.props;
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
        render={this._renderCardChoice}
        extraArg={investigators}
      />
    );
  }

  render() {
    const { id, effect, input } = this.props;
    return (
      <ScenarioStepContext.Consumer>
        { ({ scenarioState }: ScenarioStepContextType) => (
          <>
            { this.renderFirstPrompt() }
            <InvestigatorSelectorWrapper
              id={id}
              investigator={effect.investigator}
              input={input}
              render={this._renderSecondPrompt}
              extraArg={scenarioState}
            />
          </>
        ) }
      </ScenarioStepContext.Consumer>
    );
  }
}
