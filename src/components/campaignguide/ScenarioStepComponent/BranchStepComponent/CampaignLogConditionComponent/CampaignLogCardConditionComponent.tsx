import React, { useContext } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { find } from 'lodash';
import { c, t } from 'ttag';

import BinaryResult from '@components/campaignguide/BinaryResult';
import { LogEntryCard } from '@data/scenario/CampaignGuide';
import { BranchStep, CampaignLogCondition, CampaignLogCardsCondition } from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import useSingleCard from '@components/card/useSingleCard';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';

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
  const negatedPrompt = card.grammarGenderMasculine() ?
    c('masculine').t`If <i>${card.name}</i> is not listed under ‘${entry.section}’ in your Campaign Log.` :
    c('feminine').t`If <i>${card.name}</i> is not listed under ‘${entry.section}’ in your Campaign Log.`;
  const positivePrompt = card.grammarGenderMasculine() ?
    c('masculine').t`If <i>${card.name}</i> is listed under ‘${entry.section}’ in your Campaign Log.` :
    c('feminine').t`If <i>${card.name}</i> is listed under ‘${entry.section}’ in your Campaign Log.`;
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
