import React, { useCallback } from 'react';
import { find } from 'lodash';
import { t } from 'ttag';

import BinaryResult from '@components/campaignguide/BinaryResult';
import SingleCardWrapper from '@components/card/SingleCardWrapper';
import { LogEntryCard } from '@data/scenario/CampaignGuide';
import { BranchStep, CampaignLogCondition, CampaignLogCardsCondition } from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import Card from '@data/Card';

interface Props {
  step: BranchStep;
  entry: LogEntryCard;
  condition: CampaignLogCondition | CampaignLogCardsCondition;
  campaignLog: GuidedCampaignLog;
}

export default function CampaignLogCardConditionComponent({ step, entry, condition, campaignLog }: Props) {
  const renderCard = useCallback((card: Card) => {
    const trueResult = find(condition.options, option => option.boolCondition === true);
    const falseResult = find(condition.options, option => option.boolCondition === false);
    const result = campaignLog.check(condition.section, condition.id);
    const negated = !!falseResult && !trueResult;
    const prompt = negated ?
      t`If <i>${card.name}</i> is not listed under Check ‘${entry.section}’ in your Campaign Log.` :
      t`If <i>${card.name}</i> is listed under Check ‘${entry.section}’ in your Campaign Log.`;

    return (
      <BinaryResult
        prompt={step.text || prompt}
        bulletType={step.bullet_type}
        result={negated ? !result : result}
      />
    );
  }, [step, entry, condition, campaignLog]);

  return (
    <SingleCardWrapper
      code={entry.code}
      type="encounter"
    >
      { renderCard }
    </SingleCardWrapper>
  );
}
