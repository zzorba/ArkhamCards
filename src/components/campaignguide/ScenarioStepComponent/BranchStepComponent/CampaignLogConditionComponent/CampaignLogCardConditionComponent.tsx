import React, { useContext, useMemo } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { find, map } from 'lodash';
import { c, msgid, ngettext, t } from 'ttag';

import BinaryResult from '@components/campaignguide/BinaryResult';
import { LogEntryCard } from '@data/scenario/CampaignGuide';
import { BranchStep, CampaignLogCondition, CampaignLogCardsCondition } from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import useSingleCard from '@components/card/useSingleCard';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import Card from '@data/types/Card';
import useCardList from '@components/card/useCardList';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import { stringList } from '@lib/stringHelper';
import LanguageContext from '@lib/i18n/LanguageContext';

function getPrompts(card: Card, entry: LogEntryCard): [string, string] {
  switch (card.gender) {
    case 'f': return [
      c('feminine').t`If <i>${card.name}</i> is not listed under ‘${entry.section}’ in your Campaign Log.`,
      c('feminine').t`If <i>${card.name}</i> is listed under ‘${entry.section}’ in your Campaign Log.`,
    ];
    case 'nb':
      return [
        c('nonbinary').t`If <i>${card.name}</i> is not listed under ‘${entry.section}’ in your Campaign Log.`,
        c('nonbinary').t`If <i>${card.name}</i> is listed under ‘${entry.section}’ in your Campaign Log.`,
      ];
    case 'm':
    default:
      return [
        c('masculine').t`If <i>${card.name}</i> is not listed under ‘${entry.section}’ in your Campaign Log.`,
        c('masculine').t`If <i>${card.name}</i> is listed under ‘${entry.section}’ in your Campaign Log.`,
      ];
  }
}


interface InvestigatorCardsProps {
  step: BranchStep;
  cards: string[];
  prompt: string;
}

export function CampaignLogCardsInvestigatorConditionComponent({ step, cards, prompt }: InvestigatorCardsProps) {
  const { colors } = useContext(StyleContext);
  const { listSeperator } = useContext(LanguageContext);
  const [investigatorCards, loading] = useCardList(cards, 'player', false);
  const investigators = useMemo(() => stringList(map(investigatorCards, card => card.name), listSeperator), [investigatorCards, listSeperator]);
  if (loading) {
    return <ActivityIndicator animating size="small" color={colors.lightText} />;
  }
  return (
    <SetupStepWrapper bulletType={step.bullet_type}>
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


interface Props {
  step: BranchStep;
  entry: LogEntryCard;
  condition: CampaignLogCondition | CampaignLogCardsCondition;
  campaignLog: GuidedCampaignLog;
}

export default function CampaignLogCardConditionComponent({ step, entry, condition, campaignLog }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const [card, loading] = useSingleCard(entry.code, 'encounter');
  if (loading) {
    return <ActivityIndicator animating size="small" color={colors.lightText} />;
  }
  if (!card) {
    const code = entry.code;
    return (
      <Text style={[typography.text, space.paddingM]}>
        { t`Missing card #${code}. Please try updating cards from ArkhamDB in settings.` }
      </Text>
    );
  }
  const [negatedPrompt, positivePrompt] = getPrompts(card, entry);
  const trueResult = find(condition.options, option => option.boolCondition === true);
  const falseResult = find(condition.options, option => option.boolCondition === false);
  const result = campaignLog.check(condition.section, condition.id);
  const negated = !!falseResult && !trueResult;
  const prompt = negated ? negatedPrompt : positivePrompt;

  return (
    <BinaryResult
      prompt={step.text || prompt}
      bulletType={step.bullet_type}
      result={negated ? !result : result}
    />
  );
}
