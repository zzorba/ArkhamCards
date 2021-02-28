import React, { useCallback } from 'react';
import { find, map } from 'lodash';
import { msgid, ngettext } from 'ttag';

import { stringList } from '@lib/stringHelper';
import SetupStepWrapper from '../../SetupStepWrapper';
import BinaryResult from '../../BinaryResult';
import InvestigatorResultConditionWrapper from '../../InvestigatorResultConditionWrapper';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import Card from '@data/types/Card';
import {
  BranchStep,
  CheckSuppliesCondition,
  Option,
} from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { checkSuppliesAnyConditionResult, checkSuppliesAllConditionResult } from '@data/scenario/conditionHelper';

interface Props {
  step: BranchStep;
  condition: CheckSuppliesCondition;
  campaignLog: GuidedCampaignLog;
}

export default function CheckSuppliesConditionComponent({ step, condition, campaignLog }: Props) {
  const renderCondition = useCallback((cards: Card[], positive: boolean) => {
    const option = find(condition.options, option => option.boolCondition === positive);
    if (!option) {
      return null;
    }
    const sectionName = option.prompt || 'Missing';
    const supplyName = condition.name;
    const list = stringList(map(cards, card => card.name));
    return (
      <SetupStepWrapper bulletType="small">
        <CampaignGuideTextComponent
          text={positive ?
            ngettext(
              msgid`Since ${list} has a ${supplyName}, they must read <b>${sectionName}</b>.`,
              `Since ${list} all have a ${supplyName}, they must read <b>${sectionName}</b>.`,
              cards.length
            ) : ngettext(
              msgid`Since ${list} does not have a ${supplyName}, they must read <b>${sectionName}</b>.`,
              `Since ${list} do not have a ${supplyName}, they must read <b>${sectionName}</b>.`,
              cards.length
            )}
        />
      </SetupStepWrapper>
    );
  }, [condition]);

  const renderAllOption = useCallback((cards: Card[], option: Option): Element | null => {
    return renderCondition(
      cards,
      option.boolCondition === true
    );
  }, [renderCondition]);

  switch (condition.investigator) {
    case 'any': {
      return (
        <BinaryResult
          bulletType={step.bullet_type}
          prompt={step.text}
          result={checkSuppliesAnyConditionResult(condition, campaignLog).decision}
        />
      );
    }
    case 'all': {
      const result = checkSuppliesAllConditionResult(condition, campaignLog);
      return (
        <>
          <SetupStepWrapper>
            { !!step.text && <CampaignGuideTextComponent text={step.text} /> }
          </SetupStepWrapper>
          <InvestigatorResultConditionWrapper
            result={result}
            renderOption={renderAllOption}
            extraArg={undefined}
          />
        </>
      );
    }
  }
}
