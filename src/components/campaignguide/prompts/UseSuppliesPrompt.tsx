import React, { useCallback, useContext, useMemo } from 'react';
import { find, forEach, map, sum } from 'lodash';
import { t } from 'ttag';

import SetupStepWrapper from '../SetupStepWrapper';
import InvestigatorCheckListComponent from './InvestigatorCheckListComponent';
import InvestigatorCounterComponent from './InvestigatorCounterComponent';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import ScenarioGuideContext from '../ScenarioGuideContext';
import { UseSuppliesInput, UseSuppliesAllInput } from '@data/scenario/types';
import Card from '@data/types/Card';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';

interface Props {
  id: string;
  text?: string;
  input: UseSuppliesInput;
  campaignLog: GuidedCampaignLog;
}

export default function UseSuppliesPrompt({ id, text, input, campaignLog }: Props) {
  const { scenarioState } = useContext(ScenarioGuideContext);
  const supplyLimits = useMemo(() => {
    const investigagorSupplies = campaignLog.investigatorSections[input.section] || {};
    const limits: { [code: string]: number } = {};
    const investigators = campaignLog.investigators(false);
    forEach(investigators, investigator => {
      limits[investigator.code] = 0;
    });
    forEach(investigators, investigator => {
      const supplies = investigagorSupplies[investigator.code] || {};
      const entry = find(supplies.entries || [],
        entry => entry.id === input.id &&
          !supplies.crossedOut[entry.id] &&
          entry.type === 'count'
      );
      limits[investigator.code] = (entry && entry.type === 'count') ? entry.count : 0;
    });
    return limits;
  }, [input, campaignLog]);

  const renderFirstAllPrompt = useCallback((input: UseSuppliesAllInput) => {
    // Basically 2 sequential choices.
    // 1) How many "supply" to consume
    // 2) If count != players, who doesn't get any?
    const supplyName = input.name;
    const desiredCount = campaignLog.playerCount();
    const totalProvisionCount = sum(map(supplyLimits, count => count));
    return (
      <InvestigatorCounterComponent
        id={`${id}_used`}
        countText={t`${supplyName} to use (${desiredCount})`}
        limits={supplyLimits}
        requiredTotal={Math.min(totalProvisionCount, desiredCount)}
      />
    );
  }, [id, campaignLog, supplyLimits]);

  const renderSecondAllPrompt = useCallback((input: UseSuppliesAllInput) => {
    const choiceList = scenarioState.numberChoices(`${id}_used`);
    if (choiceList === undefined) {
      return null;
    }

    const usedCount = sum(map(choiceList, choices => choices[0]));
    const desiredCount = campaignLog.playerCount();
    if (usedCount >= desiredCount) {
      // No secondary prompt is needed/
      return null;
    }
    // Choose people who are left behind.
    const target = desiredCount - usedCount;
    const badThing = find(input.choices, choice => choice.boolCondition === false);
    return (
      <InvestigatorCheckListComponent
        id={id}
        choiceId="bad_thing"
        checkText={badThing ? t`Reads "${badThing.prompt}"` : t`Doesn't get any`}
        min={target}
        max={target}
      />
    );
  }, [id, campaignLog, scenarioState]);

  const filterInvestigatorChoice = useCallback((investigator: Card) => {
    const count = supplyLimits[investigator.code] || 0;
    return count > 0;
  }, [supplyLimits]);

  switch (input.investigator) {
    case 'all':
      return (
        <>
          { !!text && (
            <SetupStepWrapper>
              <CampaignGuideTextComponent text={text} />
            </SetupStepWrapper>
          ) }
          { renderFirstAllPrompt(input) }
          { renderSecondAllPrompt(input) }
        </>
      );
    case 'choice': {
      // Single choice of players with Gasoline/Medicine, must choose one.
      const useChecklist = input.max === 1 ||
        scenarioState.stringChoices(id) !== undefined;
      return (
        <>
          { !!text && (
            <SetupStepWrapper>
              <CampaignGuideTextComponent text={text} />
            </SetupStepWrapper>
          ) }
          { useChecklist ? (
            <InvestigatorCheckListComponent
              id={id}
              choiceId="use_supply"
              checkText={input.prompt}
              min={input.min}
              max={input.max}
              filter={filterInvestigatorChoice}
            />
          ) : (
            <InvestigatorCounterComponent
              id={id}
              countText={input.prompt}
              limits={supplyLimits}
            />
          ) }
        </>
      );
    }
  }
}
