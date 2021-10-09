import {
  every,
  filter,
  find,
  findIndex,
  forEach,
  map,
  sumBy,
} from 'lodash';

import { StringChoices } from '@actions/types';
import {
  BinaryCardCondition,
  CardCondition,
  CampaignLogCondition,
  CampaignLogCardsCondition,
  CampaignDataCondition,
  CampaignDataScenarioCondition,
  CampaignDataChaosBagCondition,
  CampaignDataVersionCondition,
  MultiCondition,
  CampaignDataInvestigatorCondition,
  CampaignLogSectionExistsCondition,
  CheckSuppliesCondition,
  CheckSuppliesAllCondition,
  CheckSuppliesAnyCondition,
  InvestigatorCardCondition,
  InvestigatorCondition,
  KilledTraumaCondition,
  MathEqualsCondition,
  BasicTraumaCondition,
  StringOption,
  Condition,
  BoolOption,
  NumOption,
  Option,
  Operand,
  DefaultOption,
  CampaignLogCountCondition,
  CampaignLogInvestigatorCountCondition,
  MathCondition,
} from './types';
import GuidedCampaignLog from './GuidedCampaignLog';
import Card from '@data/types/Card';

export interface BinaryResult {
  type: 'binary';
  decision: boolean;
  option?: Option;
  input?: string[];
  numberInput?: number[];
}

export interface NumberResult {
  type: 'number';
  number: number;
  option?: Option;
}

export interface StringResult {
  type: 'string';
  string: string;
  option?: Option;
}

export type OptionWithId = Option & { id: string };
export type BoolOptionWithId = BoolOption & { id: string };

export interface InvestigatorResult {
  type: 'investigator';
  investigatorChoices: StringChoices;
  options: OptionWithId[];
}

export interface InvestigatorCardResult {
  type: 'investigator';
  investigatorChoices: StringChoices;
  options: BoolOptionWithId[];
}

export type ConditionResult =
  BinaryResult |
  NumberResult |
  StringResult |
  InvestigatorResult;

function binaryConditionResult(
  result: boolean,
  options: BoolOption[],
  input?: string[],
  numberInput?: number[]
): BinaryResult {
  const ifTrue = find(options, option => option.boolCondition === true);
  const ifFalse = find(options, option => option.boolCondition === false);
  return {
    type: 'binary',
    decision: result,
    option: result ? ifTrue : ifFalse,
    input,
    numberInput,
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

function investigatorResult(
  investigatorChoices: StringChoices,
  options: OptionWithId[]
): InvestigatorResult {
  return {
    type: 'investigator',
    investigatorChoices,
    options,
  };
}

function investigatorCardResult(
  investigatorChoices: StringChoices,
  options: BoolOptionWithId[]
): InvestigatorCardResult {
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
  const investigators = campaignLog.investigators(false);
  return binaryConditionResult(
    !!find(investigators, investigator => {
      const supplies = investigatorSupplies[investigator.code] || {};
      return !!find(supplies.entries, entry => (
        entry.id === condition.id && !supplies.crossedOut[condition.id] && entry.type === 'count' && entry.count > 0
      ));
    }),
    condition.options
  );
}

export function checkSuppliesAllConditionResult(
  condition: CheckSuppliesAllCondition,
  campaignLog: GuidedCampaignLog
): InvestigatorCardResult {
  const investigatorSupplies = campaignLog.investigatorSections[condition.section] || {};
  const choices: StringChoices = {};
  forEach(campaignLog.investigators(false), investigator => {
    choices[investigator.code] = ['false'];
  });
  forEach(investigatorSupplies, (supplies, investigatorCode) => {
    const hasSupply = !!find(supplies.entries,
      entry => entry.id === condition.id && !supplies.crossedOut[condition.id] && entry.type === 'count' && entry.count > 0
    );
    const index = findIndex(
      condition.options,
      option => option.boolCondition === hasSupply
    );
    if (index !== -1) {
      choices[investigatorCode] = [hasSupply ? 'true' : 'false'];
    }
  });
  const options: BoolOptionWithId[] = map(condition.options, option => {
    return {
      ...option,
      id: option.boolCondition ? 'true' : 'false',
    };
  });
  return investigatorCardResult(choices, options);
}

export function campaignLogConditionResult(
  condition: CampaignLogSectionExistsCondition | CampaignLogCondition | CampaignLogCardsCondition,
  campaignLog: GuidedCampaignLog
): BinaryResult {
  switch (condition.type) {
    case 'campaign_log':
      return binaryConditionResult(
        campaignLog.check(condition.section, condition.id),
        condition.options
      );
    case 'campaign_log_section_exists':
      return binaryConditionResult(
        campaignLog.sectionExists(condition.section),
        condition.options
      );
    case 'campaign_log_cards':
      return binaryConditionResult(
        campaignLog.check(condition.section, condition.id),
        condition.options,
        campaignLog.allCards(condition.section, condition.id),
        campaignLog.allCardCounts(condition.section, condition.id)
      );
  }
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
      // Explicitly checking if they are all killed, so we want eliminated ones.
      const investigators = campaignLog.investigatorCodes(true);
      return binaryConditionResult(
        investigators.length === 0 || every(
          investigators,
          code => campaignLog.isKilled(code)
        ),
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
      const choices: StringChoices = {};
      const investigators = campaignLog.investigatorCodes(false);
      forEach(investigators, investigator => {
        const decision = condition.trauma === 'mental' ?
          campaignLog.hasMentalTrauma(investigator) :
          campaignLog.hasPhysicalTrauma(investigator);
        const index = findIndex(condition.options, option => option.boolCondition === decision);
        if (index !== -1) {
          choices[investigator] = [decision ? 'true' : 'false'];
        }
      });
      return investigatorResult(
        choices,
        map(condition.options, option => {
          return {
            ...option,
            id: option.boolCondition ? 'true' : 'false',
          };
        })
      );
    }
  }
}

export function hasCardConditionResult(
  condition: CardCondition,
  campaignLog: GuidedCampaignLog
): InvestigatorCardResult | BinaryResult {
  if (condition.investigator === 'each') {
    return investigatorCardConditionResult(condition, campaignLog);
  }
  return binaryCardConditionResult(condition, campaignLog);
}

export function binaryCardConditionResult(
  condition: BinaryCardCondition,
  campaignLog: GuidedCampaignLog
): BinaryResult {
  // Card conditions still care about killed investigators.
  const investigators = campaignLog.investigatorCodes(true);
  return binaryConditionResult(
    !!find(investigators, code => {
      switch (condition.investigator) {
        case 'defeated':
          if (!campaignLog.isDefeated(code)) {
            return false;
          }
          break;
        case 'any':
          break;
      }
      return campaignLog.hasCard(code, condition.card);
    }),
    condition.options
  );
}

export function investigatorCardConditionResult(
  condition: InvestigatorCardCondition,
  campaignLog: GuidedCampaignLog
): InvestigatorCardResult {
  const investigators = campaignLog.investigatorCodes(false);
  const choices: StringChoices = {};
  forEach(investigators, code => {
    const decision = campaignLog.hasCard(
      code,
      condition.card
    );
    const index = findIndex(condition.options, option => option.boolCondition === decision);
    if (index !== -1) {
      choices[code] = [decision ? 'true' : 'false'];
    }
  });
  const options: BoolOptionWithId[] = map(
    condition.options,
    option => {
      return {
        ...option,
        id: option.boolCondition ? 'true' : 'false',
      };
    }
  );
  return investigatorCardResult(choices, options);
}

function investigatorDataMatches(
  card: Card,
  field: 'trait' | 'faction' | 'code',
  value: string
): boolean {
  switch (field) {
    case 'trait':
      return !!card.real_traits_normalized &&
        card.real_traits_normalized.indexOf(`#${value.toLowerCase()}#`) !== -1;
    case 'faction':
      return card.factionCode() === value;
    case 'code':
      return card.code === value;
  }
}

export function campaignDataScenarioConditionResult(
  condition: CampaignDataScenarioCondition,
  campaignLog: GuidedCampaignLog
): BinaryResult {
  switch (condition.campaign_data) {
    case 'scenario_completed':
      return binaryConditionResult(
        campaignLog.scenarioStatus(condition.scenario) === 'completed',
        condition.options
      );
    case 'scenario_replayed': {
      const replayCount = campaignLog.campaignData.scenarioReplayCount[condition.scenario] || 0;
      return binaryConditionResult(
        replayCount > 0,
        condition.options
      );
    }
  }
}

function investigatorConditionMatches(
  investigatorData: 'trait' | 'faction' | 'code',
  options: StringOption[],
  campaignLog: GuidedCampaignLog
): InvestigatorResult {
  const investigators = campaignLog.investigators(false);
  const investigatorChoices: StringChoices = {};

  for (let i = 0; i < investigators.length; i++) {
    const card = investigators[i];
    const matches = filter(
      options,
      option => investigatorDataMatches(card, investigatorData, option.condition)
    );
    if (matches.length) {
      investigatorChoices[card.code] = map(matches, match => match.condition);
    }
  }
  return investigatorResult(
    investigatorChoices,
    map(options, option => {
      return {
        ...option,
        id: option.condition,
      };
    })
  );
}

export function investigatorConditionResult(
  condition: InvestigatorCondition,
  campaignLog: GuidedCampaignLog
): InvestigatorResult {
  return investigatorConditionMatches(
    condition.investigator_data,
    condition.options,
    campaignLog
  );
}

export function campaignDataChaosBagConditionResult(
  condition: CampaignDataChaosBagCondition,
  campaignLog: GuidedCampaignLog
): NumberResult {
  const chaosBag = campaignLog.chaosBag;
  const tokenCount: number = chaosBag[condition.token] || 0;
  return numberConditionResult(
    tokenCount,
    condition.options
  );
}

export function campaignDataInvestigatorConditionResult(
  condition: CampaignDataInvestigatorCondition,
  campaignLog: GuidedCampaignLog
): BinaryResult {
  const result = investigatorConditionMatches(
    condition.investigator_data,
    condition.options,
    campaignLog
  );
  let match: OptionWithId | undefined = undefined;
  forEach(result.investigatorChoices, (choices) => {
    if (choices.length) {
      match = find(result.options, option => option.id === choices[0]);
    }
  });
  if (match) {
    return {
      type: 'binary',
      decision: true,
      option: match,
    };
  }
  return {
    type: 'binary',
    decision: false,
    option: condition.default_option,
  };
}

export function campaignDataVersionConditionResult(
  condition: CampaignDataVersionCondition,
  campaignLog: GuidedCampaignLog
): BinaryResult {
  return binaryConditionResult(
    campaignLog.guideVersion >= condition.min_version,
    condition.options
  );
}

export function campaignDataConditionResult(
  condition: CampaignDataCondition,
  campaignLog: GuidedCampaignLog
): BinaryResult | StringResult | NumberResult {
  switch (condition.campaign_data) {
    case 'linked_campaign': {
      return binaryConditionResult(
        campaignLog.linked,
        condition.options
      );
    }
    case 'version':
      return campaignDataVersionConditionResult(
        condition,
        campaignLog
      );
    case 'scenario_replayed':
    case 'scenario_completed': {
      return campaignDataScenarioConditionResult(condition, campaignLog);
    }
    case 'difficulty': {
      return stringConditionResult(
        campaignLog.campaignData.difficulty || 'standard',
        condition.options
      );
    }
    case 'chaos_bag': {
      return campaignDataChaosBagConditionResult(condition, campaignLog);
    }
    case 'investigator':
      return campaignDataInvestigatorConditionResult(condition, campaignLog);
  }
}

export function multiConditionResult(
  condition: MultiCondition,
  campaignLog: GuidedCampaignLog
): BinaryResult {
  const count = sumBy(
    condition.conditions,
    subCondition => {
      switch (subCondition.type) {
        case 'has_card':
          return binaryCardConditionResult(subCondition, campaignLog).option ? 1 : 0;
        case 'campaign_log':
        case 'campaign_log_section_exists':
          return campaignLogConditionResult(subCondition, campaignLog).option ? 1 : 0;
        case 'campaign_log_count':
          return campaignLogCountConditionResult(subCondition, campaignLog).option ? 1 : 0;
        case 'campaign_data': {
          switch (subCondition.campaign_data) {
            case 'chaos_bag':
              return campaignDataConditionResult(subCondition, campaignLog).option ? 1 : 0;
            case 'version':
              return campaignDataVersionConditionResult(subCondition, campaignLog).option ? 1 : 0;
            case 'scenario_completed':
            case 'scenario_replayed':
              return campaignDataScenarioConditionResult(subCondition, campaignLog).option ? 1 : 0;
          }
        }
        case 'scenario_data': {
          switch (subCondition.scenario_data) {
            case 'resolution':
              return stringConditionResult(
                campaignLog.resolution(),
                subCondition.options
              ).option ? 1 : 0;
            default:
              return 0;
          }
        }
        case 'math':
          return mathConditionResult(subCondition, campaignLog).option ? 1 : 0;
      }
    });
  return binaryConditionResult(
    count >= condition.count,
    condition.options
  );
}

export function campaignLogCountConditionResult(condition: CampaignLogCountCondition, campaignLog: GuidedCampaignLog) {
  return numberConditionResult(
    campaignLog.count(condition.section, condition.id),
    condition.options,
    condition.default_option
  );
}


export function campaignLogInvestigatorCountConditionResult(condition: CampaignLogInvestigatorCountCondition, campaignLog: GuidedCampaignLog): InvestigatorResult | BinaryResult {
  const section = campaignLog.investigatorSections[condition.section] || {};
  const investigators = campaignLog.investigatorCodes(false);
  switch (condition.investigator) {
    case 'any': {
      const scenarionInvestigators = investigators;
      // Basically find the first option that matches *any* investigator;
      const option = find(condition.options, o => {
        return !!find(scenarionInvestigators, code => {
          const entrySection = section[code];
          const entry = find(entrySection?.entries || [], entry => entry.id === '$count' && entry.type === 'count');
          const count = (entry?.type === 'count' && entry.count) || 0;
          return o.numCondition === count;
        });
      });
      return {
        type: 'binary',
        decision: !!option,
        option: option || condition.default_option,
      };
    }
    case 'all': {
      const investigatorChoices: StringChoices = {};
      for (let i = 0; i < investigators.length; i++) {
        const investigator = investigators[i];
        const countEntry = find(section[investigator]?.entries || [], entry => entry.id === '$count' && entry.type === 'count');
        const count = (countEntry?.type === 'count' && countEntry.count) || 0;
        const matches = filter(condition.options, option => option.numCondition === count);
        if (matches.length) {
          investigatorChoices[investigator] = map(matches, match => `${match.numCondition}`);
        } else if (condition.default_option) {
          investigatorChoices[investigator] = ['default'];
        }
      }
      return investigatorResult(
        investigatorChoices,
        [
          ...map(condition.options, option => {
            return {
              ...option,
              id: `${option.numCondition}`,
            };
          }),
          ...(condition.default_option ? [{
            ...condition.default_option,
            id: 'default',
          }] : []),
        ]
      );
    }
  }
}

function mathConditionResult(condition: MathCondition, campaignLog: GuidedCampaignLog): BinaryResult | NumberResult {
  switch (condition.operation) {
    case 'equals':
      return mathEqualsConditionResult(condition, campaignLog);
    case 'sum': {
      const opA = getOperand(condition.opA, campaignLog);
      const opB = getOperand(condition.opB, campaignLog);
      return numberConditionResult(
        opA + opB,
        condition.options,
        condition.default_option
      );
    }
    case 'compare': {
      const opA = getOperand(condition.opA, campaignLog);
      const opB = getOperand(condition.opB, campaignLog);
      const value = opA - opB;
      const choice = find(condition.options, option => {
        if (value < 0) {
          return option.numCondition === -1;
        }
        if (value === 0) {
          return option.numCondition === 0;
        }
        return option.numCondition === 1;
      });
      return {
        type: 'number',
        number: value,
        option: choice,
      };
    }
  }
}

export function conditionResult(
  condition: Condition,
  campaignLog: GuidedCampaignLog
): ConditionResult {
  switch (condition.type) {
    case 'multi':
      return multiConditionResult(condition, campaignLog);
    case 'check_supplies':
      return checkSuppliesConditionResult(condition, campaignLog);
    case 'campaign_data':
      return campaignDataConditionResult(condition, campaignLog);
    case 'campaign_log_investigator_count':
      return campaignLogInvestigatorCountConditionResult(condition, campaignLog);
    case 'campaign_log_cards':
    case 'campaign_log_section_exists':
    case 'campaign_log':
      return campaignLogConditionResult(condition, campaignLog);
    case 'campaign_log_count':
      return campaignLogCountConditionResult(condition, campaignLog);
    case 'math':
      return mathConditionResult(condition, campaignLog);
    case 'campaign_data':
      return campaignDataConditionResult(condition, campaignLog);
    case 'has_card':
      return hasCardConditionResult(condition, campaignLog);
    case 'trauma':
      return killedTraumaConditionResult(condition, campaignLog);
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
        case 'investigator_status': {
          const investigators = campaignLog.investigatorCodes(false);
          const decision = !!find(investigators, code => {
            switch (condition.investigator) {
              case 'defeated':
                return campaignLog.isDefeated(code);
              case 'resigned':
                return campaignLog.resigned(code);
            }
          });
          return binaryConditionResult(
            decision,
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
