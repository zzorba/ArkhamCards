import Realm from 'realm';

import ScenarioCampaignLogOperand from './ScenarioCampaignLogOperand';
import { ScenarioInvestigator } from './BasicTypes';

export enum ScenarioConditionType {
  TRAUMA = 'trauma',
  SCENARIO_DATA = 'scenario_data',
  CAMPAIGN_DATA = 'campaign_data',
  HAS_CARD = 'has_card',
  CAMPAIGN_LOG = 'campaign_log',
  CAMPAIGN_LOG_MATH = 'campaign_log_math',
}

export enum TraumaConditionType {
  KILLED = 'killed',
}

export enum ScenarioDataType {
  PLAYER_COUNT = 'player_count',
  INVESTIGATOR = 'investigator',
  ANY_RESIGNED = 'any_resigned',
}

export enum CampaignDataType {
  DIFFICULTY = 'difficulty',
  SCENARIO_COMPLETED = 'scenario_completed',
}

export enum CampaignLogMathOperation {
  COMPARE = 'compare',
  SUM = 'sum',
}

export default class ScenarioEffect {
  public static schema: Realm.ObjectSchema = {
    name: 'ScenarioCondition',
    properties: {
      type: 'string',
      investigator: 'string?',
      trauma: 'string?',
      scenario_data: 'string?',
      campaign_data: 'string?',
      scenario: 'string?',
      card: 'string?',

      section: 'string?',
      id: 'string?',

      opA: 'ScenarioCampaignLogOperand?',
      opB: 'ScenarioCampaignLogOperand?',
      operation: 'string?',
    },
  };
  public type!: ScenarioConditionType;
  public investigator!: ScenarioInvestigator | null;
  public trauma!: TraumaConditionType | null;
  public scenario_data!: ScenarioDataType | null;
  public campaign_data!: CampaignDataType | null;
  public scenario!: string | null;

  public card!: string | null;

  public section!: string | null;
  public id!: string | null;

  public opA!: ScenarioCampaignLogOperand | null;
  public opB!: ScenarioCampaignLogOperand | null;
  public operation!: CampaignLogMathOperation | null;
}
