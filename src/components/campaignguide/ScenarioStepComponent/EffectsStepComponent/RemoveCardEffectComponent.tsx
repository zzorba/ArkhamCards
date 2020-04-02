import React from 'react';
import { map, keys } from 'lodash';
import { t } from 'ttag';

import SetupStepWrapper from '../../SetupStepWrapper';
import SingleCardWrapper from '../../SingleCardWrapper';
import InvestigatorSelectorWrapper from '../../InvestigatorSelectorWrapper';
import InvestigatorCheckListComponent from '../../prompts/InvestigatorCheckListComponent';
import { InvestigatorDeck } from 'data/scenario';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import { RemoveCardEffect } from 'data/scenario/types';
import Card from 'data/Card';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import { hasCardConditionResult } from 'data/scenario/conditionHelper';

interface Props {
  id: string;
  effect: RemoveCardEffect;
  input?: string[];
  skipCampaignLog?: boolean;
  campaignLog: GuidedCampaignLog;
}

export default class RemoveCardEffectComponent extends React.Component<Props> {
  _renderInvestigators = (
    investigatorDecks: InvestigatorDeck[],
    card: Card
  ) => {
    return map(investigatorDecks, ({ investigator }, idx) => (
      <SetupStepWrapper bulletType="small" key={idx}>
        <CampaignGuideTextComponent
          text={`${investigator.name} earned ${card.name}`}
        />
      </SetupStepWrapper>
    ));
  };

  _renderCard = (card: Card) => {
    const { id, effect, input, campaignLog } = this.props;
    if (!effect.investigator) {
      // These are always spelled out.
      return null;
    }
    if (effect.investigator === 'choice' && input) {
      const investigatorResult = hasCardConditionResult(
        {
          type: 'has_card',
          card: card.code,
          investigator: 'each',
          options: [{
            boolCondition: true,
            effects: [],
          }],
        },
        campaignLog
      );
      return (
        <InvestigatorCheckListComponent
          id={`${id}_investigator`}
          min={input.length}
          max={input.length}
          checkText={t`Remove ${card.name} (${input.length})`}
          investigators={keys(investigatorResult.investigatorChoices)}
        />
      );
    }
    return (
      <InvestigatorSelectorWrapper
        id={id}
        investigator={effect.investigator}
        render={this._renderInvestigators}
        description={t`Who will remove ${card.name} from their deck?`}
        extraArgs={card}
      />
    );
  };

  render() {
    const { effect } = this.props;
    if (effect.card === '$input_value') {
      // We always write these out.
      return null;
    }
    return (
      <SingleCardWrapper
        code={this.props.effect.card}
        render={this._renderCard}
      />
    );
  }
}
