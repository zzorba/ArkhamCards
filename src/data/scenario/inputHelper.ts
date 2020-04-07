import { filter, find, forEach, keys } from 'lodash';

import { NumberChoices } from 'actions/types';
import {
  ChoiceCondition,
  InvestigatorChoiceInput,
  ChooseOneInput,
} from 'data/scenario/types';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import {
  basicTraumaConditionResult,
  campaignDataInvestigatorConditionResult,
  campaignLogConditionResult,
  hasCardConditionResult,
  multiConditionResult,
  BinaryResult,
  InvestigatorResult,
} from 'data/scenario/conditionHelper';
import { PersonalizedChoices, UniversalChoices, DisplayChoice } from 'data/scenario';

export function chooseOneInputChoices(
  input: ChooseOneInput,
  campaignLog: GuidedCampaignLog
): DisplayChoice[] {
  return filter(
    input.choices,
    choice => {
      if (!choice.condition) {
        return true;
      }
      const result = calculateConditionResult(choice.condition, campaignLog);
      if (result.type === 'binary') {
        return !!result.option;
      }
      return keys(result.investigatorChoices).length > 0;
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
        const conditionResult = calculateConditionResult(choice.condition, campaignLog);
        if (conditionResult.type === 'investigator') {
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
    }
  );
  return {
    type: 'personalized',
    perCode: result,
    choices: input.choices,
  };
}

function calculateConditionResult(
  condition: ChoiceCondition,
  campaignLog: GuidedCampaignLog
): BinaryResult | InvestigatorResult {
  switch (condition.type) {
    case 'has_card':
      return hasCardConditionResult(condition, campaignLog);
    case 'trauma':
      return basicTraumaConditionResult(condition, campaignLog);
    case 'campaign_data':
      return campaignDataInvestigatorConditionResult(condition, campaignLog);
    case 'campaign_log':
      return campaignLogConditionResult(condition, campaignLog);
    case 'multi':
      return multiConditionResult(condition, campaignLog);
  }
}
