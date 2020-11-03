import React, { useCallback } from 'react';
import { map } from 'lodash';
import { t } from 'ttag';

import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import SingleCardWrapper from '@components/card/SingleCardWrapper';
import InvestigatorSelectorWrapper from '@components/campaignguide/InvestigatorSelectorWrapper';
import { AddCardEffect } from '@data/scenario/types';
import Card from '@data/Card';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';

interface Props {
  id: string;
  effect: AddCardEffect;
}

function renderInvestigators(investigators: Card[], card: Card) {
  return map(investigators, (investigator, idx) => (
    <SetupStepWrapper bulletType="small" key={idx}>
      <CampaignGuideTextComponent
        text={
          card.advanced ?
            t`${investigator.name} earns ${card.name} (Advanced).` :
            t`${investigator.name} earns ${card.name}.`}
      />
    </SetupStepWrapper>
  ));
}

export default function AddCardEffectComponent({ id, effect }: Props) {
  const renderCard = useCallback((card: Card) => {
    return (
      <InvestigatorSelectorWrapper
        id={id}
        investigator={effect.investigator}
        fixedInvestigator={effect.fixed_investigator}
        render={renderInvestigators}
        optional={effect.optional}
        description={t`Who will add ${card.name} to their deck?`}
        extraArg={card}
      />
    );
  }, [id, effect]);

  return (
    <SingleCardWrapper
      code={effect.card}
      type="player"
    >
      { renderCard }
    </SingleCardWrapper>
  );
}
