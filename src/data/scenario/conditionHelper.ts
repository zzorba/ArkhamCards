import {
  every,
  filter,
  find,
  findIndex,
  forEach,
} from 'lodash';

import { ListChoices } from 'actions/types';
import {
  Condition,
  BoolOption,
  NumOption,
  Option,
  Operand,
  DefaultOption,
} from './types';
import GuidedCampaignLog from './GuidedCampaignLog';

interface BinaryResult {
  type: 'binary',
  decision: boolean;
  option?: Option;
}

interface NumberResult {
  type: 'number',
  number: number;
  option?: Option;
}

interface StringResult {
  type: 'string',
  string: string;
  option?: Option;
}

interface InvestigatorResult {
  type: 'investigator',
  investigatorChoices: ListChoices;
  options: Option[];
}

interface BinaryInvestigatorResult {
  type: 'binary_investigator',
  decision: boolean;
  option?: Option;
  investigators: string[];
}

export type ConditionResult =
  BinaryResult |
  NumberResult |
  StringResult |
  InvestigatorResult |
  BinaryInvestigatorResult;

function binaryConditionResult(
  result: boolean,
  options: BoolOption[]
): BinaryResult {
  const ifTrue = find(options, option => option.boolCondition === true);
  const ifFalse = find(options, option => option.boolCondition === false);
  return {
    type: 'binary',
    decision: result,
    option: result ? ifTrue : ifFalse,
  };
}

function numberConditionResult(
  value: number,
  options: NumOption[],
  defaultOption?: DefaultOption
): NumberResult {
  const choice =
    find(options, option => option.numCondition === value) ||
    defaultOption;
  return {
    type: 'number',
    number: value,
    option: choice,
  };
}

function stringConditionResult(
  value: string,
  options: Option[],
  defaultOption?: DefaultOption
): StringResult {
  const choice =
    find(options, option => option.condition === value) ||
    defaultOption;
  return {
    type: 'string',
    string: value,
    option: choice,
  };
}

function investigatorConditionResult(
  investigatorChoices: ListChoices,
  options: Option[]
): InvestigatorResult {
  return {
    type: 'investigator',
    investigatorChoices,
    options,
  };
}

function binaryInvestigatorConditionResult(
  decision: boolean,
  options: Option[],
  investigators: string[]
): BinaryInvestigatorResult {
  return {
    ...binaryConditionResult(decision, options),
    type: 'binary_investigator',
    investigators,
  };
}

function getOperand(
  op: Operand,
  campaignLog: GuidedCampaignLog
): number {
  switch (op.type) {
    case 'campaign_log_count':
      return campaignLog.count(op.section, '$count');
    case 'chaos_bag':
      return campaignLog.chaosBag[op.token] || 0;
    case 'constant':
      return op.value;
  }
}

function performOp(
  opA: number,
  opB: number,
  operation: 'compare' | 'sum'
): number {
  switch (operation) {
    case 'compare':
      if (opA < opB) {
        return -1;
      }
      if (opA === opB) {
        return 0;
      }
      return 1;
    case 'sum':
      return opA + opB;
  }
}

export function conditionResult(
  condition: Condition,
  campaignLog: GuidedCampaignLog
): ConditionResult {
  switch (condition.type) {
    case 'check_supplies': {
      const investigatorSupplies = campaignLog.investigatorSections[condition.section] || {};
      switch (condition.investigator) {
        case 'any': {
          return binaryConditionResult(
            !!find(investigatorSupplies, supplies =>
              !!find(supplies.entries, entry => entry.id === condition.id && !supplies.crossedOut[condition.id])
            ),
            condition.options
          );
        }
        case 'all': {
          const choices: ListChoices = {};
          forEach(investigatorSupplies, (supplies, investigatorCode) => {
            const hasSupply = !!find(supplies.entries,
              entry => entry.id === condition.id && !supplies.crossedOut[condition.id]
            );
            const index = findIndex(condition.options, option => option.boolCondition === hasSupply);
            if (index !== -1) {
              choices[investigatorCode] = [index];
            }
          });
          return investigatorConditionResult(
            choices,
            condition.options
          );
        }
      }
    }
    case 'campaign_log_section_exists':
    case 'campaign_log': {
      return binaryConditionResult(
        condition.type === 'campaign_log' ?
            campaignLog.check(condition.section, condition.id) :
            campaignLog.sectionExists(condition.section),
        condition.options
      );
    }
    case 'campaign_log_count': {
      return numberConditionResult(
        campaignLog.count(condition.section, condition.id),
        condition.options,
        condition.defaultOption
      );

    }
    case 'math': {
      const opA = getOperand(condition.opA, campaignLog);
      const opB = getOperand(condition.opB, campaignLog);
      const value = performOp(opA, opB, condition.operation);
      return numberConditionResult(
        value,
        condition.options,
        condition.operation === 'sum' ? condition.defaultOption : undefined
      );
    }
    case 'campaign_data': {
      switch (condition.campaign_data) {
        case 'scenario_completed': {
          return binaryConditionResult(
            campaignLog.scenarioStatus(condition.scenario) === 'completed',
            condition.options
          );
        }
        case 'difficulty': {
          return stringConditionResult(
            campaignLog.campaignData.difficulty || 'standard',
            condition.options
          );
        }
        case 'chaos_bag': {
          const chaosBag = campaignLog.chaosBag;
          const tokenCount: number = chaosBag[condition.token] || 0;
          return numberConditionResult(
            tokenCount,
            condition.options
          );
        }
        case 'investigator':
          throw new Error('not implemented');
      }
    }
    case 'scenario_data': {
      switch (condition.scenario_data) {
        case 'player_count': {
          const playerCount = campaignLog.playerCount();
          return numberConditionResult(
            playerCount,
            condition.options
          );
        }
        case 'resolution': {
          return stringConditionResult(
            campaignLog.resolution(),
            condition.options
          );
        }
        case 'investigator': {
          const choices: ListChoices = {};
          forEach(campaignLog.investigatorCodes(), code => {
            const index = findIndex(condition.options, option => option.condition === code);
            if (index !== -1) {
              choices[code] = [index];
            }
          });
          return investigatorConditionResult(
            choices,
            condition.options
          );
        }
        case 'investigator_status': {
          if (condition.investigator !== 'defeated')  {
            throw new Error('Unexpected investigator_status scenario condition');
          }
          const investigators = campaignLog.investigatorCodes();
          const decision = !!find(investigators, code => {
            return campaignLog.isDefeated(code);
          });
          return binaryConditionResult(
            decision,
            condition.options
          );
        }
      }
    }
    case 'has_card': {
      const investigators = campaignLog.investigatorCodes();
      const hasCard = filter(investigators, code => {
        if (condition.investigator === 'defeated' &&
          !campaignLog.isDefeated(code)) {
          return false;
        }
        return campaignLog.hasCard(
          code,
          condition.card
        );
      });
      return binaryInvestigatorConditionResult(
        hasCard.length > 0,
        condition.options,
        hasCard
      );
    }
    case 'trauma': {
      if (condition.trauma !== 'killed') {
        throw new Error('Trauma should always be killed');
      }
      switch (condition.investigator) {
        case 'lead_investigator': {
          const investigator = campaignLog.leadInvestigatorChoice();
          return binaryConditionResult(
            campaignLog.isKilled(investigator),
            condition.options
          );
        }
        case 'all': {
          const investigators = campaignLog.investigatorCodes();
          return binaryConditionResult(
            investigators.length === 0 || every(investigators, code => campaignLog.isKilled(code)),
            condition.options
          );
        }
      }
    }
  }
}

export default {
  conditionResult,
};
