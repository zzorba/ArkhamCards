import React from 'react';
import { map, keys } from 'lodash';
import { t } from 'ttag';

import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import SingleCardWrapper from '@components/card/SingleCardWrapper';
import InvestigatorSelectorWrapper from '../../InvestigatorSelectorWrapper';
import InvestigatorCheckListComponent from '../../prompts/InvestigatorCheckListComponent';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { RemoveCardEffect } from '@data/scenario/types';
import Card from '@data/Card';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import { hasCardConditionResult } from '@data/scenario/conditionHelper';

interface Props {
  id: string;
  effect: RemoveCardEffect;
  input?: string[];
  skipCampaignLog?: boolean;
  campaignLog: GuidedCampaignLog;
}

export default class RemoveCardEffectComponent extends React.Component<Props> {
  _renderInvestigators = (
    investigators: Card[],
    card: Card
  ) => {
    return map(investigators, (investigator, idx) => (
      <SetupStepWrapper bulletType="small" key={idx}>
        <CampaignGuideTextComponent
          text={
            card.advanced ?
              t`${investigator.name} removes ${card.name} (Advanced)` :
              t`${investigator.name} removes ${card.name}`
          }
        />
      </SetupStepWrapper>
    ));
  };

  _renderCard = (card: Card): Element | null => {
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
          choiceId="remove_card"
          min={input.length}
          max={input.length}
          checkText={t`Remove ${card.name} (${input.length})`}
          investigators={
            investigatorResult.type === 'investigator' ?
              keys(investigatorResult.investigatorChoices) :
              undefined
          }
        />
      );
    }
    return (
      <InvestigatorSelectorWrapper
        id={id}
        investigator={effect.investigator}
        fixedInvestigator={effect.fixed_investigator}
        render={this._renderInvestigators}
        description={t`Who will remove ${card.name} from their deck?`}
        extraArg={card}
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
        type="player"
      >
        { this._renderCard }
      </SingleCardWrapper>
    );
  }
}
