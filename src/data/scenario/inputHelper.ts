import { filter, find, flatMap, forEach, head, keys, values } from 'lodash';

import { NumberChoices } from '@actions/types';
import {
  BinaryChoiceCondition,
  InvestigatorChoiceInput,
  BinaryConditionalChoice,
  CampaignLogCardsCondition,
} from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import {
  campaignDataInvestigatorConditionResult,
  campaignDataChaosBagConditionResult,
  campaignLogConditionResult,
  binaryCardConditionResult,
  multiConditionResult,
  BinaryResult,
  campaignLogCountConditionResult,
  campaignDataScenarioConditionResult,
  partnerStatusConditionResult,
  investigatorChoiceConditionResult,
} from '@data/scenario/conditionHelper';
import { PersonalizedChoices, UniversalChoices, DisplayChoiceWithId } from '@data/scenario';

export function chooseOneInputChoices(
  choices: BinaryConditionalChoice[],
  campaignLog: GuidedCampaignLog
): DisplayChoiceWithId[] {
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
  const conditionResult = input.condition && investigatorChoiceConditionResult(input.condition, campaignLog);
  const codes = conditionResult ? keys(conditionResult.investigatorChoices) :
    filter(
      campaignLog.investigatorCodes(false),
      code => input.investigator !== 'resigned' || campaignLog.resigned(code)
    );
  const result: NumberChoices = {};
  forEach(
    input.choices,
    (choice, idx) => {
      if (!choice.condition) {
        forEach(codes, code => {
          result[code] = [...(result[code] || []), idx];
        });
      } else {
        const conditionResult = investigatorChoiceConditionResult(
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

export function calculateCardChoiceResult(
  condition: CampaignLogCardsCondition,
  campaignLog: GuidedCampaignLog,
  code: string
) {
  if (condition.id === '$input_value') {
    const result = !!find(campaignLog.allCards(condition.section), card => card === code);
    return !!find(condition.options, option => option.boolCondition === result);
  }
  return true;
}

export function calculateBinaryConditionResult(
  condition: BinaryChoiceCondition,
  campaignLog: GuidedCampaignLog
): BinaryResult {
  switch (condition.type) {
    case 'has_card':
      return binaryCardConditionResult(condition, campaignLog);
    case 'campaign_data': {
      switch (condition.campaign_data) {
        case 'investigator':
          return campaignDataInvestigatorConditionResult(condition, campaignLog);
        case 'scenario_completed':
        case 'scenario_replayed':
          return campaignDataScenarioConditionResult(condition, campaignLog);
        case 'chaos_bag': {
          const numericResult = campaignDataChaosBagConditionResult(condition, campaignLog);
          return {
            type: 'binary',
            decision: !!numericResult.option,
            option: numericResult.option,
          };
        }
      }
    }
    case 'campaign_log_section_exists':
    case 'campaign_log':
      return campaignLogConditionResult(condition, campaignLog);
    case 'campaign_log_count': {
      const numericResult = campaignLogCountConditionResult(
        condition,
        campaignLog
      );
      return {
        type: 'binary',
        decision: !!numericResult.option,
        option: numericResult.option,
      };
    }
    case 'multi':
      return multiConditionResult(condition, campaignLog);
    case 'partner_status': {
      const investigatorResult = partnerStatusConditionResult(condition, campaignLog);
      const choices = new Set(flatMap(values(investigatorResult.investigatorChoices), x => x));
      return {
        type: 'binary',
        decision: keys(investigatorResult.investigatorChoices).length > 0,
        option: head(filter(investigatorResult.options, option => choices.has(option.id))),
      };
    }
  }
}
