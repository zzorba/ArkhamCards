import { findIndex, forEach, map } from 'lodash';

import { SKILLS, FactionCodeType } from '../constants';


export interface SkillIconsFilters {
  willpower: boolean;
  intellect: boolean;
  combat: boolean;
  agility: boolean;
  wild: boolean;
  doubleIcons: boolean;
}
export interface FilterState {
  [key: string]: string[] | boolean | [number, number] | SkillIconsFilters;
  factions: FactionCodeType[];
  uses: string[];
  types: string[];
  subTypes: string[];
  xpLevels: string[];
  traits: string[];
  packs: string[];
  cycleNames: string[];
  slots: string[];
  encounters: string[];
  illustrators: string[];
  levelEnabled: boolean;
  exceptional: boolean;
  nonExceptional: boolean;
  costEnabled: boolean;
  victory: boolean;
  vengeance: boolean;
  skillEnabled: boolean;
  unique: boolean;
  permanent: boolean;
  fast: boolean;
  exile: boolean;
  bonded: boolean;
  seal: boolean;
  myriad: boolean;
  fightAction: boolean;
  investigateAction: boolean;
  evadeAction: boolean;
  skillIcons: SkillIconsFilters;
  shroudEnabled: boolean;
  cluesEnabled: boolean;
  cluesFixed: boolean;
  hauntedEnabled: boolean;
  enemyHealthEnabled: boolean;
  enemyHealthPerInvestigator: boolean;
  enemyDamageEnabled: boolean;
  enemyHorrorEnabled: boolean;
  enemyFightEnabled: boolean;
  enemyEvadeEnabled: boolean;
  // Misc traits
  enemyElite: boolean;
  enemyNonElite: boolean;
  enemyHunter: boolean;
  enemyNonHunter: boolean;
  enemyParley: boolean;
  enemyRetaliate: boolean;
  enemyAlert: boolean;
  enemySpawn: boolean;
  enemyPrey: boolean;
  enemyAloof: boolean;
  enemyMassive: boolean;
  enemySwarm: boolean;
  // Slider controls that are dynamically sized
  level: [number, number];
  cost: [number, number];
  shroud: [number, number];
  clues: [number, number];
  enemyHealth: [number, number];
  enemyDamage: [number, number];
  enemyHorror: [number, number];
  enemyFight: [number, number];
  enemyEvade: [number, number];
}

export const defaultFilterState: FilterState = {
  factions: [],
  uses: [],
  types: [],
  subTypes: [],
  xpLevels: [],
  traits: [],
  packs: [],
  cycleNames: [],
  slots: [],
  encounters: [],
  illustrators: [],
  levelEnabled: false,
  exceptional: false,
  nonExceptional: false,
  costEnabled: false,
  victory: false,
  vengeance: false,
  skillEnabled: false,
  unique: false,
  permanent: false,
  fast: false,
  bonded: false,
  fightAction: false,
  investigateAction: false,
  evadeAction: false,
  exile: false,
  myriad: false,
  seal: false,
  skillIcons: {
    willpower: false,
    intellect: false,
    combat: false,
    agility: false,
    wild: false,
    doubleIcons: false,
  },
  shroudEnabled: false,
  cluesEnabled: false,
  cluesFixed: false,
  hauntedEnabled: false,
  enemyHealthEnabled: false,
  enemyHealthPerInvestigator: false,
  enemyDamageEnabled: false,
  enemyHorrorEnabled: false,
  enemyFightEnabled: false,
  enemyEvadeEnabled: false,
  // Misc traits
  enemyElite: false,
  enemyNonElite: false,
  enemyHunter: false,
  enemyNonHunter: false,
  enemyParley: false,
  enemyRetaliate: false,
  enemyAlert: false,
  enemySpawn: false,
  enemyPrey: false,
  enemyAloof: false,
  enemyMassive: false,
  enemySwarm: false,
  // Slider controls that are dynamically sized
  level: [0, 5],
  cost: [0, 6],
  shroud: [0, 6],
  clues: [0, 6],
  enemyHealth: [0, 10],
  enemyDamage: [0, 5],
  enemyHorror: [0, 5],
  enemyFight: [0, 6],
  enemyEvade: [0, 6],
};

export function safeValue(value: any) {
  return value;
}

function applyRangeFilter(
  query: string[],
  field: string,
  values: [number, number],
  linked: boolean
) {
  if (values[0] === values[1]) {
    query.push(`(${field} == ${values[0]}${linked ? ` or linked_card.${field} == ${values[0]}` : ''})`);
  } else {
    query.push(`((${field} >= ${values[0]} and ${field} <= ${values[1]})${linked ? ` or (linked_card.${field} >= ${values[0]} and linked_card.${field} <= ${values[1]})` : ''})`);
  }
}

function applySlotFilter(filters: FilterState, query: string[]) {
  const {
    slots,
  } = filters;
  if (slots.length) {
    query.push([
      '(',
      map(slots, s => `slots_normalized CONTAINS[c] '#${safeValue(s)}#'`).join(' or '),
      ')',
    ].join(''));
  }
}

function applyTraitFilter(filters: FilterState, query: string[]) {
  const {
    traits,
  } = filters;
  if (traits.length) {
    query.push([
      '(',
      map(traits, t => `traits_normalized CONTAINS[c] "${safeValue(t)}"`).join(' or '),
      ' or ',
      map(traits, t => `linked_card.traits_normalized CONTAINS[c] "${safeValue(t)}"`).join(' or '),
      ')',
    ].join(''));
  }
}

function applySkillIconFilter(skillFilters: SkillIconsFilters, query: string[]) {
  const parts: string[] = [];
  const doubleIcons = skillFilters.doubleIcons;
  const matchAll = doubleIcons &&
    (findIndex(SKILLS, skill => skillFilters[skill]) === -1);

  forEach(SKILLS, skill => {
    if (matchAll || skillFilters[skill]) {
      parts.push(`skill_${skill} > ${doubleIcons ? 1 : 0}`);
    }
  });

  if (parts.length) {
    // Kick out investigators because they re-use the same field
    // and by definition cannot have skill icons.
    query.push(`(type_code != 'investigator')`);
    query.push(`(${parts.join(' or ')})`);
  }
}

function applyLocationFilters(filters: FilterState, query: string[]) {
  const {
    shroudEnabled,
    shroud,
    cluesEnabled,
    clues,
    cluesFixed,
    hauntedEnabled,
  } = filters;
  const oldLength = query.length;
  if (shroudEnabled) {
    applyRangeFilter(query, 'shroud', shroud, true);
  }
  if (cluesEnabled) {
    applyRangeFilter(query, 'clues', clues, true);
    if (clues[0] !== clues[1] || clues[0] !== 0) {
      query.push(`(clues_fixed == ${cluesFixed} or linked_card.clues_fixed == ${cluesFixed})`);
    }
  }
  if (hauntedEnabled) {
    query.push(`(real_text CONTAINS '<b>Haunted</b>' or linked_card.real_text CONTAINS '<b>Haunted</b>')`);
  }
  if (query.length !== oldLength) {
    query.push(`(type_code == 'location' or linked_card.type_code == 'location')`);
  }
}

function applyEnemyFilters(filters: FilterState, query: string[]) {
  const {
    // toggle filters
    enemyElite,
    enemyNonElite,
    enemyHunter,
    enemyNonHunter,
    enemyRetaliate,
    enemyAlert,
    enemyParley,
    enemySpawn,
    enemyPrey,
    enemyAloof,
    enemyMassive,
    enemySwarm,
    // range filters
    enemyEvade,
    enemyEvadeEnabled,
    enemyFight,
    enemyFightEnabled,
    enemyHealth,
    enemyHealthEnabled,
    enemyHealthPerInvestigator,
    enemyDamage,
    enemyDamageEnabled,
    enemyHorror,
    enemyHorrorEnabled,
  } = filters;
  const oldLength = query.length;
  if (enemyElite && !enemyNonElite) {
    query.push(`(traits_normalized CONTAINS[c] 'elite' or linked_card.traits_normalized CONTAINS[c] 'elite')`);
  }
  if (enemyNonElite && !enemyElite) {
    query.push(`((type_code == 'enemy' and !(traits_normalized CONTAINS[c] 'elite')) or (linked_card.type_code == 'enemy' and !(linked_card.traits_normalized CONTAINS[c] 'elite')))`);
  }
  if (enemyRetaliate) {
    query.push(`(real_text CONTAINS 'Retaliate.' or linked_card.real_text CONTAINS 'Retaliate.')`);
  }
  if (enemyAlert) {
    query.push(`(real_text CONTAINS 'Alert.' or linked_card.real_text CONTAINS 'Alert.')`);
  }
  if (enemyHunter && !enemyNonHunter) {
    query.push(`(real_text CONTAINS 'Hunter.' or linked_card.real_text CONTAINS 'Hunter.')`);
  }
  if (enemyNonHunter && !enemyHunter) {
    query.push(`((type_code == 'enemy' and !(real_text CONTAINS 'Hunter.')) or (linked_card.type_code == 'enemy' and !(linked_card.real_text CONTAINS 'Hunter.')))`);
  }
  if (enemySpawn) {
    query.push(`(real_text CONTAINS 'Spawn' or linked_card.real_text CONTAINS 'Spawn')`);
  }
  if (enemyPrey) {
    query.push(`(real_text CONTAINS 'Prey' or linked_card.real_text CONTAINS 'Prey')`);
  }
  if (enemyAloof) {
    query.push(`(real_text CONTAINS 'Aloof.' or linked_card.real_text CONTAINS 'Aloof.')`);
  }
  if (enemyParley) {
    query.push(`(real_text CONTAINS 'Parley.' or linked_card.real_text CONTAINS 'Parley.')`);
  }
  if (enemyMassive) {
    query.push(`(real_text CONTAINS 'Massive.' or linked_card.real_text CONTAINS 'Massive.')`);
  }
  if (enemySwarm) {
    query.push(`(real_text CONTAINS 'Swarm.' or linked_card.real_text CONTAINS 'Swarm.')`);
  }
  if (enemyFightEnabled) {
    applyRangeFilter(query, 'enemy_fight', enemyFight, true);
  }
  if (enemyEvadeEnabled) {
    applyRangeFilter(query, 'enemy_evade', enemyEvade, true);
  }
  if (enemyDamageEnabled) {
    applyRangeFilter(query, 'enemy_damage', enemyDamage, true);
  }
  if (enemyHorrorEnabled) {
    applyRangeFilter(query, 'enemy_horror', enemyHorror, true);
  }
  if (enemyHealthEnabled) {
    applyRangeFilter(query, 'health', enemyHealth, true);
    query.push(`((type_code == 'enemy' and health_per_investigator == ${enemyHealthPerInvestigator}) or (linked_card.type_code == 'enemy' && linked_card.health_per_investigator == ${enemyHealthPerInvestigator}))`);
  }
  if (query.length !== oldLength ||
    (enemyHunter && enemyNonHunter) ||
    (enemyElite && enemyNonElite)) {
    query.push(`(type_code == 'enemy' or linked_card.type_code == 'enemy')`);
  }
}

function applyMiscFilter(filters: FilterState, query: string[]) {
  const {
    victory,
    vengeance,
  } = filters;
  if (victory) {
    query.push('victory >= 0 or linked_card.victory >= 0');
  }
  if (vengeance) {
    query.push('vengeance >= 0 or linked_card.vengeance >= 0');
  }
}

function applyLevelFilter(filters: FilterState, query: string[]) {
  const {
    levelEnabled,
    level,
    exceptional,
    nonExceptional,
  } = filters;
  if (levelEnabled) {
    applyRangeFilter(query, 'xp', level, false);
    if (exceptional && !nonExceptional) {
      query.push(`(real_text CONTAINS 'Exceptional.' or linked_card.real_text CONTAINS 'Exceptional.')`);
    }
    if (nonExceptional && !exceptional) {
      query.push(`!(real_text CONTAINS 'Exceptional.' or linked_card.real_text CONTAINS 'Exceptional.')`);
    }
  }
}

function applyCostFilter(filters: FilterState, query: string[]) {
  const {
    costEnabled,
    cost,
  } = filters;
  if (costEnabled) {
    applyRangeFilter(query, 'cost', cost, false);
  }
}

function applyFilter(values: string[], field: string, query: string[]) {
  if (values.length) {
    query.push(`(${map(values, value => `${field} == "${safeValue(value)}"`).join(' or ')})`);
  }
}

function applyPlayerCardFilters(filters: FilterState, query: string[]) {
  const {
    uses,
    unique,
    fast,
    bonded,
    seal,
    myriad,
    evadeAction,
    fightAction,
    investigateAction,
    permanent,
    exile,
  } = filters;
  applySlotFilter(filters, query);
  applyFilter(uses, 'uses', query);
  if (fast) {
    query.push(`(real_text CONTAINS 'Fast.' or linked_card.real_text CONTAINS 'Fast.')`);
  }
  if (bonded) {
    query.push(`(bonded_name != null or linked_card.bonded_name != null)`);
  }
  if (fightAction) {
    query.push(`(real_text CONTAINS '<b>Fight.</b>' or linked_card.real_text CONTAINS '<b>Fight.</b>')`);
  }
  if (evadeAction) {
    query.push(`(real_text CONTAINS '<b>Evade.</b>' or linked_card.real_text CONTAINS '<b>Evade.</b>')`);
  }
  if (investigateAction) {
    query.push(`(real_text CONTAINS '<b>Investigate.</b>' or linked_card.real_text CONTAINS '<b>Investigate.</b>')`);
  }
  if (permanent) {
    query.push(`(real_text CONTAINS 'Permanent.' or linked_card.real_text CONTAINS 'Permanent.')`);
  }
  if (exile) {
    query.push(`(real_text CONTAINS[c] 'exile' or linked_card.real_text CONTAINS[c] 'exile')`);
  }
  if (unique) {
    query.push('((is_unique == true or linked_card.is_unique == true) && type_code != "enemy")');
  }
  if (seal) {
    query.push(`(seal == true or linked_card.seal == true)`);
  }
  if (myriad) {
    query.push(`(real_text CONTAINS 'Myriad.' or linked_card.real_text CONTAINS 'Myriad.')`);
  }
}

export function filterToQuery(filters: FilterState): string[] {
  const query = [];
  if (filters.factions.length) {
    query.push(`(${map(filters.factions, value => `faction_code == "${safeValue(value)}" or faction2_code == "${safeValue(value)}"`).join(' or ')})`);
  }
  applyFilter(filters.types, 'type_name', query);
  applyFilter(filters.subTypes, 'subtype_name', query);
  applyPlayerCardFilters(filters, query);
  applyFilter(filters.packs, 'pack_name', query);
  applyFilter(filters.encounters, 'encounter_name', query);
  applyFilter(filters.illustrators, 'illustrator', query);
  if (filters.skillEnabled) {
    applySkillIconFilter(filters.skillIcons, query);
  }
  applyMiscFilter(filters, query);
  applyLevelFilter(filters, query);
  applyCostFilter(filters, query);
  applyTraitFilter(filters, query);
  applyEnemyFilters(filters, query);
  applyLocationFilters(filters, query);
  return query;
}

export default {
  filterToQuery,
};
