import { filter, find, map } from 'lodash';
import { c, t } from 'ttag';

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
  ChoiceIcon,
  GenericStep,
  RuleReminderStep,
} from '@data/scenario/types';
import ScenarioGuide from '@data/scenario/ScenarioGuide';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import CampaignStateHelper from '@data/scenario/CampaignStateHelper';
import { RANDOM_BASIC_WEAKNESS, getTarotCards } from '@app_constants';
import CampaignGuide from './CampaignGuide';
import { Gender_Enum } from '@generated/graphql/apollo-schema';

export const enum PlayingScenarioBranch {
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

export const CHOOSE_RESOLUTION_STEP_ID = '$choose_resolution';
function chooseResolutionStep(resolutions: Resolution[]): InputStep {
  const step: InputStep = {
    id: CHOOSE_RESOLUTION_STEP_ID,
    type: 'input',
    text: t`Choose resolution`,
    bullet_type: 'none',
    input: {
      type: 'choose_one',
      confirm_text: t`Resolution`,
      choices: map(
        filter(resolutions, resolution => resolution.id !== 'investigator_defeat'),
        resolution => {
          const choice: BinaryConditionalChoice = {
            id: resolution.id,
            large: true,
            text: `<b>${resolution.title}</b>`,
            description: resolution.description ? `<i>${resolution.description}</i>` : undefined,
            hidden: resolution.hidden,
            steps: [
              `$pr_${resolution.id}`,
            ],
          };
          return choice;
        }
      ),
    },
  };
  return step;
}

export const PROCEED_STEP_ID = '$proceed';
export const PROCEED_ALT_STEP_ID = '$proceed_alt';
export const EMBARK_STEP_ID = '$embark';
export const EMBARK_RETURN_STEP_ID = '$embark_return';

const CHOOSE_INVESTIGATORS_STEP_ID = '$choose_investigators';
const chooseInvestigatorsStep: InputStep = {
  id: CHOOSE_INVESTIGATORS_STEP_ID,
  type: 'input',
  input: {
    type: 'scenario_investigators',
    lead_investigator_effects: [
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
};

export const UPGRADE_DECKS_STEP_ID = '$upgrade_decks';
const upgradeDecksStep: InputStep = {
  id: UPGRADE_DECKS_STEP_ID,
  type: 'input',
  input: {
    type: 'upgrade_decks',
  },
};

const DRAW_STANDALONE_WEAKNESS_STEP_ID = '$draw_standalone_weakness';
function drawStandaloneWeaknessStep(): InputStep {
  return {
    id: DRAW_STANDALONE_WEAKNESS_STEP_ID,
    type: 'input',
    bullet_type: 'none',
    input: {
      type: 'investigator_counter',
      text: t`Draw Random Basic Weakness`,
      max: 5,
      effects: [
        {
          type: 'add_weakness',
          investigator: '$input_value',
          count: '$input_value',
          weakness_traits: [],
          select_traits: false,
          standalone: true,
        },
        {
          type: 'remove_card',
          investigator: '$input_value',
          card: RANDOM_BASIC_WEAKNESS,
          non_story: true,
        },
      ],
    },
  };
}

export const SELECTED_PARTNERS_CAMPAIGN_LOG_ID = '$selected_partners';
export const INVESTIGATOR_PARTNER_CAMPAIGN_LOG_ID_PREFIX = '$investigator_partner_';
const SAVE_STANDALONE_DECKS_ID = '$save_standalone_decks';
const saveStandaloneDecksStep: InputStep = {
  id: SAVE_STANDALONE_DECKS_ID,
  type: 'input',
  input: {
    type: 'save_decks',
  },
};

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
          text: t`Choose investigator to record trauma`,
          selected_text: t`Record trauma`,
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

export const PLAY_SCENARIO_STEP_ID = '$play_scenario';
const playScenarioStep: InputStep = {
  id: PLAY_SCENARIO_STEP_ID,
  type: 'input',
  input: {
    type: 'play_scenario',
  },
};

export const CHECK_CONTINUE_PLAY_SCENARIO = '$check_continue_play_scenario';

const EDIT_CAMPAIGN_LOG_STEP_ID = '$campaign_log';
function editCampaignLogStep(): InputStep {
  return {
    id: EDIT_CAMPAIGN_LOG_STEP_ID,
    type: 'input',
    text: t`In your Campaign Log, record that:`,
    input: {
      type: 'text_box',
      undo: true,
      effects: [
        {
          type: 'freeform_campaign_log',
          section: 'campaign_notes',
        },
      ],
    },
  };
}

export const LEAD_INVESTIGATOR_STEP_ID = '$lead_investigator';
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

function dynamicResolutionSteps(
  id: string,
  scenarioGuide: ScenarioGuide
): Step | undefined {
  const resolutions = scenarioGuide.resolutions();
  if (id.startsWith('$r_')) {
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
  };
  if (id.startsWith('$pr_')) {
    const resolutionId = id.substring(4);
    const resolution = find(resolutions, r => r.id === resolutionId);
    if (!resolution) {
      return undefined;
    }
    const hasInvestigatorDefeat = !!find(
      resolutions,
      resolution => resolution.id === 'investigator_defeat'
    );
    return {
      id,
      hidden: true,
      steps: [
        investigatorStatusStepId(resolution),
        ...(hasInvestigatorDefeat ? [CHECK_INVESTIGATOR_DEFEAT_RESOLUTION_ID] : []),
        `$r_${resolution.id}`,
        ...resolution.steps,
        ...(scenarioGuide.sideScenario ? scenarioGuide.campaignGuide.sideScenarioResolutionStepIds() : []),
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
  }
  return undefined;
}

const INVESTIGATOR_STATUS_STEP_SUFFIX = 'investigator_status';
function investigatorStatusStepId(resolution: Resolution): string {
  return `$r_${resolution.id}*${INVESTIGATOR_STATUS_STEP_SUFFIX}`;
}

function statusToString(
  status: InvestigatorStatus,
  gender?: Gender_Enum
): string {
  switch (status) {
    case 'alive':
      if (gender) {
        switch (gender) {
          case Gender_Enum.M: return c('masculine').t`Alive`;
          case Gender_Enum.F: return c('feminine').t`Alive`;
          case Gender_Enum.Nb: return c('nonbinary').t`Alive`;
        }
      }
      return t`Alive`;
    case 'resigned':
      if (gender) {
        switch (gender) {
          case Gender_Enum.M: return c('masculine').t`Resigned`;
          case Gender_Enum.F: return c('feminine').t`Resigned`;
          case Gender_Enum.Nb: return c('nonbinary').t`Resigned`;
        }
      }
      return t`Resigned`;
    case 'physical':
      if (gender) {
        switch (gender) {
          case Gender_Enum.M: return c('masculine').t`Defeated: physical trauma`;
          case Gender_Enum.F: return c('feminine').t`Defeated: physical trauma`;
          case Gender_Enum.Nb: return c('nonbinary').t`Defeated: physical trauma`;
        }
      }
      return t`Defeated: physical trauma`;
    case 'mental':
      if (gender) {
        switch (gender) {
          case Gender_Enum.M: return c('masculine').t`Defeated: mental trauma`;
          case Gender_Enum.F: return c('feminine').t`Defeated: mental trauma`;
          case Gender_Enum.Nb: return c('nonbinary').t`Defeated: mental trauma`;
        }
      }
      return t`Defeated: mental trauma`;
    case 'eliminated':
      if (gender) {
        switch (gender) {
          case Gender_Enum.M: return c('masculine').t`Defeated: no trauma`;
          case Gender_Enum.F: return c('feminine').t`Defeated: no trauma`;
          case Gender_Enum.Nb: return c('nonbinary').t`Defeated: no trauma`;
        }
      }
      return t`Defeated: no trauma`;
  }
}

function statusToSelectedString(status: InvestigatorStatus): string {
  switch (status) {
    case 'alive':
      return t`Alive`;
    case 'resigned':
      return t`Resigned`;
    case 'physical':
      return t`Physical trauma`;
    case 'mental':
      return t`Mental trauma`;
    case 'eliminated':
      return t`Defeated`;
  }
}


function statusToSelectedFeminineString(status: InvestigatorStatus): string {
  switch (status) {
    case 'alive':
      return c('feminine').t`Alive`;
    case 'resigned':
      return c('feminine').t`Resigned`;
    case 'physical':
      return c('feminine').t`Physical trauma`;
    case 'mental':
      return c('feminine').t`Mental trauma`;
    case 'eliminated':
      return c('feminine').t`Defeated`;
  }
}


function statusToSelectedNonBinaryString(status: InvestigatorStatus): string {
  switch (status) {
    case 'alive':
      return c('nonbinary').t`Alive`;
    case 'resigned':
      return c('nonbinary').t`Resigned`;
    case 'physical':
      return c('nonbinary').t`Physical trauma`;
    case 'mental':
      return c('nonbinary').t`Mental trauma`;
    case 'eliminated':
      return c('nonbinary').t`Defeated`;
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

const STATUS_ICON: {
  [key: string]: ChoiceIcon;
} = {
  alive: 'accept',
  resigned: 'resign',
  physical: 'physical',
  mental: 'mental',
  eliminated: 'dismiss',
};

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
        icon: STATUS_ICON[status],
        text: statusToString(status),
        selected_text: statusToSelectedString(status),
        selected_feminine_text: statusToSelectedFeminineString(status),
        selected_nonbinary_text: statusToSelectedNonBinaryString(status),
        masculine_text: statusToString(status, Gender_Enum.M),
        feminine_text: statusToString(status, Gender_Enum.F),
        nonbinary_text: statusToString(status, Gender_Enum.Nb),
        effects,
      };
    }
  );

  return {
    id,
    type: 'input',
    text: t`Status of investigators`,
    prompt_type: 'header',
    input: {
      type: 'investigator_choice',
      investigator: 'all',
      source: 'scenario',
      choices,
    },
  };
}

export const INTER_SCENARIO_CHANGES_STEP_ID = '$inter_scenario_changes';
const interScenarioChangesStep: Step = {
  id: INTER_SCENARIO_CHANGES_STEP_ID,
  type: 'internal',
  hidden: true,
};

export const CHECK_TAROT_READING = '$check_tarot_reading';
function checkTarotReadingStep(scenarioGuide: ScenarioGuide, campaignState: CampaignStateHelper): RuleReminderStep | GenericStep {
  const scenarioId = scenarioGuide.scenarioId();
  if (scenarioId) {
    const tarotReading = campaignState.scenarioTarotReading(scenarioId);
    if (tarotReading) {
      const card = getTarotCards()[tarotReading.id];
      if (card) {
        const title = tarotReading.inverted ? t`${card.title} (inverted)` : card.title;
        return {
          id: CHECK_TAROT_READING,
          type: 'rule_reminder',
          title: t`Destiny Tarot Reading`,
          text: `<b>${title}</b>\n${tarotReading.inverted ? card.inverted_text : card.text}`,
          bullets: card.id === 'judgement' ? [
            { text: t`If you are using the digital chaos bag in the app, be sure to enable the tarot option on the chaos bag screen.` },
          ] : undefined,
        };
      }
    }
  }
  return {
    id: CHECK_TAROT_READING,
    hidden: true,
  };
}

export function getFixedStep(
  id: string,
  scenarioGuide: ScenarioGuide,
  campaignState: CampaignStateHelper,
  campaignLog: GuidedCampaignLog,
  standalone: boolean,
  iteration: number | undefined
): Step | undefined {
  switch (id) {
    case CHOOSE_RESOLUTION_STEP_ID:
      return chooseResolutionStep(scenarioGuide.resolutions());
    case CHECK_TAROT_READING:
      return checkTarotReadingStep(scenarioGuide, campaignState);
    case CHECK_INVESTIGATOR_DEFEAT_RESOLUTION_ID:
      return checkInvestigatorDefeatStep(scenarioGuide.resolutions());
    case EMBARK_STEP_ID:
    case EMBARK_RETURN_STEP_ID:
      return {
        id,
        type: 'internal',
      };
    case PROCEED_STEP_ID:
    case PROCEED_ALT_STEP_ID: {
      const nextScenarioName = scenarioGuide.campaignGuide.nextScenarioName(
        campaignState,
        campaignLog
      );
      if (!nextScenarioName || standalone) {
        return {
          id,
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
        id,
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
      return interScenarioChangesStep;
    case EDIT_CAMPAIGN_LOG_STEP_ID:
      return editCampaignLogStep();
    case DRAW_WEAKNESS_STEP_ID:
      return drawWeaknessStep();
    case DRAW_STANDALONE_WEAKNESS_STEP_ID:
      return drawStandaloneWeaknessStep();
    case PLAY_SCENARIO_STEP_ID:
      return playScenarioStep;
    case CHECK_CONTINUE_PLAY_SCENARIO: {
      const step: BranchStep = {
        id: CHECK_CONTINUE_PLAY_SCENARIO,
        hidden: true,
        type: 'branch',
        condition: {
          type: 'scenario_data',
          scenario_data: 'has_resolution',
          options: [
            {
              boolCondition: false,
              steps: [iteration !== undefined ? `${PLAY_SCENARIO_STEP_ID}#${iteration}` : PLAY_SCENARIO_STEP_ID],
            }
          ]
        },
      };
      return step;
    }
    case CHOOSE_INVESTIGATORS_STEP_ID:
      return chooseInvestigatorsStep;
    case UPGRADE_DECKS_STEP_ID:
      return upgradeDecksStep;
    case LEAD_INVESTIGATOR_STEP_ID:
      return leadInvestigatorStep();
    case SAVE_STANDALONE_DECKS_ID:
      return saveStandaloneDecksStep;
    case RECORD_TRAUMA_STEP_ID:
      return recordTraumaStep();
    default:
      return dynamicResolutionSteps(id, scenarioGuide);
  }
}

export function scenarioStepIds(campaignGuide: CampaignGuide, scenario: Scenario, standalone?: boolean) {
  const sharedCampaignSetup = campaignGuide.scenarioSetupStepIds();
  return (scenario.type === 'interlude' || scenario.type === 'epilogue') ?
    [
      ...(scenario.side_scenario_type ? sharedCampaignSetup : []),
      ...scenario.setup,
      INTER_SCENARIO_CHANGES_STEP_ID,
      PROCEED_STEP_ID,
    ] : [
      CHOOSE_INVESTIGATORS_STEP_ID,
      ...(scenario.side_scenario_type ? sharedCampaignSetup : []),
      ...(standalone ? [DRAW_STANDALONE_WEAKNESS_STEP_ID, SAVE_STANDALONE_DECKS_ID] : []),
      ...((standalone && scenario.standalone_setup) || scenario.setup),
    ];
}
