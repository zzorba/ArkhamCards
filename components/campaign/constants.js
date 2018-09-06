export const CUSTOM = 'custom';

import L from '../../app/i18n';


export const DIFFICULTY = {
  easy: 0,
  standard: 1,
  hard: 2,
  expert: 3,
};

export function difficultyStrings() {
  return {
    easy: L('Easy'),
    standard: L('Standard'),
    hard: L('Hard'),
    expert: L('Expert'),
  };
}

export function campaignScenarios() {
  return {
    core: [
      { name: L('The Gathering'), code: 'torch', pack_code: 'core' },
      { name: L('The Midnight Masks'), code: 'arkham', pack_code: 'core' },
      { name: L('The Devourer Below'), code: 'tentacles', pack_code: 'core' },
    ],
    dwl: [
      { name: L('Extracurricular Activity'), code: 'extracurricular_activity', pack_code: 'dwl' },
      { name: L('The House Always Wins'), code: 'the_house_always_wins', pack_code: 'dwl' },
      { name: L('Armitage’s Fate'), code: 'armitages_fate', interlude: true },
      { name: L('The Miskatonic Museum'), code: 'the_miskatonic_museum', pack_code: 'tmm' },
      { name: L('Essex County Express'), code: 'essex_county_express', pack_code: 'tece' },
      { name: L('Blood on the Altar'), code: 'blood_on_the_altar', pack_code: 'bota' },
      { name: L('The Survivors'), code: 'dwl_interlude2', interlude: true },
      { name: L('Undimensioned and Unseen'), code: 'undimensioned_and_unseen', pack_code: 'uau' },
      { name: L('Where Doom Awaits'), code: 'where_doom_awaits', pack_code: 'wda' },
      { name: L('Lost in Time and Space'), code: 'lost_in_time_and_space', pack_code: 'litas' },
      { name: L('Epilogue'), code: 'dwl_epilogue', interlude: true },
    ],
    ptc: [
      { name: L('Prologue'), code: 'ptc_prologue', interlude: true },
      { name: L('Curtain Call'), code: 'curtain_call', pack_code: 'ptc' },
      { name: L('The Last King'), code: 'the_last_king', pack_code: 'ptc' },
      { name: L('Lunacy’s Reward'), code: 'ptc_interlude1', interlude: true },
      { name: L('Echoes of the Past'), code: 'echoes_of_the_past', pack_code: 'eotp' },
      { name: L('The Unspeakable Oath'), code: 'the_unspeakable_oath', pack_code: 'tuo' },
      { name: L('Lost Soul'), code: 'ptc_interlude2', interlude: true },
      { name: L('A Phantom of Truth'), code: 'a_phantom_of_truth', pack_code: 'apot' },
      { name: L('The Pallid Mask'), code: 'the_pallid_mask', pack_code: 'tpm' },
      { name: L('Black Stars Rise'), code: 'black_stars_rise', pack_code: 'bsr' },
      { name: L('Dim Carcosa'), code: 'dim_carcosa', pack_code: 'dca' },
      { name: L('Epilogue'), code: 'ptc_epilogue', interlude: true },
    ],
    tfa: [
      { name: L('Prologue'), code: 'tfa_prologue', interlude: true },
      { name: L('The Untamed Wilds'), code: 'wilds', pack_code: 'tfa' },
      { name: L('Restless Nights'), code: 'tfa_interlude1', interlude: true },
      { name: L('The Doom of Eztli'), code: 'eztli', pack_code: 'tfa' },
      { name: L('Expedition’s End'), code: 'tfa_interlude2', interlude: true },
      { name: L('Threads of Fate'), code: 'threads_of_fate', pack_code: 'tof' },
      { name: L('The Boundary Beyond'), code: 'the_boundary_beyond', pack_code: 'tbb' },
      { name: L('The Jungle Beckons'), code: 'tfa_interlude3', interlude: true },
      { name: L('Heart of the Elders'), code: 'heart_of_the_elders', pack_code: 'hote' },
      { name: L('The City of Archives'), code: 'the_city_of_archives', pack_code: 'tcoa' },
      { name: L('Those Held Captive'), code: 'tfa_interlude4', interlude: true },
      { name: L('The Depths of Yoth'), code: 'the_depths_of_yoth', pack_code: 'tdoy' },
      { name: L('The Darkness'), code: 'tfa_interlude5', interlude: true },
      { name: L('Shattered Aeons'), code: 'shattered_aeons', pack_code: 'sha' },
      { name: L('Epilogue'), code: 'tfa_epilogue', interlude: true },
    ],
    rtnotz: [
      { name: L('Return to The Gathering'), code: 'return_to_the_gathering', pack_code: 'rtnotz' },
      { name: L('Return to the Midnight Masks'), code: 'return_to_the_midnight_masks', pack_code: 'rtnotz' },
      { name: L('Return to the Devourer Below'), code: 'return_to_the_devourer_below', pack_code: 'rtnotz' },
    ],
  };
}

export function campaignNames() {
  return {
    core: L('The Night of the Zealot'),
    rtnotz: L('Return to the Night of the Zealot'),
    dwl: L('The Dunwich Legacy'),
    ptc: L('The Path to Carcosa'),
    tfa: L('The Forgotten Age'),
  };
}

export const CAMPAIGN_COLORS = {
  core: '#00408033',
  rtnotz: '#00006622',
  dwl: '#00666633',
  ptc: '#cc990033',
  tfa: '#33660033',
};

export function campaignLogs() {
  const coreLog = {
    sections: [L('Campaign Notes'), L('Cultists We Interrogated'), L('Cultists Who Got Away')],
  };

  return {
    'core': coreLog,
    'rtnotz': coreLog,
    'dwl': {
      sections: [L('Campaign Notes'), L('Sacrificed to Yog-Sothoth')],
    },
    'ptc': {
      sections: [L('Campaign Notes'), L('VIPs Interviewed'), L('VIPs Slain')],
      counts: [L('Doubt'), L('Conviction'), L('Chasing the Stranger')],
    },
    'tfa': {
      sections: [L('Campaign Notes')],
      counts: [L('Yig\'s Fury')],
      investigatorSections: [L('Supplies')],
      // investigatorCounts
    },
  };
}


const NOTZ_BAG = [
  { '+1': 2, '0': 3, '-1': 3, '-2': 2, skull: 2, cultist: 1, tablet: 1, auto_fail: 1, elder_sign: 1 },
  { '+1': 1, '0': 2, '-1': 3, '-2': 2, '-3': 1, '-4': 1, skull: 2, cultist: 1, tablet: 1, auto_fail: 1, elder_sign: 1 },
  { '0': 3, '-1': 2, '-2': 2, '-3': 2, '-4': 1, '-5': 1, skull: 2, cultist: 1, tablet: 1, auto_fail: 1, elder_sign: 1 },
  { '0': 1, '-1': 2, '-2': 2, '-3': 2, '-4': 2, '-5': 1, '-6': 1, '-8': 1, skull: 2, cultist: 1, tablet: 1, auto_fail: 1, elder_sign: 1 },
];

export const CAMPAIGN_CHAOS_BAGS = {
  'core': NOTZ_BAG,
  'rtnotz': NOTZ_BAG,
  'dwl': [
    { '+1': 2, '0': 3, '-1': 3, '-2': 2, skull: 2, cultist: 1, auto_fail: 1, elder_sign: 1 },
    { '+1': 1, '0': 2, '-1': 3, '-2': 2, '-3': 1, '-4': 1, skull: 2, cultist: 1, auto_fail: 1, elder_sign: 1 },
    { '0': 3, '-1': 2, '-2': 2, '-3': 2, '-4': 1, '-5': 1, skull: 2, cultist: 1, auto_fail: 1, elder_sign: 1 },
    { '0': 1, '-1': 2, '-2': 2, '-3': 2, '-4': 2, '-5': 1, '-6': 1, '-8': 1, skull: 2, cultist: 1, auto_fail: 1, elder_sign: 1 },
  ],
  'ptc': [
    { '+1': 2, '0': 3, '-1': 3, '-2': 2, skull: 3, auto_fail: 1, elder_sign: 1 },
    { '+1': 1, '0': 2, '-1': 3, '-2': 2, '-3': 1, '-4': 1, skull: 3, auto_fail: 1, elder_sign: 1 },
    { '0': 3, '-1': 2, '-2': 2, '-3': 3, '-4': 1, '-5': 1, skull: 3, auto_fail: 1, elder_sign: 1 },
    { '0': 1, '-1': 2, '-2': 2, '-3': 3, '-4': 2, '-5': 1, '-6': 1, '-8': 1, skull: 3, auto_fail: 1, elder_sign: 1 },
  ],
  'tfa': [
    { '+1': 2, '0': 3, '-1': 2, '-2': 1, '-3': 1, skull: 2, elder_thing: 1, auto_fail: 1, elder_sign: 1 },
    { '+1': 1, '0': 3, '-1': 1, '-2': 2, '-3': 1, '-5': 1, skull: 2, elder_thing: 1, auto_fail: 1, elder_sign: 1 },
    { '+1': 1, '0': 2, '-1': 1, '-2': 1, '-3': 2, '-4': 1, '-6': 1, skull: 2, elder_thing: 1, auto_fail: 1, elder_sign: 1 },
    { '0': 1, '-1': 1, '-2': 2, '-3': 2, '-4': 2, '-6': 1, '-8': 1, skull: 2, elder_thing: 1, auto_fail: 1, elder_sign: 1 },
  ],
};
