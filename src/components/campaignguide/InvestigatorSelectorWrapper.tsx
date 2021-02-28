import React, { useCallback, useContext, useMemo } from 'react';
import { filter, keys, map, head } from 'lodash';
import { t } from 'ttag';

import ScenarioStepContext from './ScenarioStepContext';
import ChooseInvestigatorPrompt from './prompts/ChooseInvestigatorPrompt';
import { InvestigatorSelector } from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import Card from '@data/types/Card';
import ScenarioGuideContext from './ScenarioGuideContext';

function getInvestigatorChoices(
  investigator: InvestigatorSelector,
  investigators: Card[],
  campaignLog: GuidedCampaignLog
): string[] | undefined {
  switch (investigator) {
    case 'lead_investigator':
      return [campaignLog.leadInvestigatorChoice()];
    case 'any_resigned': {
      const allStatus = campaignLog.investigatorResolutionStatus();
      return map(
        filter(investigators, card => {
          return allStatus[card.code] === 'resigned';
        }),
        card => card.code
      );
    }
    default:
      return undefined;
  }
}

interface Props<T> {
  id: string;
  investigator: InvestigatorSelector;
  optional?: boolean;
  description?: string;
  input?: string[];
  fixedInvestigator?: string;
  render: (investigators: Card[], extraArg: T) => React.ReactNode;
  extraArg: T;
}

export default function InvestigatorSelectorWrapper<T = undefined>({
  id,
  investigator,
  optional,
  description,
  input,
  fixedInvestigator,
  render,
  extraArg,
}: Props<T>) {
  const { scenarioState } = useContext(ScenarioGuideContext);
  const { campaignLog } = useContext(ScenarioStepContext);
  const scenarioInvestigators = useMemo(() => campaignLog.investigators(false), [campaignLog]);
  const investigators = useCallback((choice?: string): Card[] => {
    switch (investigator) {
      case 'lead_investigator': {
        const leadInvestigator = campaignLog.leadInvestigatorChoice();
        if (!optional) {
          return filter(
            scenarioInvestigators,
            investigator => investigator.code === leadInvestigator
          );
        }
        if (choice === undefined) {
          return [];
        }
        return filter(
          scenarioInvestigators,
          investigator => investigator.code === choice
        );
      }
      case 'all':
        return scenarioInvestigators;
      case 'any':
      case 'choice':
      case 'any_resigned':
        if (choice === undefined) {
          return [];
        }
        return filter(
          scenarioInvestigators,
          investigator => investigator.code === choice
        );
      case 'defeated':
      case 'not_resigned': {
        const allStatus = campaignLog.investigatorResolutionStatus();
        return filter(scenarioInvestigators, card => {
          const status = allStatus[card.code];
          switch (investigator) {
            case 'defeated':
              return status !== 'alive' && status !== 'resigned';
            case 'not_resigned':
              return status !== 'resigned';
          }
        });
      }
      case '$input_value': {
        const codes = new Set(input || []);
        return filter(
          scenarioInvestigators,
          investigator => codes.has(investigator.code)
        );
      }
      case '$fixed_investigator': {
        if (!fixedInvestigator) {
          return [];
        }
        return filter(
          scenarioInvestigators,
          investigator => investigator.code === fixedInvestigator
        );
      }
    }
  }, [investigator, input, optional, fixedInvestigator, scenarioInvestigators, campaignLog]);


  const choice = scenarioState.stringChoices(`${id}_investigator`);
  if (choice === undefined && (
    investigator === 'choice' ||
    investigator === 'any' ||
    investigator === 'any_resigned' ||
    (investigator === 'lead_investigator' && optional)
  )) {
    return (
      <ChooseInvestigatorPrompt
        id={`${id}_investigator`}
        title={t`Choose Investigator`}
        choiceId="chosen_investigator"
        description={description}
        investigators={getInvestigatorChoices(
          investigator,
          scenarioInvestigators,
          campaignLog
        )}
        defaultLabel={t`No one`}
        required={investigator === 'any' || investigator === 'any_resigned'}
      />
    );
  }
  return (
    <>
      { render(investigators(head(keys(choice))), extraArg) }
    </>
  );
}
