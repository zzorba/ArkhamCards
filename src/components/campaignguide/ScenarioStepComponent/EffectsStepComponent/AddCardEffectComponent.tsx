import React, { useContext, useMemo } from 'react';
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
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';

interface Props {
  id: string;
  effect: AddCardEffect;
  input?: string[];
}

function renderInvestigators(investigators: Card[], card: { name: string; advanced?: boolean }) {
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

export default function AddCardEffectComponent({ id, effect, input }: Props) {
  const { typography } = useContext(StyleContext);
  const [dbCard, loading] = useSingleCard(effect.card, 'player');
  const { campaignGuide } = useContext(CampaignGuideContext);
  const card = useMemo(() => dbCard || campaignGuide.card(effect.card), [campaignGuide, dbCard, effect.card]);
  if (loading || effect.hidden) {
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
      title={effect.show_prompt ? t`Choose an investigator to add ${card.name} to their deck:` : undefined}
      investigator={effect.investigator}
      fixedInvestigator={effect.fixed_investigator}
      render={renderInvestigators}
      optional={effect.optional}
      input={input}
      extraArg={card}
    />
  );
}
