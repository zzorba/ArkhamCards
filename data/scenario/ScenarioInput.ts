import Realm from 'realm';

import { ChaosTokenType, ScenarioInvestigator } from './BasicTypes';
import ScenarioChoice from './ScenarioChoice';
import ScenarioCardQuery from './ScenarioCardQuery';
import ScenarioEffect from './ScenarioEffect';

export enum ScenarioInputType {
  INVESTIGATOR_CHOICE = 'investigator_choice',
  INVESTIGATOR_COUNTER = 'investigator_counter',
  CARD_CHOICE = 'card_choice',
  CHOOSE_ONE = 'choose_one',
  CHOOSE_MANY = 'choose_many',
  COUNTER = 'counter',
}

export default class ScenarioInput {
  public static schema: Realm.ObjectSchema = {
    name: 'ScenarioInput',
    properties: {
      type: 'string',
      choices: 'ScenarioChoice[]',
      query: 'ScenarioCardQuery[]',

      text: 'string?',
      effects: 'ScenarioEffect[]',
    },
  };
  public type!: ScenarioInputType;
  public choices!: ScenarioChoice[];
  public query!: ScenarioCardQuery[];
  public text!: string | null;
  public effects!: ScenarioEffect[];
}
