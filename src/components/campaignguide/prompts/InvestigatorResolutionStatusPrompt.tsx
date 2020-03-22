import React from 'react';
import {
  ScrollView,
} from 'react-native';
import { t } from 'ttag';

import InvestigatorChoicePrompt from './InvestigatorChoicePrompt';
import { EffectsChoice } from 'data/scenario/types';
import { INVESTIGATOR_STATUS_ID, InvestigatorResolutionStatus } from 'data/scenario';

const INVESTIGATOR_STATUS_CHOICES: EffectsChoice[] = [
  {
    text: t`Alive`,
    effects: [
      {
        type: 'scenario_data',
        setting: 'investigator_status',
        investigator: '$input_value',
        investigator_status: InvestigatorResolutionStatus.ALIVE,
      },
    ],
  },
  {
    text: t`Resigned`,
    effects: [
      {
        type: 'scenario_data',
        setting: 'investigator_status',
        investigator: '$input_value',
        investigator_status: InvestigatorResolutionStatus.RESIGNED,
      },
    ],
  },
  {
    text: t`Eliminated by Damage`,
    effects: [
      {
        type: 'scenario_data',
        setting: 'investigator_status',
        investigator: '$input_value',
        investigator_status: InvestigatorResolutionStatus.DEFEATED_PHYSICAL,
      },
      {
        type: 'trauma',
        investigator: '$input_value',
        physical: 1,
      },
    ],
  },
  {
    text: t`Eliminated by Horror`,
    effects: [
      {
        type: 'scenario_data',
        setting: 'investigator_status',
        investigator: '$input_value',
        investigator_status: InvestigatorResolutionStatus.DEFEATED_MENTAL
      },
      {
        type: 'trauma',
        investigator: '$input_value',
        mental: 1,
      },
    ],
  },
  {
    text: t`Eliminated by Scenario`,
    effects: [
      {
        type: 'scenario_data',
        setting: 'investigator_status',
        investigator: '$input_value',
        investigator_status: InvestigatorResolutionStatus.DEFEATED_SCENARIO,
      },
    ],
  },
];

export default function InvestigatorResolutionStatusPrompt() {
  return (
    <InvestigatorChoicePrompt
      id={INVESTIGATOR_STATUS_ID}
      text={t`Investigator status at end of scenario:`}
      choices={INVESTIGATOR_STATUS_CHOICES}
      bulletType="none"
    />
  );
}
