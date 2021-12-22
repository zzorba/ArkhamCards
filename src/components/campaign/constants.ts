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
  RTTFA,
  TCU,
  TDE,
  TDEA,
  TDEB,
  TIC,
  CampaignDifficulty,
  CampaignCycleCode,
  CustomCampaignLog,
  ScenarioResult,
  STANDALONE,
  ALICE_IN_WONDERLAND,
  DARK_MATTER,
  RTTCU,
  EOE,
  CROWN_OF_EGIL,
} from '@actions/types';
import { ChaosBag } from '@app_constants';
import Card from '@data/types/Card';
import { ThemeColors } from '@styles/theme';

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
    case RTTFA: return t`Return to The Forgotten Age`;
    case TCU: return t`The Circle Undone`;
    case RTTCU: return t`Return to The Circle Undone`;
    case TDE: return t`The Dream-Eaters`;
    case TDEA: return t`The Dream-Quest`;
    case TDEB: return t`The Web of Dreams`;
    case TIC: return t`The Innsmouth Conspiracy`;
    case EOE: return t`Edge of the Earth`;
    case CUSTOM: return null;
    case STANDALONE: return t`Standalone`;
    case DARK_MATTER: return t`Dark Matter`;
    case ALICE_IN_WONDERLAND: return t`Alice in Wonderland`;
    case CROWN_OF_EGIL: return t`Crown of Egil`;
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
    case RTTFA: return [
      { name: t`Prologue`, code: 'tfa_prologue', interlude: true },
      { name: t`Return to The Untamed Wilds`, code: 'return_to_the_untamed_wilds', pack_code: 'tfa' },
      { name: t`Restless Nights`, code: 'tfa_interlude1', interlude: true },
      { name: t`Return to The Doom of Eztli`, code: 'return_to_the_doom_of_eztli', pack_code: 'tfa' },
      { name: t`Expedition’s End`, code: 'tfa_interlude2', interlude: true },
      { name: t`Return to Threads of Fate`, code: 'return_to_threads_of_fate', pack_code: 'tof' },
      { name: t`Return to The Boundary Beyond`, code: 'return_to_the_boundary_beyond', pack_code: 'tbb' },
      { name: t`The Jungle Beckons`, code: 'tfa_interlude3', interlude: true },
      { name: t`Return to Heart of the Elders`, code: 'return_to_heart_of_the_elders', pack_code: 'hote' },
      { name: t`Return to The City of Archives`, code: 'return_to_the_city_of_archives', pack_code: 'tcoa' },
      { name: t`Those Held Captive`, code: 'tfa_interlude4', interlude: true },
      { name: t`Return to The Depths of Yoth`, code: 'return_to_the_depths_of_yoth', pack_code: 'tdoy' },
      { name: t`The Darkness`, code: 'tfa_interlude5', interlude: true },
      { name: t`Return to Shattered Aeons`, code: 'return_to_shattered_aeons', pack_code: 'sha' },
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
    case RTTCU: return [
      {
        name: t`Prologue: Return to Disappearance at the Twilight Estate`,
        code: 'disappearance_at_the_twilight_estate',
        legacy_codes: ['tcu_prologue'],
        pack_code: 'tcu',
      },
      { name: t`Return to The Witching Hour`, code: 'return_to_the_witching_hour', pack_code: 'tcu' },
      {
        name: t`Return to At Death's Doorstep`,
        legacy_codes: ['at_deaths_doorstep_23', 'at_deaths_doorstep_1'],
        code: 'return_to_at_deaths_doorstep',
        pack_code: 'tcu',
      },
      { name: t`The Price of Progress`, code: 'tcu_interlude_2', interlude: true },
      { name: t`Return to The Secret Name`, code: 'return_to_the_secret_name', pack_code: 'tsn' },
      { name: t`Return to The Wages of Sin`, code: 'return_to_the_wages_of_sin', pack_code: 'tws' },
      { name: t`Return to For the Greater Good`, code: 'return_to_for_the_greater_good', pack_code: 'fgg' },
      { name: t`The Inner Circle`, code: 'tcu_interlude_3', interlude: true },
      { name: t`Return to Union and Disillusion`, code: 'return_to_union_and_disillusion', pack_code: 'uad' },
      { name: t`Return to In the Clutches of Chaos`, code: 'return_to_in_the_clutches_of_chaos', pack_code: 'icc' },
      { name: t`Twist of Fate`, code: 'tcu_interlude_4', interlude: true },
      { name: t`Return to Before the Black Throne`, code: 'return_to_before_the_black_throne', pack_code: 'bbt' },
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
    case TIC: return [
      { name: t`The Pit of Despair`, code: 'the_pit_of_despair', pack_code: 'tic' },
      { name: t`Puzzle Pieces`, code: 'puzzle_pieces', pack_code: 'tic', interlude: true },
      { name: t`The Vanishing of Elina Harper`, code: 'the_vanishing_of_elina_harper', pack_code: 'tic' },
      { name: t`The Syzygy`, code: 'syzygy', pack_code: 'tic', interlude: true },
      { name: t`In Too Deep`, code: 'in_too_deep', pack_code: 'itc' },
      { name: t`Devil Reef`, code: 'devil_reef', pack_code: 'def' },
      { name: t`Beneath the Waves`, code: 'beneath_the_waves', pack_code: 'def', interlude: true },
      { name: t`Horror in High Gear`, code: 'horror_in_high_gear', pack_code: 'hhg' },
      { name: t`A Light in the Fog`, code: 'a_light_in_the_fog', pack_code: 'lif' },
      { name: t`The Lair of Dagon`, code: 'lair_of_dagon', pack_code: 'lod' },
      { name: t`Hidden Truths`, code: 'hidden_truths', pack_code: 'lod', interlude: true },
      { name: t`Into the Maelstrom`, code: 'into_the_maelstrom', pack_code: 'itm' },
      { name: t`Epilogue`, code: 'epligoue', pack_code: 'itm', interlude: true },
    ];
    case EOE: return [
      { name: t`Prologue`, code: 'prologue', pack_code: 'eoec', interlude: true },
      { name: t`Ice and Death: Part 1`, code: 'ice_and_death_part_1', pack_code: 'eoec' },
      { name: t`Ice and Death: Part 2`, code: 'ice_and_death_part_2', pack_code: 'eoec' },
      { name: t`Ice and Death: Part 3`, code: 'ice_and_death_part_3', pack_code: 'eoec' },
      { name: t`Restful Night`, code: 'restful_night', pack_code: 'eoec', interlude: true },
      { name: t`To the Forbidden Peaks`, code: 'to_the_forbidden_peaks', pack_code: 'eoec' },
      { name: t`Endless Night`, code: 'endless_night', pack_code: 'eoec', interlude: true },
      { name: t`City of the Elder Things`, code: 'city_of_the_elder_things', pack_code: 'eoec' },
      { name: t`Final Night`, code: 'final_night', pack_code: 'eoec', interlude: true },
      { name: t`The Heart of Madness: Part 1`, code: 'the_heart_of_madness_part_1', pack_code: 'eoec' },
      { name: t`The Heart of Madness: Part 2`, code: 'the_heart_of_madness_part_2', pack_code: 'eoec' },
      { name: t`Epilogue`, code: 'epilogue', pack_code: 'eoec', interlude: true },
      { name: t`Fatal Mirage`, code: 'fatal_mirage', pack_code: 'eoec' },
      { name: t`Fatal Mirage`, code: 'fatal_mirage_2', pack_code: 'eoec' },
      { name: t`Fatal Mirage`, code: 'fatal_mirage_3', pack_code: 'eoec' },
    ];
    case CROWN_OF_EGIL:
    case ALICE_IN_WONDERLAND:
    case DARK_MATTER: return [];
    case TDE: return [];
    case CUSTOM: return [];
    case STANDALONE: return [];
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
    rttfa: t`Return to The Forgotten Age`,
    tcu: t`The Circle Undone`,
    rttcu: t`Return to The Circle Undone`,
    tde: t`The Dream-Eaters`,
    tdea: t`The Dream-Quest`,
    tdeb: t`The Web of Dreams`,
    tic: t`The Innsmouth Conspiracy`,
    eoe: t`Edge of the Earth`,
    zdm: t`Dark Matter`,
    zaw: t`Alice in Wonderland`,
    zce: t`The Crown of Egil`,
    standalone: t`Standalone`,
  };
}

export function campaignColor(cycle: CampaignCycleCode | typeof RTTCU | typeof EOE, colors: ThemeColors) {
  switch (cycle) {
    case CORE:
    case RTNOTZ:
    case 'custom':
      return colors.campaign.core;
    case DWL:
    case RTDWL:
    case CROWN_OF_EGIL:
      return colors.campaign.dwl;
    case PTC:
    case RTPTC:
      return colors.campaign.ptc;
    case TFA:
    case RTTFA:
    case ALICE_IN_WONDERLAND:
      return colors.campaign.tfa;
    case STANDALONE:
      return colors.campaign.standalone;
    case TCU:
    case RTTCU:
      return colors.campaign.tcu;
    case TDEA:
    case TDEB:
    case TDE:
    case DARK_MATTER:
      return colors.campaign.tde;
    case TIC:
      return colors.campaign.tic;
    case EOE:
      return colors.campaign.eoe;
  }
}

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
    case RTTFA:
      return {
        sections: [t`Campaign Notes`],
        counts: [t`Yig's Fury`],
        investigatorSections: [t`Supplies`],
        // investigatorCounts
      };
    case TCU:
    case RTTCU:
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
    case TDE:
      return {};
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
    case TIC:
      return {
        sections: [
          t`Campaign Notes`,
          t`Memories Recovered`,
          t`Possible Suspects`,
          t`Possible Hideouts`,
        ],
      };
    case DARK_MATTER:
      return {
        sections: [
          t`Campaign Notes`,
        ],
        counts: [t`Impending Doom`],
        investigatorCounts: [t`Memories`],
      };
    case ALICE_IN_WONDERLAND:
      return {
        sections: [
          t`Campaign Notes`,
          t`Fragments of Alilce`,
          t`Wonderland Boons`,
          t`Wonderland Banes`,
        ],
        counts: [t`Strength of Wonderland`],
      };
    case CROWN_OF_EGIL:
      return {
        sections: [
          t`Campaign Notes`,
          t`Traces of Egil`,
        ],
      };
    case CUSTOM:
      return {
        sections: [
          t`Campaign Notes`,
        ],
      };
    case STANDALONE:
    case EOE:
      return {
        sections: [
          t`Campaign Notes`,
          t`Fatal Mirage - Memories Discovered`,
          t`Fatal Mirage - Memories Banished`,
          t`Ice and Death - Locations Revealed`,
          t`Ice and Death - Supplies Recovered`,
          t`The Heart of Madness - Seals Placed`,
          t`The Heart of Madness - Seals Recovered`,
          t`Expedition Team`,
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

const TIC_BAG: ChaosBagByDifficulty = {
  [CampaignDifficulty.EASY]: { '+1': 2, '0': 3, '-1': 3, '-2': 2, skull: 2, cultist: 2, tablet: 2, elder_thing: 2, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.STANDARD]: { '+1': 1, '0': 2, '-1': 3, '-2': 2, '-3': 1, '-4': 1, skull: 2, cultist: 2, tablet: 2, elder_thing: 2, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.HARD]: { '0': 3, '-1': 2, '-2': 2, '-3': 2, '-4': 1, '-5': 1, skull: 2, cultist: 2, tablet: 2, elder_thing: 2, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.EXPERT]: { '0': 1, '-1': 2, '-2': 2, '-3': 2, '-4': 2, '-5': 1, '-6': 1, '-8': 1, skull: 2, cultist: 2, tablet: 2, elder_thing: 2, auto_fail: 1, elder_sign: 1 },
};

const EOE_BAG: ChaosBagByDifficulty = {
  [CampaignDifficulty.EASY]: { '+1': 3, '0': 2, '-1': 3, '-2': 2, skull: 2, cultist: 1, tablet: 1, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.STANDARD]: { '+1': 1, '0': 2, '-1': 3, '-2': 2, '-3': 1, '-4': 1, frost: 1, skull: 2, cultist: 1, tablet: 1, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.HARD]: { '0': 2, '-1': 2, '-2': 2, '-3': 1, '-4': 2, '-5': 1, frost: 2, skull: 2, cultist: 1, tablet: 1, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.EXPERT]: { '0': 1, '-1': 1, '-2': 2, '-3': 1, '-4': 2, '-5': 1, '-7': 1, frost: 3, skull: 2, cultist: 1, tablet: 1, auto_fail: 1, elder_sign: 1 },
};

const DARK_MATTER_BAG: ChaosBagByDifficulty = {
  [CampaignDifficulty.EASY]: { '+1': 2, '0': 3, '-1': 2, '-2': 2, skull: 2, cultist: 2, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.STANDARD]: { '+1': 1, '0': 2, '-1': 3, '-2': 2, '-3': 1, '-4': 1, skull: 2, cultist: 2, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.HARD]: { '0': 3, '-1': 2, '-2': 2, '-3': 2, '-4': 1, '-5': 1, skull: 2, cultist: 2, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.EXPERT]: { '0': 1, '-1': 1, '-2': 2, '-3': 2, '-4': 2, '-5': 1, '-6': 1, '-8': 1, skull: 2, cultist: 2, auto_fail: 1, elder_sign: 1 },
};

const ALICE_IN_WONDERLAND_BAG: ChaosBagByDifficulty = {
  [CampaignDifficulty.EASY]: { '+1': 2, '0': 3, '-1': 3, '-2': 2, skull: 2, elder_thing: 1, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.STANDARD]: { '+1': 1, '0': 2, '-1': 3, '-2': 2, '-3': 1, '-4': 1, skull: 2, elder_thing: 1, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.HARD]: { '+1': 1, '0': 1, '-1': 2, '-2': 2, '-3': 2, '-4': 1, '-5': 1, '-6': 1, skull: 2, elder_thing: 1, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.EXPERT]: { '0': 1, '-1': 2, '-2': 1, '-3': 1, '-4': 1, '-5': 1, '-6': 1, '-7': 1, '-8': 1, skull: 2, elder_thing: 1, auto_fail: 1, elder_sign: 1 },
};

const CROWN_OF_EGIL_BAG: ChaosBagByDifficulty = {
  [CampaignDifficulty.EASY]: { '+1': 2, '0': 3, '-1': 2, '-2': 2, skull: 3, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.STANDARD]: { '+1': 1, '0': 2, '-1': 3, '-2': 2, '-3': 1, '-4': 1, skull: 3, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.HARD]: { '0': 3, '-1': 2, '-2': 1, '-3': 2, '-4': 1, '-5': 1, skull: 3, auto_fail: 1, elder_sign: 1 },
  [CampaignDifficulty.EXPERT]: { '0': 1, '-1': 2, '-2': 2, '-3': 2, '-4': 2, '-5': 1, '-6': 1, '-8': 1, skull: 3, auto_fail: 1, elder_sign: 1 },
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
    case 'the_untamed_wilds':
    case 'the_doom_of_eztli':
    case 'eztli':
    case 'the_boundary_beyond':
    case 'heart_of_the_elders':
    case 'the_depths_of_yoth':
    case 'turn_back_time':
      // Scenario's that include Poison.
      return ['poison'];
    case 'threads_of_fate':
      // Add Alejandro Vela and basic Relic of Ages
      return ['wilds', 'eztli', 'poison'];
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

export function getTarotCards() {
  return [
    {
      id: 'the_fool',
      title: t`The Fool · 0`,
      text: t`Each investigator not defeated during this game earns +2 experience during its resolution.`,
      inverted_text: t`Each investigator defeated during this game earns -2 experience during its resolution.`,
    },
    {
      id: 'the_magician',
      title: t`The Magician · I`,
      text: t`Each investigator begins the game with 3 addititonal resources`,
      inverted_text: t`Each investigator begins the game with 3 fewer resources, and cannot gain resources during their first turn.`,
    },
    {
      id: 'the_high_priestess',
      title: t`The High Priestess · II`,
      text: t`During the first [intellect] test each investigator performs each round, they get +1 [intellect].`,
      inverted_text: t`During the first [intellect] test each investigator performs each round, they get -1 [intellect].`,
    },
    {
      id: 'the_empress',
      title: t`The Empress · III`,
      text: t`During the first [agility] test each investigator performs each round, they get +1 [agility].`,
      inverted_text: t`During the first [agility] test each investigator performs each round, they get -1 [agility].`,
    },
    {
      id: 'the_emperor',
      title: t`The Emperor · IV`,
      text: t`During the first [combat] test each investigator performs each round, they get +1 [combat].`,
      inverted_text: t`During the first [combat] test each investigator performs each round, they get -1 [combat].`,
    },
    {
      id: 'the_hierophant',
      title: t`The Hierophant · V`,
      text: t`During the first [willpower] test each investigator performs each round, they get +1 [willpower].`,
      inverted_text: t`During the first [willpower] test each investigator performs each round, they get -1 [willpower].`,
    },
    {
      id: 'the_lovers',
      title: t`The Lovers · VI`,
      text: t`When the game begins, each investigator searches their deck for an Ally asset, adds it to their hand, and shuffles their deck.`,
      inverted_text: t`When the game begins, each investigator searches their deck for an Ally asset, removes it from the game, and shuffles their deck.`,
    },
    {
      id: 'the_chariot',
      title: t`The Chariot · VII`,
      text: t`Each investigator begins the game with 2 additional cards in their opening hand.`,
      inverted_text: t`Each investigator begins the game with 2 fewer cards in their opening hand, and cannot draw cards during their first turn.`,
    },
    {
      id: 'strength',
      title: t`Strength · VIII`,
      text: t`When the game begins, each investigator may play an asset from their hand at -2 cost.`,
      inverted_text: t`During the first round of the game, each investigator cannot play assets.`,
    },
    {
      id: 'the_hermit',
      title: t`The Hermit · IX`,
      text: t`Increase each investigator's maximum hand size by 3.`,
      inverted_text: t`Decrease each investigator's maximum hand size by 3.`,
    },
    {
      id: 'wheel_of_fortune',
      title: t`Wheel of Fortune · X`,
      text: t`Once each act, when an investigator reveals an [auto_fail] token, thte investigator may cancel it and treat it as a 0 token instead.`,
      inverted_text: t`Once each agenda, the first time any investigator reveals an [elder_sign] token, cancel it and treat it as a -5 token instead.`,
    },
    {
      id: 'justice',
      title: t`Justice · XI`,
      text: t`Cancel the first doom that would be placed on the final agenda of the game.`,
      inverted_text: t`The final agenda of the game enters play with 1 doom on it.`,
    },
    {
      id: 'the_hanged_man',
      title: t`The Hanged Man · XII`,
      text: t`During setup, each investigator may take up to 2 additional mulligans.`,
      inverted_text: t`Each investigator cannot mulligan or replace weaknesses in their opening hand (resolve their revelation abilities when the game begins).`,
    },
    {
      id: 'death',
      title: t`Death · XIII`,
      text: t`Each investigator gets +1 health.`,
      inverted_text: t`Each investigator gets -1 health.`,
    },
    {
      id: 'temperance',
      title: t`Temperance · XIV`,
      text: t`Each investigator gets +1 sanity.`,
      inverted_text: t`Each investigator gets -1 sanity.`,
    },
    {
      id: 'the_devil',
      title: t`The Devil · XV`,
      text: t`Each investigator has 1 additional slot of a type chosen by that investigattor when the game begins.`,
      inverted_text: t`Each investigator has 3 fewer slots, each of a different type, chosen by that investigator when the game begins.`,
    },
    {
      id: 'the_tower',
      title: t`The Tower · XVI`,
      text: t`Each investigator chooses 1 basic weakness in their deck and removes it from the game (return them after the game ends).`,
      inverted_text: t`Add 1 random basic weakness to each investigator's deck. Remove them after the game ends.`,
    },
    {
      id: 'the_star',
      title: t`The Star · XVII`,
      text: t`After an investigator reveals an [elder_sign] token during a skill test, they may heal 1 damage or 1 horror.`,
      inverted_text: t`After an investigator reveals an [auto_fail] token during a skill test, they must either take 1 damage or 1 horror.`,
    },
    {
      id: 'the_moon',
      title: t`The Moon · XVIII`,
      text: t`The first time each investigator's deck would run out of cards, they may shuffle the bottom 10 cards of their discard pile back into their deck.`,
      inverted_text: t`When the game begins, each investigator discards the top 5 cards of their deck. Shuffle each discarded weakness into its owner's deck.`,
    },
    {
      id: 'the_sun',
      title: t`The Sun · XIX`,
      text: t`During each investigator's first turn, they may take 2 additional actions.`,
      inverted_text: t`During each investigator's first turn, they have 2 fewer actions to take.`,
    },
    {
      id: 'judgement',
      title: t`Judgement · XX`,
      text: t`When the game begins, replace a [skull] token in the chaos bag with a 0 token. Swap them back after the game ends.`,
      inverted_text: t`When the game begins, replace the highest non-negative token in the chaos bag with a [skull] token. Swap them back after the game ends.`,
    },
    {
      id: 'the_world',
      title: t`The World · XXI`,
      text: t`Each investigator not defeated during this game may remove 1 trauma of their choice during its resolution.`,
      inverted_text: t`Each investigator defeated during this game suffers 1 trauma of their choice during its resolution.`,
    },
  ];
}

export function getChaosBag(
  cycleCode: CampaignCycleCode,
  difficulty: CampaignDifficulty,
): ChaosBag {
  switch (cycleCode) {
    case CORE:
    case RTNOTZ:
    case CUSTOM:
    case STANDALONE:
      return NOTZ_BAG[difficulty];
    case DWL:
    case RTDWL:
      return DWL_BAG[difficulty];
    case PTC:
    case RTPTC:
      return PTC_BAG[difficulty];
    case TFA:
    case RTTFA:
      return TFA_BAG[difficulty];
    case TCU:
    case RTTCU:
      return TCU_BAG[difficulty];
    case TDE:
      return {};
    case TDEA:
      return TDEA_BAG[difficulty];
    case TDEB:
      return TDEB_BAG[difficulty];
    case TIC:
      return TIC_BAG[difficulty];
    case EOE:
      return EOE_BAG[difficulty];
    case DARK_MATTER:
      return DARK_MATTER_BAG[difficulty];
    case ALICE_IN_WONDERLAND:
      return ALICE_IN_WONDERLAND_BAG[difficulty];
    case CROWN_OF_EGIL:
      return CROWN_OF_EGIL_BAG[difficulty];
    default: {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const _exhaustiveCheck: never = cycleCode;
      return NOTZ_BAG[difficulty];
    }
  }
}
