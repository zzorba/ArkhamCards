import React, { useCallback } from 'react';
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
  campaignLog: GuidedCampaignLog;
}

function renderInvestigators(investigators: Card[], card: Card) {
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
}

export default function RemoveCardEffectComponent({ id, effect, input, campaignLog }: Props) {
  const renderCard = useCallback((card: Card): Element | null => {
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
        render={renderInvestigators}
        description={t`Who will remove ${card.name} from their deck?`}
        extraArg={card}
      />
    );
  }, [id, effect, input, campaignLog]);

  if (effect.card === '$input_value') {
    // We always write these out.
    return null;
  }
  return (
    <SingleCardWrapper
      code={effect.card}
      type="player"
    >
      { renderCard }
    </SingleCardWrapper>
  );
}
