import { filter, forEach, keys } from 'lodash';

import { ListChoices } from 'actions/types';
import {
  InvestigatorChoiceInput,
  ChooseOneInput,
  CardCondition,
  BasicTraumaCondition,
} from 'data/scenario/types';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import { hasCardConditionResult, basicTraumaConditionResult } from 'data/scenario/conditionHelper';
import { PersonalizedChoices, DisplayChoice } from 'data/scenario';

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
): PersonalizedChoices {
  const codes = campaignLog.investigatorCodes();
  const result: ListChoices = {};
  forEach(
    input.choices,
    (choice, idx) => {
      if (!choice.condition) {
        forEach(codes, code => {
          result[code] = [...(result[code] || []), idx];
        });
      } else {
        const conditionResult = calculateConditionResult(choice.condition, campaignLog);
        forEach(conditionResult.investigatorChoices,
          (indexes, code) => {
            // If we got one or more matches, that means this 'choice' is good.
            if (indexes.length) {
              result[code] = [
                ...(result[code] || []),
                idx
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

function calculateConditionResult(
  condition: CardCondition | BasicTraumaCondition,
  campaignLog: GuidedCampaignLog
) {
  return condition.type === 'has_card' ?
    hasCardConditionResult(condition, campaignLog) :
    basicTraumaConditionResult(condition, campaignLog);
}
