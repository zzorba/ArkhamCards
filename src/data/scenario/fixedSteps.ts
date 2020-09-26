import { filter, find, map } from 'lodash';
import { t } from 'ttag';

import {
  BinaryConditionalChoice,
  InvestigatorConditionalChoice,
  InvestigatorStatus,
  BranchStep,
  Effect,
  Resolution,
  InputStep,
  Step,
  Scenario,
} from '@data/scenario/types';
import ScenarioGuide from '@data/scenario/ScenarioGuide';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import CampaignStateHelper from '@data/scenario/CampaignStateHelper';

export enum PlayingScenarioBranch {
  CAMPAIGN_LOG = -1,
  RESOLUTION = -2,
  DRAW_WEAKNESS = -3,
  RECORD_TRAUMA = -4,
}

const CHECK_INVESTIGATOR_DEFEAT_RESOLUTION_ID = '$check_investigator_defeat';
function checkInvestigatorDefeatStep(resolutions: Resolution[]): BranchStep {
  const investigatorDefeat = find(resolutions, resolution => resolution.id === 'investigator_defeat');
  return {
    id: CHECK_INVESTIGATOR_DEFEAT_RESOLUTION_ID,
    type: 'branch',
    condition: {
      type: 'scenario_data',
      scenario_data: 'investigator_status',
      investigator: 'defeated',
      options: [
        {
          boolCondition: true,
          steps: [
            '$r_investigator_defeat',
            ...(investigatorDefeat ? investigatorDefeat.steps : []),
          ],
        },
      ],
    },
  };
}

const CHOOSE_RESOLUTION_STEP_ID = '$choose_resolution';
function chooseResolutionStep(resolutions: Resolution[]): InputStep {
  const hasInvestigatorDefeat = !!find(
    resolutions,
    resolution => resolution.id === 'investigator_defeat'
  );
  const step: InputStep = {
    id: CHOOSE_RESOLUTION_STEP_ID,
    type: 'input',
    title: t`Resolutions`,
    text: t`Select resolution`,
    bullet_type: 'none',
    input: {
      type: 'choose_one',
      style: 'picker',
      choices: map(
        filter(resolutions, resolution => resolution.id !== 'investigator_defeat'),
        resolution => {
          const choice: BinaryConditionalChoice = {
            id: resolution.id,
            text: resolution.title,
            steps: [
              investigatorStatusStepId(resolution),
              ...(hasInvestigatorDefeat ? [CHECK_INVESTIGATOR_DEFEAT_RESOLUTION_ID] : []),
              `$r_${resolution.id}`,
              ...resolution.steps,
              INTER_SCENARIO_CHANGES_STEP_ID,
              PROCEED_STEP_ID,
            ],
            effects: [{
              type: 'scenario_data',
              setting: 'scenario_status',
              status: 'resolution',
              resolution: resolution.id,
            }],
          };
          return choice;
        }
      ),
    },
  };
  return step;
}

const PROCEED_STEP_ID = '$proceed';

const CHOOSE_INVESTIGATORS_STEP_ID = '$choose_investigators';
function chooseInvestigatorsStep(): InputStep {
  return {
    id: CHOOSE_INVESTIGATORS_STEP_ID,
    type: 'input',
    input: {
      type: 'scenario_investigators',
    },
  };
}

const UPGRADE_DECKS_STEP_ID = '$upgrade_decks';
function upgradeDecksStep(): InputStep {
  return {
    id: UPGRADE_DECKS_STEP_ID,
    type: 'input',
    input: {
      type: 'upgrade_decks',
    },
  };
}

const DRAW_WEAKNESS_STEP_ID = '$draw_weakness';
function drawWeaknessStep(): InputStep {
  return {
    id: DRAW_WEAKNESS_STEP_ID,
    type: 'input',
    input: {
      type: 'investigator_choice',
      source: 'scenario',
      investigator: 'all',
      choices: [
        {
          id: 'draw_weakness',
          text: t`Draw Weakness`,
          effects: [
            {
              type: 'add_weakness',
              investigator: '$input_value',
              weakness_traits: [],
              select_traits: true,
            },
          ],
        },
      ],
    },
  };
}

const RECORD_TRAUMA_STEP_ID = '$record_trauma';
function recordTraumaStep(): InputStep {
  return {
    id: RECORD_TRAUMA_STEP_ID,
    type: 'input',
    bullet_type: 'none',
    text: t`<b>Note:</b> Trauma from investigator defeat is handled during scenario resolution.`,
    input: {
      type: 'investigator_choice',
      source: 'scenario',
      investigator: 'all',
      choices: [
        {
          id: 'record_trauma',
          text: t`Record Trauma`,
          effects: [
            {
              type: 'trauma',
              investigator: '$input_value',
              mental_or_physical: 1,
              hidden: true,
            },
          ],
        },
      ],
    },
  };
}

const PLAY_SCENARIO_STEP_ID = '$play_scenario';
function playScenarioStep(): InputStep {
  return {
    id: PLAY_SCENARIO_STEP_ID,
    type: 'input',
    input: {
      type: 'play_scenario',
    },
  };
}

const EDIT_CAMPAIGN_LOG_STEP_ID = '$campaign_log';
function editCampaignLogStep(): InputStep {
  return {
    id: EDIT_CAMPAIGN_LOG_STEP_ID,
    type: 'input',
    text: t`In your Campaign Log, record that:`,
    input: {
      type: 'text_box',
      effects: [
        {
          type: 'freeform_campaign_log',
          section: 'campaign_notes',
        },
      ],
    },
  };
}

const LEAD_INVESTIGATOR_STEP_ID = '$lead_investigator';
function leadInvestigatorStep(): InputStep {
  return {
    id: LEAD_INVESTIGATOR_STEP_ID,
    type: 'input',
    text: t`Choose lead investigator`,
    input: {
      type: 'investigator_choice',
      investigator: 'any',
      source: 'scenario',
      choices: [
        {
          id: 'lead',
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
}

function resolutionStep(
  id: string,
  resolutions: Resolution[]
): Step | undefined {
  if (!id.startsWith('$r_')) {
    return undefined;
  }
  const statusStep = investigatorStatusStep(id, resolutions);
  if (statusStep) {
    return statusStep;
  }
  const resolution = id.substring(3);
  return {
    id,
    type: 'resolution',
    generated: true,
    resolution,
  };
}

const INVESTIGATOR_STATUS_STEP_SUFFIX = 'investigator_status';
function investigatorStatusStepId(resolution: Resolution): string {
  return `$r_${resolution.id}*${INVESTIGATOR_STATUS_STEP_SUFFIX}`;
}

function statusToString(
  status: InvestigatorStatus
): string {
  switch (status) {
    case 'alive':
      return t`Alive`;
    case 'resigned':
      return t`Resigned`;
    case 'physical':
      return t`Defeated: physical trauma`;
    case 'mental':
      return t`Defeated: mental trauma`;
    case 'eliminated':
      return t`Defeated: no trauma`;
  }
}

function investigatorStatusStep(
  id: string,
  resolutions: Resolution[]
): InputStep | undefined {
  if (!id.startsWith('$r_') || id.indexOf('*') === -1) {
    return undefined;
  }
  const [resolutionId, stepType] = id.substring(3).split('*');
  if (stepType !== INVESTIGATOR_STATUS_STEP_SUFFIX) {
    return undefined;
  }
  const resolution = find(resolutions, r => r.id === resolutionId);
  if (!resolution) {
    return undefined;
  }
  return createInvestigatorStatusStep(id, resolution.investigator_status);
}

export function createInvestigatorStatusStep(
  id: string,
  customStatus?: InvestigatorStatus[]
): InputStep {
  const defaultStatuses: InvestigatorStatus[] = [
    'alive',
    'resigned',
    'physical',
    'mental',
    'eliminated',
  ];
  const choices: InvestigatorConditionalChoice[] = map(
    customStatus || defaultStatuses,
    status => {
      const effects: Effect[] = [
        {
          type: 'scenario_data',
          setting: 'investigator_status',
          investigator: '$input_value',
          investigator_status: status,
        },
      ];
      if (status === 'physical' || status === 'mental') {
        effects.push({
          type: 'trauma',
          investigator: '$input_value',
          physical: status === 'physical' ? 1 : 0,
          mental: status === 'mental' ? 1 : 0,
          hidden: true,
        });
      }
      return {
        id: status,
        text: statusToString(status),
        effects,
      };
    }
  );

  return {
    id,
    type: 'input',
    text: t`Investigator status at end of scenario:`,
    input: {
      type: 'investigator_choice',
      investigator: 'all',
      source: 'scenario',
      choices,
    },
  };
}

export const INTER_SCENARIO_CHANGES_STEP_ID = '$inter_scenario_changes';
function interScenarioChangesStep(): Step {
  return {
    id: INTER_SCENARIO_CHANGES_STEP_ID,
    type: 'internal',
    hidden: true,
  };
}

export function getFixedStep(
  id: string,
  scenarioGuide: ScenarioGuide,
  campaignState: CampaignStateHelper,
  campaignLog: GuidedCampaignLog
): Step | undefined {
  switch (id) {
    case CHOOSE_RESOLUTION_STEP_ID:
      return chooseResolutionStep(scenarioGuide.resolutions());
    case CHECK_INVESTIGATOR_DEFEAT_RESOLUTION_ID:
      return checkInvestigatorDefeatStep(scenarioGuide.resolutions());
    case PROCEED_STEP_ID: {
      const nextScenarioName = scenarioGuide.campaignGuide.nextScenarioName(
        campaignState,
        campaignLog
      );
      if (!nextScenarioName) {
        return {
          id: PROCEED_STEP_ID,
          hidden: true,
          effects: [
            {
              type: 'scenario_data',
              setting: 'scenario_status',
              status: 'completed',
            },
          ],
        };
      }
      return {
        id: PROCEED_STEP_ID,
        text: t`Proceed to <b>${nextScenarioName}</b>.`,
        effects: [
          {
            type: 'scenario_data',
            setting: 'scenario_status',
            status: 'completed',
          },
        ],
      };
    }
    case INTER_SCENARIO_CHANGES_STEP_ID:
      return interScenarioChangesStep();
    case EDIT_CAMPAIGN_LOG_STEP_ID:
      return editCampaignLogStep();
    case DRAW_WEAKNESS_STEP_ID:
      return drawWeaknessStep();
    case PLAY_SCENARIO_STEP_ID:
      return playScenarioStep();
    case CHOOSE_INVESTIGATORS_STEP_ID:
      return chooseInvestigatorsStep();
    case UPGRADE_DECKS_STEP_ID:
      return upgradeDecksStep();
    case LEAD_INVESTIGATOR_STEP_ID:
      return leadInvestigatorStep();
    case RECORD_TRAUMA_STEP_ID:
      return recordTraumaStep();
    default:
      return resolutionStep(id, scenarioGuide.resolutions());
  }
}

export function scenarioStepIds(scenario: Scenario) {
  return (scenario.type === 'interlude' || scenario.type === 'epilogue') ?
    [
      ...scenario.setup,
      INTER_SCENARIO_CHANGES_STEP_ID,
      PROCEED_STEP_ID,
    ] : [
      CHOOSE_INVESTIGATORS_STEP_ID,
      LEAD_INVESTIGATOR_STEP_ID,
      ...scenario.setup,
    ];
}
