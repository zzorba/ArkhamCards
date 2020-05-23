import { filter, findIndex, forEach, keys, map } from 'lodash';

import { QueryClause, QueryParams } from 'data/types';
import { CARD_FACTION_CODES, SKILLS, FactionCodeType } from 'constants';
import Card from 'data/Card';

export interface CardFilterData {
  hasCost: boolean;
  hasXp: boolean;
  hasSkill: boolean;
  allUses: string[];
  allFactions: FactionCodeType[];
  allTraits: string[];
  allTypes: string[];
  allTypeCodes: string[];
  allSubTypes: string[];
  allPacks: string[];
  allSlots: string[];
  allEncounters: string[];
  allIllustrators: string[];
}

export function calculateCardFilterData(cards: Card[]): CardFilterData {
  const factionsMap: { [key: string]: boolean } = {};
  let hasCost = false;
  let hasXp = false;
  let hasSkill = false;
  const typesMap: { [key: string]: boolean } = {};
  const typeCodesMap: { [key: string]: boolean } = {};
  const usesMap: { [key: string]: boolean } = {};
  const subTypesMap: { [key: string]: boolean } = {};
  const traitsMap: { [key: string]: boolean } = {};
  const packsMap: { [key: string]: boolean } = {};
  const slotsMap: { [key: string]: boolean } = {};
  const encountersMap: { [key: string]: boolean } = {};
  const illustratorsMap: { [key: string]: boolean } = {};
  forEach(cards, card => {
    if (card.faction_code) {
      factionsMap[card.faction_code] = true;
    }
    if (card.faction2_code) {
      factionsMap[card.faction2_code] = true;
    }
    if (card.cost !== null) {
      hasCost = true;
    }
    if (card.xp !== null) {
      hasXp = true;
    }
    if (!hasSkill && (
      card.skill_willpower ||
      card.skill_intellect ||
      card.skill_combat ||
      card.skill_agility ||
      card.skill_wild
    )) {
      hasSkill = true;
    }
    if (card.traits) {
      forEach(
        filter(map(card.traits.split('.'), t => t.trim()), t => !!t),
        t => {
          traitsMap[t] = true;
        });
    }
    if (card.subtype_name) {
      subTypesMap[card.subtype_name] = true;
    }
    if (card.uses) {
      usesMap[card.uses] = true;
    }
    if (card.pack_name) {
      packsMap[card.pack_name] = true;
    }
    if (card.slot) {
      if (card.slot.indexOf('.') !== -1) {
        forEach(
          map(card.slot.split('.'), s => s.trim()),
          s => {
            slotsMap[s] = true;
          }
        );
      } else {
        slotsMap[card.slot] = true;
      }
    }
    if (card.encounter_name) {
      encountersMap[card.encounter_name] = true;
    }
    if (card.illustrator) {
      illustratorsMap[card.illustrator] = true;
    }
    typesMap[card.type_name] = true;
    typeCodesMap[card.type_code] = true;
  });

  const allFactions: FactionCodeType[] = filter(
    CARD_FACTION_CODES,
    factionCode => !!factionsMap[factionCode]
  );
  return {
    allFactions,
    hasCost,
    hasXp,
    hasSkill,
    allUses: keys(usesMap).sort(),
    allTraits: keys(traitsMap).sort(),
    allTypes: keys(typesMap).sort(),
    allTypeCodes: keys(typeCodesMap).sort(),
    allSubTypes: keys(subTypesMap).sort(),
    allPacks: keys(packsMap).sort(),
    allSlots: keys(slotsMap).sort(),
    allEncounters: keys(encountersMap).sort(),
    allIllustrators: keys(illustratorsMap).sort(),
  };
}


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

function rangeFilter(
  field: string,
  values: [number, number],
  linked: boolean
): QueryClause[] {
  if (values[0] === values[1]) {
    return[{
      q: `(c.${field} = :value${linked ? ` OR linked_card.${field} = :value` : ''})`,
      params: {
        value: values[0],
      },
    }];
  }
  return[{
    q: `((c.${field} >= :value_0 and c.${field} <= :value_1)${linked ? ` or (linked_card.${field} >= :value_0 and linked_card.${field} <= :value_1)` : ''})`,
    params: {
      value_0: values[0],
      value_1: values[1],
    },
  }];
}

function complexVectorClause(
  elements: string[],
  clause: (valueName: string) => string
): QueryClause[] {
  if (!elements.length) {
    return [];
  }
  const params: QueryParams = {};
  const query = map(elements, (value, index) => {
    const valueName = `v${index}`;
    params[valueName] = value;
    return clause(valueName);
  }).join(' OR ');
  return [{
    q: `(${query})`,
    params,
  }];
}

function slotFilter(filters: FilterState): QueryClause[] {
  const {
    slots,
  } = filters;
  return complexVectorClause(
    map(slots, slot => `%#${slot}#%`),
    (valueName: string) => `c.slots_normalized LIKE :${valueName}`
  );
}

export function traitFilter(traits: string[]): QueryClause[] {
  return complexVectorClause(
    map(traits, trait => `%#${trait}#%`),
    (valueName: string) => `c.traits_normalized LIKE :${valueName} OR linked_card.traits_normalized LIKE :${valueName}`
  );
}

function skillIconFilter(filters: FilterState): QueryClause[] {
  if (!filters.skillEnabled) {
    return [];
  }
  const { skillIcons } = filters;
  const parts: string[] = [];
  const doubleIcons = skillIcons.doubleIcons;
  const matchAll = doubleIcons &&
    (findIndex(SKILLS, skill => skillIcons[skill]) === -1);

  forEach(SKILLS, skill => {
    if (matchAll || skillIcons[skill]) {
      parts.push(`c.skill_${skill} > ${doubleIcons ? 1 : 0}`);
    }
  });

  if (parts.length) {
    // Kick out investigators because they re-use the same field
    // and by definition cannot have skill icons.
    return [
      { q: `(c.type_code != 'investigator')` },
      { q: `(${parts.join(' OR ')})`},
    ];
  }
  return [];
}

function locationFilters(filters: FilterState): QueryClause[] {
  const {
    shroudEnabled,
    shroud,
    cluesEnabled,
    clues,
    cluesFixed,
    hauntedEnabled,
  } = filters;
  const result: QueryClause[] = [
    ...(shroudEnabled ? rangeFilter('shroud', shroud, true) : []),
    ...(cluesEnabled ? [
      ...rangeFilter('shroud', shroud, true),
    ] : []),
  ];
  if (cluesEnabled && (clues[0] !== clues[1] || clues[0] !== 0)) {
    result.push({
      q: `(c.clues_fixed = ${cluesFixed} OR linked_card.clues_fixed = ${cluesFixed})`,
    })
  }
  if (hauntedEnabled) {
    result.push({
      q: `(c.real_text LIKE '%<b>Haunted</b>%' or linked_card.real_text LIKE '%<b>Haunted</b>%')`,
    });
  }
  if (result.length) {
    result.push({
      q: `(c.type_code = 'location' or linked_card.type_code = 'location')`,
    });
  }
  return result;
}

function enemyFilters(filters: FilterState): QueryClause[] {
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
  const result: QueryClause[] = [
    ...(enemyFightEnabled ? rangeFilter('enemy_fight', enemyFight, true) : []),
    ...(enemyEvadeEnabled ? rangeFilter('enemy_evade', enemyEvade, true) : []),
    ...(enemyDamageEnabled ? rangeFilter('enemy_damage', enemyDamage, true) : []),
    ...(enemyHorrorEnabled ? rangeFilter('enemy_horror', enemyHorror, true) : []),
    ...(enemyHealthEnabled ? [
      ...rangeFilter('health', enemyHealth, true),
      {
        q: `((c.type_code = 'enemy' AND c.health_per_investigator = ${enemyHealthPerInvestigator}) or (linked_card.type_code = 'enemy' AND linked_card.health_per_investigator = ${enemyHealthPerInvestigator}))`,
      }
    ] : []),
  ];
  if (enemyElite && !enemyNonElite) {
    result.push({
      q: `(c.traits_normalized LIKE '%#elite#%' or linked_card.traits_normalized LIKE '%#elite#%')`,
    });
  }
  if (enemyNonElite && !enemyElite) {
    result.push({
      q: `((c.type_code = 'enemy' and not (c.traits_normalized LIKE '%#elite#%')) OR (linked_card.type_code = 'enemy' and not (linked_card.traits_normalized LIKE '%#elite#%')))`,
    });
  }
  if (enemyRetaliate) {
    result.push({
      q: `(c.real_text LIKE '%Retaliate.%' OR linked_card.real_text LIKE '%Retaliate.%')`,
    });
  }
  if (enemyAlert) {
    result.push({
      q: `(c.real_text LIKE '%Alert.%' or linked_card.real_text LIKE '%Alert.%')`,
    });
  }
  if (enemyHunter && !enemyNonHunter) {
    result.push({
      q: `(c.real_text LIKE '%Hunter.%' or linked_card.real_text LIKE '%Hunter.%')`,
    });
  }
  if (enemyNonHunter && !enemyHunter) {
    result.push({
      q: `((c.type_code = 'enemy' AND not (c.real_text LIKE '%Hunter.%')) or (linked_card.type_code = 'enemy' and not (linked_card.real_text LIKE '%Hunter.%')))`,
    });
  }
  if (enemySpawn) {
    result.push({
      q: `(c.real_text LIKE '%Spawn%' OR linked_card.real_text LIKE '%Spawn%')`,
    });
  }
  if (enemyPrey) {
    result.push({
      q: `(c.real_text LIKE '%Prey%' OR linked_card.real_text LIKE '%Prey%')`,
    });
  }
  if (enemyAloof) {
    result.push({
      q: `(c.real_text LIKE '%Aloof.%' or linked_card.real_text LIKE '%Aloof.%')`,
    });
  }
  if (enemyParley) {
    result.push({
      q: `(c.real_text LIKE '%Parley.%' or linked_card.real_text LIKE '%Parley.%')`,
    });
  }
  if (enemyMassive) {
    result.push({
      q: `(c.real_text LIKE '%Massive.%' or linked_card.real_text LIKE '%Massive.%')`,
    });
  }
  if (enemySwarm) {
    result.push({
      q: `(c.real_text LIKE '%Swarm.%' or linked_card.real_text LIKE '%Swarm.%')`,
    });
  }

  if (result.length ||
    (enemyHunter && enemyNonHunter) ||
    (enemyElite && enemyNonElite)) {
    result.push({
      q: `(c.type_code = 'enemy' or linked_card.type_code = 'enemy')`,
    });
  }
  return result;
}

export const VENGEANCE_FILTER: QueryClause = {
  q: '(c. >= 0 or linked_card.vengeance >= 0)',
};

function miscFilter(filters: FilterState): QueryClause[] {
  const {
    victory,
    vengeance,
  } = filters;
  const result: QueryClause[] = [];
  if (victory) {
    result.push({
      q: '(c.victory >= 0 or linked_card.victory >= 0)',
    });
  }
  if (vengeance) {
    result.push(VENGEANCE_FILTER);
  }
  return result;
}

function levelFilter(filters: FilterState): QueryClause[] {
  const {
    levelEnabled,
    level,
    exceptional,
    nonExceptional,
  } = filters;
  if (!levelEnabled) {
    return [];
  }
  const result = rangeFilter('xp', level, false);
  if (exceptional && !nonExceptional) {
    result.push({
      q: `(c.real_text LIKE '%Exceptional.%' or linked_card.real_text LIKE '%Exceptional.%')`,
    });
  }
  if (nonExceptional && !exceptional) {
    result.push({
      q: `(NOT (c.real_text LIKE '%Exceptional.%' or linked_card.real_text LIKE '%Exceptional.%'))`,
    });
  }
  return result;
}

function costFilter(filters: FilterState): QueryClause[] {
  const {
    costEnabled,
    cost,
  } = filters;
  if (costEnabled) {
    return rangeFilter('cost', cost, false);
  }
  return [];
}

export function equalsVectorClause(values: string[], field: string): QueryClause[] {
  if (values.length) {
    return [{
      q: `(c.${field} IN (:...values) OR linked_card.${field} IN (:...values))`,
      params: { values },
    }];
  }
  return [];
}

export const UNIQUE_FILTER: QueryClause = {
  q: '((c.is_unique = true or linked_card.is_unique = true) AND c.type_code != "enemy")',
};

function playerCardFilters(filters: FilterState): QueryClause[] {
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
  const result: QueryClause[] = [
    ...slotFilter(filters),
    ...equalsVectorClause(uses, 'uses'),
  ];
  if (fast) {
    result.push({
      q: `(c.real_text LIKE '%Fast.%' or linked_card.real_text LIKE '%Fast.%')`,
    });
  }
  if (bonded) {
    result.push({
      q: `(c.bonded_name is not null or linked_card.bonded_name is not null)`,
    });
  }
  if (fightAction) {
    result.push({
      q: `(c.real_text LIKE '%<b>Fight.</b>%' or linked_card.real_text LIKE '%<b>Fight.</b>%')`,
    });
  }
  if (evadeAction) {
    result.push({
      q: `(c.real_text LIKE '%<b>Evade.</b>%' or linked_card.real_text LIKE '%<b>Evade.</b>%')`,
    });
  }
  if (investigateAction) {
    result.push({
      q: `(c.real_text LIKE '%<b>Investigate.</b>%' or linked_card.real_text LIKE '%<b>Investigate.</b>%')`,
    });
  }
  if (permanent) {
    result.push({
      q: `(c.real_text LIKE '%Permanent.%' or linked_card.real_text LIKE '%Permanent.%')`,
    });
  }
  if (exile) {
    result.push({
      q: `(c.real_text LIKE '%exile%' or linked_card.real_text LIKE '%exile%')`,
    });
  }
  if (unique) {
    result.push(UNIQUE_FILTER);
  }
  if (seal) {
    result.push({
      q: `(c.seal = true or linked_card.seal = true)`,
    });
  }
  if (myriad) {
    result.push({
      q: `(c.real_text LIKE '%Myriad.%' or linked_card.real_text LIKE '%Myriad.%')`,
    });
  }
  return result;
}

export function filterToQuery(filters: FilterState): QueryClause[] {
  return [
    ...equalsVectorClause(filters.factions, 'faction_code'),
    ...equalsVectorClause(filters.factions, 'faction2_code'),
    ...equalsVectorClause(filters.types, 'type_name'),
    ...equalsVectorClause(filters.subTypes, 'subtype_name'),
    ...playerCardFilters(filters),
    ...equalsVectorClause(filters.packs, 'pack_name'),
    ...equalsVectorClause(filters.encounters, 'encounter_name'),
    ...equalsVectorClause(filters.illustrators, 'illustrator'),
    ...miscFilter(filters),
    ...levelFilter(filters),
    ...costFilter(filters),
    ...traitFilter(filters.traits),
    ...enemyFilters(filters),
    ...locationFilters(filters),
    ...skillIconFilter(filters),
    ];
}

export default {
  filterToQuery,
  traitFilter,
};
