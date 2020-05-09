import { ChaosTokenValue } from 'constants';

interface InvestigatorElderSignValue {
  type: 'constant';
  value: ChaosTokenValue;
}

interface InvestigatorElderSignCounter {
  type: 'counter';
  text: string;
}

interface InvestigatorElderSignSwitch {
  type: 'switch';
  text: string;
  values: ChaosTokenValue[];
}

export type InvestigatorElderSign =
  InvestigatorElderSignValue |
  InvestigatorElderSignCounter |
  InvestigatorElderSignSwitch;
