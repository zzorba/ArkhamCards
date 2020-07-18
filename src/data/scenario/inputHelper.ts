import { filter, find, forEach } from 'lodash';

import { NumberChoices } from '@actions/types';
import {
  BinaryChoiceCondition,
  InvestigatorChoiceCondition,
  InvestigatorChoiceInput,
  BinaryConditionalChoice,
} from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import {
  basicTraumaConditionResult,
  campaignDataInvestigatorConditionResult,
  campaignDataChaosBagConditionResult,
  investigatorCardConditionResult,
  campaignLogConditionResult,
  investigatorConditionResult,
  binaryCardConditionResult,
  multiConditionResult,
  BinaryResult,
  InvestigatorResult,
} from '@data/scenario/conditionHelper';
import { PersonalizedChoices, UniversalChoices, DisplayChoice } from '@data/scenario';

export function chooseOneInputChoices(
  choices: BinaryConditionalChoice[],
  campaignLog: GuidedCampaignLog
): DisplayChoice[] {
  return filter(
    choices,
    choice => {
      if (!choice.condition) {
        return true;
      }
      const result = calculateBinaryConditionResult(choice.condition, campaignLog);
      return !!result.option;
    }
  );
}

export function investigatorChoiceInputChoices(
  input: InvestigatorChoiceInput,
  campaignLog: GuidedCampaignLog
): PersonalizedChoices | UniversalChoices {
  if (!find(input.choices, choice => !!choice.condition)) {
    return {
      type: 'universal',
      choices: input.choices,
    };
  }
  const codes = campaignLog.investigatorCodes(false);
  const result: NumberChoices = {};
  forEach(
    input.choices,
    (choice, idx) => {
      if (!choice.condition) {
        forEach(codes, code => {
          result[code] = [...(result[code] || []), idx];
        });
      } else {
        const conditionResult = calculateInvestigatorConditionResult(
          choice.condition,
          campaignLog
        );
        forEach(conditionResult.investigatorChoices,
          (indexes, code) => {
            // If we got one or more matches, that means this 'choice' is good.
            if (indexes.length) {
              result[code] = [
                ...(result[code] || []),
                idx,
              ];
            }
          }
        );
      }
    }
  );
  return {
    type: 'personalized',
    perCode: result,
    choices: input.choices,
  };
}

export function calculateBinaryConditionResult(
  condition: BinaryChoiceCondition,
  campaignLog: GuidedCampaignLog
): BinaryResult {
  switch (condition.type) {
    case 'has_card':
      return binaryCardConditionResult(condition, campaignLog);
    case 'campaign_data': {
      if (condition.campaign_data === 'investigator') {
        return campaignDataInvestigatorConditionResult(condition, campaignLog);
      }
      const numericResult = campaignDataChaosBagConditionResult(condition, campaignLog);
      return {
        type: 'binary',
        decision: !!numericResult.option,
        option: numericResult.option,
      };
    }
    case 'campaign_log':
      return campaignLogConditionResult(condition, campaignLog);
    case 'multi':
      return multiConditionResult(condition, campaignLog);
  }
}


function calculateInvestigatorConditionResult(
  condition: InvestigatorChoiceCondition,
  campaignLog: GuidedCampaignLog
): InvestigatorResult {
  switch (condition.type) {
    case 'has_card':
      return investigatorCardConditionResult(condition, campaignLog);
    case 'trauma':
      return basicTraumaConditionResult(condition, campaignLog);
    case 'investigator':
      return investigatorConditionResult(condition, campaignLog);
  }
}
