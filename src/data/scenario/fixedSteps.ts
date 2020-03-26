import { t } from 'ttag';
import { InputStep } from 'data/scenario/types';

export const INVESTIGATOR_STATUS_STEP: InputStep = {
  id: 'investigator_status',
  type: 'input',
  text: t`Investigator status at end of scenario:`,
  input: {
    type: 'investigator_choice',
    investigator: 'all',
    choices: [
      {
        text: t`Alive`,
        effects: [
          {
            type: 'scenario_data',
            setting: 'investigator_status',
            investigator: '$input_value',
            investigator_status: 'alive',
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
            investigator_status: 'resigned',
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
            investigator_status: 'physical',
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
            investigator_status: 'mental',
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
            investigator_status: 'eliminated',
          },
        ],
      },
    ],
  },
};
