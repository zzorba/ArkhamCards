import React, { useContext } from 'react';
import { Text } from 'react-native';
import { map, keys } from 'lodash';
import { t } from 'ttag';

import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import InvestigatorSelectorWrapper from '../../InvestigatorSelectorWrapper';
import InvestigatorCheckListComponent from '../../prompts/InvestigatorCheckListComponent';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { RemoveCardEffect } from '@data/scenario/types';
import Card from '@data/types/Card';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import { hasCardConditionResult } from '@data/scenario/conditionHelper';
import useSingleCard from '@components/card/useSingleCard';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';

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

function RemoveCardEffectNonInputComponent({ id, effect, input, campaignLog, investigator }: Props & {
  investigator: 'choice' | '$input_value' | '$fixed_investigator';
}) {
  const { typography } = useContext(StyleContext);
  const [card, loading] = useSingleCard(effect.card, 'player');
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
      investigator={investigator}
      fixedInvestigator={effect.fixed_investigator}
      render={renderInvestigators}
      extraArg={card}
    />
  );
}

export default function RemoveCardEffectComponent({ id, effect, input, campaignLog }: Props) {
  if (!effect.investigator || effect.card === '$input_value') {
    // These are always spelled out.
    return null;
  }
  return (
    <RemoveCardEffectNonInputComponent
      id={id}
      effect={effect}
      input={input}
      campaignLog={campaignLog}
      investigator={effect.investigator}
    />
  );
}
