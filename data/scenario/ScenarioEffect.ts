import Realm from 'realm';

import { ChaosTokenType, ScenarioInvestigator } from './BasicTypes';

export enum ScenarioEffectType {
  EARN_XP = 'earn_xp',
  ADD_CARD = 'add_card',
  REMOVE_CARD = 'remove_card',
  CAMPAIGN_DATA = 'campaign_data',
  ADD_CHAOS_TOKEN = 'add_chaos_token',
  REMOVE_CHAOS_TOKEN = 'remove_chaos_token',
  CAMPAIGN_LOG = 'campaign_log',
  TRAUMA = 'trauma',
}

export enum ScenarioCampaignSetting {
  RESULT = 'result',
  NEXT_SCENARION = 'next_scenario',
  CHOOSE_INVESTIGATORS = 'choose_investigators',
}

export default class ScenarioEffect {
  public static schema: Realm.ObjectSchema = {
    name: 'ScenarioEffect',
    properties: {
      type: 'string',
      investigator: 'string?',
      // earn_xp
      bonus: 'int?',
      // add/remove_card
      card: 'string?',
      weakness_traits: 'string[]',
      setting: 'string?',
      // next_scenario
      scenario: 'string?',

      // add/remove tokens
      tokens: 'string[]',

      // campaign log
      section: 'string?',
      id: 'string?',
      count: 'int?',
      text: 'string?',
      cross_out: 'bool?',

      // trauma
      mental: 'int?',
      physical: 'int?',
      killed: 'bool?',
      insane: 'bool?',
    },
  };
  public type!: ScenarioEffectType;
  public investigator!: ScenarioInvestigator | null;
  public bonus!: number | null;
  public card!: string | null;
  public weakness_traits?: string[];

  public setting!: ScenarioCampaignSetting | null;
  public scenario!: string | null;
  public tokens?: ChaosTokenType[];

  public section!: string | null;
  public id!: string | null;
  public count!: number | null;
  public text!: string | null;
  public cross_out!: boolean | null;

  public mental!: number | null;
  public physical!: number | null;
  public insane!: boolean | null;
  public killed!: boolean | null;
}
