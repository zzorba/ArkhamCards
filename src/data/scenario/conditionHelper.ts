import {
  every,
  find,
  findIndex,
  forEach,
} from 'lodash';

import { ListChoices } from 'actions/types';
import {
  BinaryCardCondition,
  CardCondition,
  CampaignLogCondition,
  CampaignLogSectionExistsCondition,
  CheckSuppliesCondition,
  CheckSuppliesAllCondition,
  CheckSuppliesAnyCondition,
  InvestigatorCardCondition,
  KilledTraumaCondition,
  MathEqualsCondition,
  BasicTraumaCondition,
  Condition,
  BoolOption,
  NumOption,
  Option,
  Operand,
  DefaultOption,
} from './types';
import GuidedCampaignLog from './GuidedCampaignLog';

interface BinaryResult {
  type: 'binary';
  decision: boolean;
  option?: Option;
}

interface NumberResult {
  type: 'number';
  number: number;
  option?: Option;
}

interface StringResult {
  type: 'string';
  string: string;
  option?: Option;
}

export interface InvestigatorResult {
  type: 'investigator';
  investigatorChoices: ListChoices;
  options: Option[];
}

export type ConditionResult =
  BinaryResult |
  NumberResult |
  StringResult |
  InvestigatorResult;

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

function getOperand(
  op: Operand,
  campaignLog: GuidedCampaignLog
): number {
  switch (op.type) {
    case 'campaign_log_count':
      return campaignLog.count(op.section, op.id || '$count');
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

export function checkSuppliesConditionResult(
  condition: CheckSuppliesCondition,
  campaignLog: GuidedCampaignLog
): BinaryResult | InvestigatorResult {
  switch (condition.investigator) {
    case 'any':
      return checkSuppliesAnyConditionResult(condition, campaignLog);
    case 'all':
      return checkSuppliesAllConditionResult(condition, campaignLog);
  }
}

export function checkSuppliesAnyConditionResult(
  condition: CheckSuppliesAnyCondition,
  campaignLog: GuidedCampaignLog
): BinaryResult {
  const investigatorSupplies = campaignLog.investigatorSections[condition.section] || {};
  return binaryConditionResult(
    !!find(investigatorSupplies, supplies =>
      !!find(supplies.entries, entry => entry.id === condition.id && !supplies.crossedOut[condition.id])
    ),
    condition.options
  );
}

export function checkSuppliesAllConditionResult(
  condition: CheckSuppliesAllCondition,
  campaignLog: GuidedCampaignLog
): InvestigatorResult {
  const investigatorSupplies = campaignLog.investigatorSections[condition.section] || {};
  const choices: ListChoices = {};
  forEach(investigatorSupplies, (supplies, investigatorCode) => {
    const hasSupply = !!find(supplies.entries,
      entry => entry.id === condition.id && !supplies.crossedOut[condition.id]
    );
    const index = findIndex(
      condition.options,
      option => option.boolCondition === hasSupply
    );
    if (index !== -1) {
      choices[investigatorCode] = [index];
    }
  });
  return investigatorConditionResult(
    choices,
    condition.options
  );
}

export function campaignLogConditionResult(
  condition: CampaignLogSectionExistsCondition | CampaignLogCondition,
  campaignLog: GuidedCampaignLog
): BinaryResult {
  return binaryConditionResult(
    condition.type === 'campaign_log' ?
      campaignLog.check(condition.section, condition.id) :
      campaignLog.sectionExists(condition.section),
    condition.options
  );
}

export function killedTraumaConditionResult(
  condition: KilledTraumaCondition,
  campaignLog: GuidedCampaignLog
): BinaryResult {
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

export function mathEqualsConditionResult(
  condition: MathEqualsCondition,
  campaignLog: GuidedCampaignLog
) {
  const opA = getOperand(condition.opA, campaignLog);
  const opB = getOperand(condition.opB, campaignLog);
  return binaryConditionResult(
    opA === opB,
    condition.options
  );
}

export function basicTraumaConditionResult(
  condition: BasicTraumaCondition,
  campaignLog: GuidedCampaignLog
): InvestigatorResult {
  switch (condition.investigator) {
    case 'each': {
      const choices: ListChoices = {};
      const investigators = campaignLog.investigatorCodes();
      forEach(investigators, investigator => {
        const decision = condition.trauma === 'mental' ?
          campaignLog.hasMentalTrauma(investigator) :
          campaignLog.hasPhysicalTrauma(investigator);
        const index = findIndex(condition.options, option => option.boolCondition === decision);
        if (index !== -1) {
          choices[investigator] = [index];
        }
      });
      return investigatorConditionResult(
        choices,
        condition.options
      );
    }
  }
}

export function hasCardConditionResult(
  condition: CardCondition,
  campaignLog: GuidedCampaignLog
): InvestigatorResult | BinaryResult {
  if (condition.investigator === 'each') {
    return investigatorCardConditionResult(condition, campaignLog);
  }
  return binaryCardConditionResult(condition, campaignLog);
}

export function binaryCardConditionResult(
  condition: BinaryCardCondition,
  campaignLog: GuidedCampaignLog
): BinaryResult {
  const investigators = campaignLog.investigatorCodes();
  return binaryConditionResult(
    !!find(investigators, code => {
      return (
        condition.investigator !== 'defeated' ||
        campaignLog.isDefeated(code)
      ) && campaignLog.hasCard(code, condition.card);
    }),
    condition.options
  );
}

export function investigatorCardConditionResult(
  condition: InvestigatorCardCondition,
  campaignLog: GuidedCampaignLog
): InvestigatorResult {
  const investigators = campaignLog.investigatorCodes();
  const choices: ListChoices = {};
  forEach(investigators, code => {
    const decision = campaignLog.hasCard(
      code,
      condition.card
    );
    const index = findIndex(condition.options, option => option.boolCondition === decision);
    if (index !== -1) {
      choices[code] = [index];
    }
  });
  return investigatorConditionResult(
    choices,
    condition.options
  );
}

export function conditionResult(
  condition: Condition,
  campaignLog: GuidedCampaignLog
): ConditionResult {
  switch (condition.type) {
    case 'check_supplies': {
      return checkSuppliesConditionResult(condition, campaignLog);
    }
    case 'campaign_log_section_exists':
    case 'campaign_log':
      return campaignLogConditionResult(condition, campaignLog);
    case 'campaign_log_count': {
      console.log({
        section: condition.section,
        count: campaignLog.count(condition.section, condition.id),
      });
      return numberConditionResult(
        campaignLog.count(condition.section, condition.id),
        condition.options,
        condition.defaultOption
      );
    }
    case 'math': {
      if (condition.operation === 'equals') {
        return mathEqualsConditionResult(condition, campaignLog);
      }
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
          if (condition.investigator !== 'defeated') {
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
    case 'has_card':
      return hasCardConditionResult(condition, campaignLog);
    case 'trauma':
      return killedTraumaConditionResult(condition, campaignLog);
  }
}

export default {
  conditionResult,
};
