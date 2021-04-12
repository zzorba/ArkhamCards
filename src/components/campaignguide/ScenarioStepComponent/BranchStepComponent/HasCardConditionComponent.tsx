import React, { useContext } from 'react';
import { Text } from 'react-native';
import { map } from 'lodash';
import { ngettext, msgid, t } from 'ttag';

import InvestigatorResultConditionWrapper from '../../InvestigatorResultConditionWrapper';
import SetupStepWrapper from '../../SetupStepWrapper';
import BinaryResult from '../../BinaryResult';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import Card from '@data/types/Card';
import {
  BoolOption,
  BranchStep,
  CardCondition,
} from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { hasCardConditionResult } from '@data/scenario/conditionHelper';
import { stringList } from '@lib/stringHelper';
import useSingleCard from '@components/card/useSingleCard';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';

interface Props {
  step: BranchStep;
  condition: CardCondition;
  campaignLog: GuidedCampaignLog;
}

function investigatorCardPrompt(
  card: Card,
  investigator: 'defeated' | 'any' | 'each'
): string{
  const cardName = card.cardName();
  switch (investigator) {
    case 'any':
      return t`Does any investigator have \"${cardName}\" in their deck?`;
    case 'defeated':
      return t`Was an investigator with \"${cardName}\" in their deck defeated?`;
    case 'each':
      return t`For each investigator with \"${cardName}\" in their deck:`;
  }
}

function renderInvestigators(investigatorCards: Card[], option: BoolOption): Element | null {
  const investigators = stringList(map(investigatorCards, card => card.name));
  const prompt = option && option.prompt;
  return (
    <SetupStepWrapper>
      <CampaignGuideTextComponent
        text={ngettext(
          msgid`${investigators} must read <b>${prompt}</b>.`,
          `${investigators} must read <b>${prompt}</b>.`,
          investigators.length
        )}
      />
    </SetupStepWrapper>
  );
}

export default function HasCardConditionComponent({ step, condition, campaignLog }: Props) {
  const { typography } = useContext(StyleContext);
  const [card, loading] = useSingleCard(condition.card, 'player');
  if (loading) {
    return null;
  }
  if (!card) {
    const code = condition.card;
    return (
      <Text style={[typography.text, space.paddingM]}>
        { t`Missing card #${code}. Please try updating cards from ArkhamDB in settings.` }
      </Text>
    );
  }

  const result = hasCardConditionResult(condition, campaignLog);
  if (result.type === 'investigator') {
    return (
      <InvestigatorResultConditionWrapper
        result={result}
        renderOption={renderInvestigators}
        extraArg={card}
      />
    );
  }

  const prompt = investigatorCardPrompt(card, condition.investigator);
  return (
    <BinaryResult
      bulletType={step.bullet_type}
      prompt={prompt}
      result={result.decision}
    />
  );
}
