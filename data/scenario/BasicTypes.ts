export enum ScenarioInvestigator {
  LEAD_INVESTIGATOR = 'lead_investigator',
  ALL = 'all',
  ANY = 'any',
  CHOICE = 'choice',
  DEFEATED = 'defeated',
  INPUT_VALUE = 'input_value',
};

export type ChaosTokenType =
  '+1' | '0' | '-1' | '-2' | '-3' |
  '-4' | '-5' | '-6' | '-7' | '-8' |
  'skull' | 'cultist' | 'tablet' | 'elder_thing' |
  'auto_fail' | 'elder_sign';
