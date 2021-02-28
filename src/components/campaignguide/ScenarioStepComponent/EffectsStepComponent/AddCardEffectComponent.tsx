import React, { useContext } from 'react';
import { Text } from 'react-native';
import { map } from 'lodash';
import { t } from 'ttag';

import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import InvestigatorSelectorWrapper from '@components/campaignguide/InvestigatorSelectorWrapper';
import { AddCardEffect } from '@data/scenario/types';
import Card from '@data/types/Card';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import useSingleCard from '@components/card/useSingleCard';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';

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
  const { typography } = useContext(StyleContext);
  const [card, loading] = useSingleCard(effect.card, 'player');
  if (loading) {
    return null;
  }
  if (!card) {
    const code = effect.card;
    return (
      <Text style={[typography.text, space.paddingM]}>
        { t`Missing card #${code}. Please try updating cards from ArkhamDB in settings.` }
      </Text>
    );
  }
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
}
