import { filter, map } from 'lodash';
import { t } from 'ttag';

import { Resolution, InputStep } from 'data/scenario/types';

export const CHOOSE_RESOLUTION_STEP_ID = '$choose_resolution';
export function chooseResolutionStep(resolutions: Resolution[]): InputStep {
  return {
    id: CHOOSE_RESOLUTION_STEP_ID,
    type: 'input',
    title: 'Resolutions',
    text: 'Select resolution',
    bullet_type: 'none',
    input: {
      type: 'choose_one',
      style: 'picker',
      choices: map(
        filter(resolutions, resolution => resolution.id !== 'investigator_defeat'),
        resolution => {
          return {
            text: resolution.title,
            steps: [INVESTIGATOR_STATUS_STEP.id, `$r_${resolution.id}`],
          };
        }
      ),
    },
  };
}

export const LEAD_INVESTIGATOR_STEP: InputStep = {
  id: '$lead_investigator',
  type: 'input',
  text: t`Choose lead investigator`,
  input: {
    type: 'investigator_choice',
    investigator: 'any',
    choices: [
      {
        text: t`Lead Investigator`,
        effects: [
          {
            type: 'scenario_data',
            setting: 'lead_investigator',
            investigator: '$input_value',
          },
          {
            type: 'scenario_data',
            setting: 'scenario_status',
            status: 'started',
          },
        ],
      },
    ],
  },
};

export const INVESTIGATOR_STATUS_STEP: InputStep = {
  id: '$investigator_status',
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
