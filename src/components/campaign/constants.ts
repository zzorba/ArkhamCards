import { find, map } from 'lodash';
import { t } from 'ttag';

import {
  CUSTOM,
  CORE,
  RTNOTZ,
  DWL,
  RTDWL,
  PTC,
  RTPTC,
  TFA,
  TCU,
  TDEA,
  TDEB,
  CampaignDifficulty,
  CampaignCycleCode,
  CustomCampaignLog,
  ScenarioResult,
} from 'actions/types';
import { ChaosBag } from 'constants';
import Card from 'data/Card';

export function difficultyString(difficulty: CampaignDifficulty): string {
  switch (difficulty) {
    case CampaignDifficulty.EASY: return t`Easy`;
    case CampaignDifficulty.STANDARD: return t`Standard`;
    case CampaignDifficulty.HARD: return t`Hard`;
    case CampaignDifficulty.EXPERT: return t`Expert`;
    default: {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const _exhaustiveCheck: never = difficulty;
      return 'Unknown';
    }
  }
}

export function campaignName(cycleCode: CampaignCycleCode): string | null {
  switch (cycleCode) {
    case CORE: return t`Night of the Zealot`;
    case RTNOTZ: return t`Return to the Night of the Zealot`;
    case DWL: return t`The Dunwich Legacy`;
    case RTDWL: return t`Return to The Dunwich Legacy`;
    case PTC: return t`The Path To Carcosa`;
    case RTPTC: return t`Return to The Path to Carcosa`;
    case TFA: return t`The Forgotten Age`;
    case TCU: return t`The Circle Undone`;
    case TDEA: return t`The Dream-Quest`;
    case TDEB: return t`The Web of Dreams`;
    case CUSTOM: return null;
    default: {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const _exhaustiveCheck: never = cycleCode;
      return null;
    }
  }
}

export interface Scenario {
  name: string;
  code: string;
  pack_code?: string;
  interlude?: boolean;
  legacy_codes?: string[];
}

export function scenarioFromCard(card: Card): Scenario | null {
  if (!card.encounter_code) {
    return null;
  }
  return {
    name: card.renderName,
    code: card.encounter_code,
    pack_code: card.pack_code,
  };
}

export function completedScenario(
  scenarioResults?: ScenarioResult[]
): (scenario: Scenario) => boolean {
  const finishedScenarios = new Set(
    map(scenarioResults || [], result => result.scenarioCode)
  );
  const finishedScenarioNames = new Set(
    map(scenarioResults || [], result => result.scenario)
  );
  return (scenario: Scenario) => (
    finishedScenarioNames.has(scenario.name) ||
    finishedScenarios.has(scenario.code) ||
    !!find(scenario.legacy_codes || [],
      code => finishedScenarios.has(code)
    )
  );
}

export function campaignScenarios(cycleCode: CampaignCycleCode): Scenario[] {
  switch (cycleCode) {
    case CORE: return [
      { name: t`The Gathering`, code: 'torch', pack_code: 'core' },
      { name: t`The Midnight Masks`, code: 'arkham', pack_code: 'core' },
      { name: t`The Devourer Below`, code: 'tentacles', pack_code: 'core' },
    ];
    case DWL: return [
      { name: t`Prologue`, code: 'dwl_prologue', interlude: true },
      { name: t`Extracurricular Activity`, code: 'extracurricular_activity', pack_code: 'dwl' },
      { name: t`The House Always Wins`, code: 'the_house_always_wins', pack_code: 'dwl' },
      { name: t`Armitage’s Fate`, code: 'armitages_fate', interlude: true },
      { name: t`The Miskatonic Museum`, code: 'the_miskatonic_museum', pack_code: 'tmm' },
      { name: t`Essex County Express`, code: 'essex_county_express', pack_code: 'tece' },
      { name: t`Blood on the Altar`, code: 'blood_on_the_altar', pack_code: 'bota' },
      { name: t`The Survivors`, code: 'dwl_interlude2', interlude: true },
      { name: t`Undimensioned and Unseen`, code: 'undimensioned_and_unseen', pack_code: 'uau' },
      { name: t`Where Doom Awaits`, code: 'where_doom_awaits', pack_code: 'wda' },
      { name: t`Lost in Time and Space`, code: 'lost_in_time_and_space', pack_code: 'litas' },
      { name: t`Epilogue`, code: 'dwl_epilogue', interlude: true },
    ];
    case RTDWL: return [
      { name: t`Prologue`, code: 'dwl_prologue', interlude: true },
      { name: t`Return to Extracurricular Activity`, code: 'return_to_extracurricular_activity', pack_code: 'rtdwl' },
      { name: t`Return to The House Always Wins`, code: 'return_to_the_house_always_wins', pack_code: 'rtdwl' },
      { name: t`Armitage’s Fate`, code: 'armitages_fate', interlude: true },
      { name: t`Return to The Miskatonic Museum`, code: 'return_to_the_miskatonic_museum', pack_code: 'rtdwl' },
      { name: t`Return to Essex County Express`, code: 'return_to_essex_county_express', pack_code: 'rtdwl' },
      { name: t`Return to Blood on the Altar`, code: 'return_to_blood_on_the_altar', pack_code: 'rtdwl' },
      { name: t`The Survivors`, code: 'dwl_interlude2', interlude: true },
      { name: t`Return to Undimensioned and Unseen`, code: 'return_to_undimensioned_and_unseen', pack_code: 'rtdwl' },
      { name: t`Return to Where Doom Awaits`, code: 'return_to_where_doom_awaits', pack_code: 'rtdwl' },
      { name: t`Return to Lost in Time and Space`, code: 'return_to_lost_in_time_and_space', pack_code: 'rtdwl' },
      { name: t`Epilogue`, code: 'dwl_epilogue', interlude: true },
    ];
    case PTC: return [
      { name: t`Prologue`, code: 'ptc_prologue', interlude: true },
      { name: t`Curtain Call`, code: 'curtain_call', pack_code: 'ptc' },
      { name: t`The Last King`, code: 'the_last_king', pack_code: 'ptc' },
      { name: t`Lunacy’s Reward`, code: 'ptc_interlude1', interlude: true },
      { name: t`Echoes of the Past`, code: 'echoes_of_the_past', pack_code: 'eotp' },
      { name: t`The Unspeakable Oath`, code: 'the_unspeakable_oath', pack_code: 'tuo' },
      { name: t`Lost Soul`, code: 'ptc_interlude2', interlude: true },
      { name: t`A Phantom of Truth`, code: 'a_phantom_of_truth', pack_code: 'apot' },
      { name: t`The Pallid Mask`, code: 'the_pallid_mask', pack_code: 'tpm' },
      { name: t`Black Stars Rise`, code: 'black_stars_rise', pack_code: 'bsr' },
      { name: t`Dim Carcosa`, code: 'dim_carcosa', pack_code: 'dca' },
      { name: t`Epilogue`, code: 'ptc_epilogue', interlude: true },
    ];
    case RTPTC: return [
      { name: t`Prologue`, code: 'ptc_prologue', interlude: true },
      { name: t`Return to Curtain Call`, code: 'return_to_curtain_call', pack_code: 'rtptc' },
      { name: t`Return to The Last King`, code: 'return_to_the_last_king', pack_code: 'rtptc' },
      { name: t`Lunacy’s Reward`, code: 'ptc_interlude1', interlude: true },
      { name: t`Return to Echoes of the Past`, code: 'return_to_echoes_of_the_past', pack_code: 'rtptc' },
      { name: t`Return to The Unspeakable Oath`, code: 'return_to_the_unspeakable_oath', pack_code: 'rtptc' },
      { name: t`Lost Soul`, code: 'ptc_interlude2', interlude: true },
      { name: t`Return to A Phantom of Truth`, code: 'return_to_a_phantom_of_truth', pack_code: 'rtptc' },
      { name: t`Return to The Pallid Mask`, code: 'return_to_the_pallid_mask', pack_code: 'rtptc' },
      { name: t`Return to Black Stars Rise`, code: 'return_to_black_stars_rise', pack_code: 'rtptc' },
      { name: t`Return to Dim Carcosa`, code: 'return_to_dim_carcosa', pack_code: 'rtptc' },
      { name: t`Epilogue`, code: 'ptc_epilogue', interlude: true },
    ];
    case TFA: return [
      { name: t`Prologue`, code: 'tfa_prologue', interlude: true },
      { name: t`The Untamed Wilds`, code: 'wilds', pack_code: 'tfa' },
      { name: t`Restless Nights`, code: 'tfa_interlude1', interlude: true },
      { name: t`The Doom of Eztli`, code: 'eztli', pack_code: 'tfa' },
      { name: t`Expedition’s End`, code: 'tfa_interlude2', interlude: true },
      { name: t`Threads of Fate`, code: 'threads_of_fate', pack_code: 'tof' },
      { name: t`The Boundary Beyond`, code: 'the_boundary_beyond', pack_code: 'tbb' },
      { name: t`The Jungle Beckons`, code: 'tfa_interlude3', interlude: true },
      { name: t`Heart of the Elders`, code: 'heart_of_the_elders', pack_code: 'hote' },
      { name: t`The City of Archives`, code: 'the_city_of_archives', pack_code: 'tcoa' },
      { name: t`Those Held Captive`, code: 'tfa_interlude4', interlude: true },
      { name: t`The Depths of Yoth`, code: 'the_depths_of_yoth', pack_code: 'tdoy' },
      { name: t`The Darkness`, code: 'tfa_interlude5', interlude: true },
      { name: t`Shattered Aeons`, code: 'shattered_aeons', pack_code: 'sha' },
      { name: t`Epilogue`, code: 'tfa_epilogue', interlude: true },
    ];
    case TCU: return [
      {
        name: t`Prologue: Disappearance at the Twilight Estate`,
        code: 'disappearance_at_the_twilight_estate',
        legacy_codes: ['tcu_prologue'],
        pack_code: 'tcu',
      },
      { name: t`The Witching Hour`, code: 'the_witching_hour', pack_code: 'tcu' },
      {
        name: t`At Death's Doorstep`,
        legacy_codes: ['at_deaths_doorstep_23', 'at_deaths_doorstep_1'],
        code: 'at_deaths_doorstep',
        pack_code: 'tcu',
      },
      { name: t`The Price of Progress`, code: 'tcu_interlude_2', interlude: true },
      { name: t`The Secret Name`, code: 'the_secret_name', pack_code: 'tsn' },
      { name: t`The Wages of Sin`, code: 'the_wages_of_sin', pack_code: 'tws' },
      { name: t`For the Greater Good`, code: 'for_the_greater_good', pack_code: 'fgg' },
      { name: t`The Inner Circle`, code: 'tcu_interlude_3', interlude: true },
      { name: t`Union and Disillusion`, code: 'union_and_disillusion', pack_code: 'uad' },
      { name: t`In the Clutches of Chaos`, code: 'in_the_clutches_of_chaos', pack_code: 'icc' },
      { name: t`Twist of Fate`, code: 'tcu_interlude_4', interlude: true },
      { name: t`Before the Black Throne`, code: 'before_the_black_throne', pack_code: 'bbt' },
      { name: t`Epilogue`, code: 'tcu_epilogue', interlude: true },
    ];
    case RTNOTZ: return [
      { name: t`Return to The Gathering`, code: 'return_to_the_gathering', pack_code: 'rtnotz' },
      { name: t`Return to the Midnight Masks`, code: 'return_to_the_midnight_masks', pack_code: 'rtnotz' },
      { name: t`Return to the Devourer Below`, code: 'return_to_the_devourer_below', pack_code: 'rtnotz' },
    ];
    case TDEA: return [
      { name: t`Prologue`, code: 'prologue', pack_code: 'tde', interlude: true },
      { name: t`Beyond the Gates of Sleep`, code: 'beyond_the_gates_of_sleep', pack_code: 'tde' },
      { name: t`The Black Cat`, code: 'black_cat', pack_code: 'tde', interlude: true },
      { name: t`The Search for Kadath`, code: 'the_search_for_kadath', pack_code: 'sfk', legacy_codes: ['sfk'] },
      { name: t`The Oneironauts`, code: 'oneironauts', pack_code: 'sfk', interlude: true },
      { name: t`Dark Side of the Moon`, code: 'dark_side_of_the_moon', pack_code: 'dsm', legacy_codes: ['dsm'] },
      { name: t`The Great Ones`, code: 'great_ones', pack_code: 'dsm', interlude: true },
      { name: t`Where Gods Dwell`, code: 'where_the_gods_dwell', pack_code: 'wgd', legacy_codes: ['wgd'] },
      { name: t`Epilogue`, code: 'epligoue', pack_code: 'wgd', interlude: true },
    ];
    case TDEB: return [
      { name: t`Prologue`, code: 'prologue', pack_code: 'tde', interlude: true },
      { name: t`Waking Nightmare`, code: 'waking_nightmare', pack_code: 'tde' },
      { name: t`The Black Cat`, code: 'black_cat', pack_code: 'tde', interlude: true },
      { name: t`A Thousand Shapes of Horror`, code: 'a_thousand_shapes_of_horror', pack_code: 'tsh', legacy_codes: ['tsh'] },
      { name: t`The Oneironauts`, code: 'oneironauts', pack_code: 'sfk', interlude: true },
      { name: t`Point of No Return`, code: 'point_of_no_return', pack_code: 'pnr', legacy_codes: ['pnr'] },
      { name: t`The Great Ones`, code: 'great_ones', pack_code: 'dsm', interlude: true },
      { name: t`Weaver of the Cosmos`, code: 'weaver_of_the_cosmos', pack_code: 'woc' },
      { name: t`Epilogue`, code: 'epligoue', pack_code: 'wgd', interlude: true },
    ];
    case CUSTOM: return [];
    default: {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const _exhaustiveCheck: never = cycleCode;
      return [];
    }
  }
}

export function campaignNames() {
  return {
    core: t`The Night of the Zealot`,
    rtnotz: t`Return to the Night of the Zealot`,
    dwl: t`The Dunwich Legacy`,
    rtdwl: t`Return to The Dunwich Legacy`,
    ptc: t`The Path to Carcosa`,
    rtptc: t`Return to The Path to Carcosa`,
    tfa: t`The Forgotten Age`,
    tdea: t`The Dream-Quest`,
    tdeb: t`The Web of Dreams`,
    tcu: t`The Circle Undone`,
  };
}

export const CAMPAIGN_COLORS = {
  core: '#00408033',
  rtnotz: '#00006622',
  dwl: '#00666633',
  rtdwl: '#00006622',
  ptc: '#cc990033',
  rtptc: '#cc990033',
  tfa: '#33660033',
  tcu: '#00006622',
  tdea: '#00006622',
  tdeb: '#00006622',
};

export function getCampaignLog(
  cycleCode: CampaignCycleCode
): CustomCampaignLog {
  switch (cycleCode) {
    case CORE:
    case RTNOTZ:
      return {
        sections: [
          t`Campaign Notes`,
          t`Cultists We Interrogated`,
          t`Cultists Who Got Away`,
        ],
      };
    case DWL:
    case RTDWL:
      return {
        sections: [
          t`Campaign Notes`,
          t`Sacrificed to Yog-Sothoth`,
        ],
      };
    case PTC:
    case RTPTC:
      return {
        sections: [
          t`Campaign Notes`,
          t`VIPs Interviewed`,
          t`VIPs Slain`,
        ],
        counts: [
          t`Doubt`,
          t`Conviction`,
          t`Chasing the Stranger`,
        ],
      };
    case TFA:
      return {
        sections: [t`Campaign Notes`],
        counts: [t`Yig's Fury`],
        investigatorSections: [t`Supplies`],
        // investigatorCounts
      };
    case TCU:
      return {
        sections: [
          t`Campaign Notes`,
          t`Mementos Discovered`,
          t`Missing Persons - Gavriella Mizrah`,
          t`Missing Persons - Jerome Davids`,
          t`Missing Persons - Penny White`,
          t`Missing Persons - Valentino Rivas`,
        ],
      };
    case TDEA:
      return {
        sections: [
          t`Campaign Notes`,
        ],
        counts: [
          t`Evidence of Kadath`,
        ],
      };
    case TDEB:
      return {
        sections: [
          t`Campaign Notes`,
        ],
        counts: [
          t`Steps of the Bridge`,
        ],
      };
    case CUSTOM:
      return {
        sections: [
          t`Campaign Notes`,
        ],
      };
    default: {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const _exhaustiveCheck: never = cycleCode;
      return {
        sections: [
          t`Campaign Notes`,
        ],
      };
    }
  }
}

type ChaosBagByDifficulty = { [difficulty in CampaignDifficulty]: ChaosBag };

const NOTZ_BAG: ChaosBagByDifficulty = {
  [CampaignDifficulty.EASY]: { '+1': 2, '0': 3, '-1': 3, '-2': 2, skull: 2, cultist: 1, tablet: 1, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.STANDARD]: { '+1': 1, '0': 2, '-1': 3, '-2': 2, '-3': 1, '-4': 1, skull: 2, cultist: 1, tablet: 1, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.HARD]: { '0': 3, '-1': 2, '-2': 2, '-3': 2, '-4': 1, '-5': 1, skull: 2, cultist: 1, tablet: 1, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.EXPERT]: { '0': 1, '-1': 2, '-2': 2, '-3': 2, '-4': 2, '-5': 1, '-6': 1, '-8': 1, skull: 2, cultist: 1, tablet: 1, auto_fail: 1, elder_sign: 1 },
};

const DWL_BAG: ChaosBagByDifficulty = {
  [CampaignDifficulty.EASY]: { '+1': 2, '0': 3, '-1': 3, '-2': 2, skull: 2, cultist: 1, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.STANDARD]: { '+1': 1, '0': 2, '-1': 3, '-2': 2, '-3': 1, '-4': 1, skull: 2, cultist: 1, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.HARD]: { '0': 3, '-1': 2, '-2': 2, '-3': 2, '-4': 1, '-5': 1, skull: 2, cultist: 1, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.EXPERT]: { '0': 1, '-1': 2, '-2': 2, '-3': 2, '-4': 2, '-5': 1, '-6': 1, '-8': 1, skull: 2, cultist: 1, auto_fail: 1, elder_sign: 1 },
};
const PTC_BAG: ChaosBagByDifficulty = {
  [CampaignDifficulty.EASY]: { '+1': 2, '0': 3, '-1': 3, '-2': 2, skull: 3, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.STANDARD]: { '+1': 1, '0': 2, '-1': 3, '-2': 2, '-3': 1, '-4': 1, skull: 3, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.HARD]: { '0': 3, '-1': 2, '-2': 2, '-3': 2, '-4': 1, '-5': 1, skull: 3, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.EXPERT]: { '0': 1, '-1': 2, '-2': 2, '-3': 3, '-4': 2, '-5': 1, '-6': 1, '-8': 1, skull: 3, auto_fail: 1, elder_sign: 1 },
};
const TFA_BAG: ChaosBagByDifficulty = {
  [CampaignDifficulty.EASY]: { '+1': 2, '0': 3, '-1': 2, '-2': 1, '-3': 1, skull: 2, elder_thing: 1, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.STANDARD]: { '+1': 1, '0': 3, '-1': 1, '-2': 2, '-3': 1, '-5': 1, skull: 2, elder_thing: 1, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.HARD]: { '+1': 1, '0': 2, '-1': 1, '-2': 1, '-3': 2, '-4': 1, '-6': 1, skull: 2, elder_thing: 1, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.EXPERT]: { '0': 1, '-1': 1, '-2': 2, '-3': 2, '-4': 2, '-6': 1, '-8': 1, skull: 2, elder_thing: 1, auto_fail: 1, elder_sign: 1 },
};
const TCU_BAG: ChaosBagByDifficulty = {
  [CampaignDifficulty.EASY]: { '+1': 2, '0': 3, '-1': 2, '-2': 1, '-3': 1, skull: 2, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.STANDARD]: { '+1': 1, '0': 2, '-1': 2, '-2': 2, '-3': 1, '-4': 1, skull: 2, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.HARD]: { '0': 2, '-1': 2, '-2': 2, '-3': 1, '-4': 1, '-5': 1, skull: 2, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.EXPERT]: { '0': 1, '-1': 2, '-2': 2, '-3': 1, '-4': 1, '-6': 1, '-8': 1, skull: 2, auto_fail: 1, elder_sign: 1 },
};

const TDEA_BAG: ChaosBagByDifficulty = {
  [CampaignDifficulty.EASY]: { '+1': 2, '0': 3, '-1': 2, '-2': 2, cultist: 1, tablet: 2, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.STANDARD]: { '+1': 1, '0': 2, '-1': 2, '-2': 2, '-3': 1, '-4': 1, cultist: 1, tablet: 2, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.HARD]: { '0': 2, '-1': 2, '-2': 2, '-3': 2, '-4': 1, '-5': 1, cultist: 1, tablet: 2, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.EXPERT]: { '0': 1, '-1': 2, '-2': 2, '-3': 1, '-4': 2, '-5': 1, '-6': 1, '-8': 1, cultist: 1, tablet: 2, auto_fail: 1, elder_sign: 1 },
};
const TDEB_BAG: ChaosBagByDifficulty = {
  [CampaignDifficulty.EASY]: { '+1': 2, '0': 3, '-1': 3, '-2': 2, skull: 2, cultist: 1, elder_thing: 2, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.STANDARD]: { '+1': 1, '0': 2, '-1': 3, '-2': 2, '-3': 1, '-4': 1, skull: 2, cultist: 1, elder_thing: 2, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.HARD]: { '0': 3, '-1': 2, '-2': 2, '-3': 2, '-4': 1, '-5': 1, skull: 2, cultist: 1, elder_thing: 2, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.EXPERT]: { '0': 1, '-1': 2, '-2': 2, '-3': 2, '-4': 2, '-5': 1, '-6': 1, '-8': 1, skull: 2, cultist: 1, elder_thing: 2, auto_fail: 1, elder_sign: 1 },
};

function basicScenarioRewards(encounterCode: string) {
  switch (encounterCode) {
    case 'blood_on_the_altar':
      // Each of the professors could be earned here.
      return ['extracurricular_activity', 'the_house_always_wins', 'armitages_fate'];
    case 'the_eternal_slumber':
      return ['abyssal_tribute'];
    case 'the_nights_usurper':
      return ['abyssal_gifts'];
    case 'bayou':
      return ['rougarou'];
    case 'wilds':
    case 'eztli':
    case 'the_boundary_beyond':
    case 'heart_of_the_elders':
    case 'the_depths_of_yoth':
    case 'turn_back_time':
      // Scenario's that include Poison.
      return ['poison'];
    case 'threads_of_fate':
      // Add Alejandro Vela and basic Relic of Ages
      return ['wilds', 'eztli'];
    default:
      return [];
  }
}

export function scenarioRewards(encounterCode: string) {
  const result = basicScenarioRewards(encounterCode);
  if (encounterCode.startsWith('return_to_')) {
    const nonReturnCode = encounterCode.substring('return_to_'.length);
    return [
      nonReturnCode,
      ...result,
      ...basicScenarioRewards(nonReturnCode),
    ];
  }
  return result;
}

export function getChaosBag(
  cycleCode: CampaignCycleCode,
  difficulty: CampaignDifficulty,
): ChaosBag {
  switch (cycleCode) {
    case CORE:
    case RTNOTZ:
    case CUSTOM:
      return NOTZ_BAG[difficulty];
    case DWL:
    case RTDWL:
      return DWL_BAG[difficulty];
    case PTC:
    case RTPTC:
      return PTC_BAG[difficulty];
    case TFA:
      return TFA_BAG[difficulty];
    case TCU:
      return TCU_BAG[difficulty];
    case TDEA:
      return TDEA_BAG[difficulty];
    case TDEB:
      return TDEB_BAG[difficulty];
    default: {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const _exhaustiveCheck: never = cycleCode;
      return NOTZ_BAG[difficulty];
    }
  }
}
