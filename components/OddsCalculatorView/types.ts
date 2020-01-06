import { ChaosTokenValue } from '../../constants';

interface InvestigatorElderSignValue {
  type: 'constant';
  value: ChaosTokenValue;
}

interface InvestigatorElderSignCounter {
  type: 'counter';
  text: string;
}

interface InvestigatorElderSignSwitch {
<<<<<<< Updated upstream
  type: 'switch';
=======
  type: 'switch',
>>>>>>> Stashed changes
  text: string;
  values: ChaosTokenValue[];
}

export type InvestigatorElderSign =
  InvestigatorElderSignValue |
  InvestigatorElderSignCounter |
  InvestigatorElderSignSwitch;
