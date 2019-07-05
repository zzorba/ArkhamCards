import Realm from 'realm';

import { ChaosTokenType, ScenarioInvestigator } from './BasicTypes';
import ScenarioInput from './ScenarioInput';
import ScenarioCondition from './ScenarioCondition';
import ScenarioBranchOption from './ScenarioBranchOption';
import ScenarioEffect from './ScenarioEffect';
import ScenarioBullet from './ScenarioBullet';

export enum ScenarioStepType {
  INPUT = 'input',
  BRANCH = 'branch',
  ENCOUNTER_SETS = 'encounter_sets',
  STORY = 'story',
  RULE_REMINDER = 'rule_reminder',
}

export default class ScenarioStep {
  public static schema: Realm.ObjectSchema = {
    name: 'ScenarioInput',
    properties: {
      id: 'string',
      type: 'string?',
      title: 'string?',
      text: 'string?',
      subtext: 'string?',
      input: 'ScenarioInput?',

      condition: 'ScenarioCondition?',
      options: 'ScenarioBranchOption[]?',
      encounter_sets: 'string[]?',
      effects: 'ScenarioEffect[]?',
      steps: 'string[]?',
      bullets: 'ScenarioBullet[]?',
    },
  };
  public id!: string;
  public type!: ScenarioStepType | null;
  public title!: string | null;
  public text!: string | null;
  public subtext!: string | null;
  public input!: ScenarioInput | null;
  public condition!: ScenarioCondition | null;
  public options!: ScenarioBranchOption[] | null;
  public encounter_sets!: string[] | null;
  public effects!: ScenarioEffect[] | null;
  public steps!: string[] | null;
  public bullets!: ScenarioBullet[] | null;
}
