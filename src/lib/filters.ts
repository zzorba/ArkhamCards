import { findIndex, forEach, map } from 'lodash';

import { QueryParams } from '@data/sqlite/types';
import { BASIC_QUERY, combineQueries, combineQueriesOpt, where } from '@data/sqlite/query';
import { SKILLS, FactionCodeType, CARD_FACTION_CODES } from '@app_constants';
import { Brackets } from 'typeorm/browser';

export interface CardFilterData {
  hasCost: boolean;
  hasXp: boolean;
  hasSkill: boolean;
  hasSlot: boolean;
  hasUses: boolean;
  hasLocation: boolean;
  hasEnemy: boolean;
  hasWeakness: boolean;
  allFactions: FactionCodeType[];
}

export const DefaultCardFilterData: CardFilterData = {
  hasCost: true,
  hasXp: true,
  hasSkill: true,
  hasSlot: true,
  hasUses: true,
  hasLocation: true,
  hasEnemy: true,
  hasWeakness: true,
  allFactions: CARD_FACTION_CODES,
};

export interface SkillIconsFilters {
  willpower: boolean;
  intellect: boolean;
  combat: boolean;
  agility: boolean;
  wild: boolean;
  doubleIcons: boolean;
}

export interface SkillModifierFilters {
  willpower: boolean;
  intellect: boolean;
  combat: boolean;
  agility: boolean;
}

export interface FilterState {
  [key: string]: string[] | boolean | [number, number] | SkillIconsFilters | SkillModifierFilters;
  factions: FactionCodeType[];
  uses: string[];
  types: string[];
  subTypes: string[];
  xpLevels: string[];
  traits: string[];
  actions: string[];
  skillModifiers: SkillModifierFilters;
  skillModifiersEnabled: boolean;
  packCodes: string[];
  packNames: string[];
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

  assetHealthEnabled: boolean;
  assetHealth: [number, number];
  assetSanityEnabled: boolean;
  assetSanity: [number, number];
}

const ACTION_TEXT: { [key: string]: string } = {
  fight: '<b>Fight.</b>',
  engage: '<b>Engage.</b>',
  investigate: '<b>Investigate.</b>',
  play: '<b>Play.</b>',
  draw: '<b>Draw.</b>',
  move: '<b>Move.</b>',
  evade: '<b>Evade.</b>',
  resource: '<b>Resource.</b>',
};

export const defaultFilterState: FilterState = {
  factions: [],
  uses: [],
  types: [],
  subTypes: [],
  xpLevels: [],
  actions: [],
  traits: [],
  skillModifiers: {
    willpower: false,
    intellect: false,
    combat: false,
    agility: false,
  },
  skillModifiersEnabled: false,
  packCodes: [],
  packNames: [],
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
  assetHealthEnabled: false,
  assetHealth: [0, 4],
  assetSanityEnabled: false,
  assetSanity: [0, 4],
};


export const VENGEANCE_FILTER: Brackets = where('c.vengeance >= 0 or linked_card.vengeance >= 0');
export const UNIQUE_FILTER: Brackets = where('c.is_unique = true');

export default class FilterBuilder {
  prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  private fieldName(parts: string[]): string {
    return [
      this.prefix,
      ...parts,
    ].join('_');
  }

  rangeFilter(
    field: string,
    values: [number, number],
    linked: boolean
  ): Brackets[] {
    if (values[0] === values[1]) {
      const fieldName = this.fieldName([field, 'value']);
      return [
        where(
          `c.${field} = :${fieldName}${linked ? ` OR (linked_card.${field} is not null AND linked_card.${field} = :${fieldName})` : ''}`,
          { [fieldName]: values[0] },
        ),
      ];
    }
    const minFieldName = this.fieldName([field, 'min']);
    const maxFieldName = this.fieldName([field, 'max']);
    return [
      where(
        `(c.${field} >= :${minFieldName} AND c.${field} <= :${maxFieldName})${linked ? ` OR (linked_card.${field} is not null AND (linked_card.${field} >= :${minFieldName} AND linked_card.${field} <= :${maxFieldName}))` : ''}`,
        {
          [minFieldName]: values[0],
          [maxFieldName]: values[1],
        },
      ),
    ];
  }

  complexVectorClause(
    field: string,
    elements: string[],
    clause: (valueName: string) => string
  ): Brackets[] {
    if (!elements.length) {
      return [];
    }
    const params: QueryParams = {};
    const query = map(elements, (value, index) => {
      const fieldName = this.fieldName([field, `${index}`]);
      params[fieldName] = value;
      return clause(fieldName);
    }).join(' OR ');
    return [where(query, params)];
  }

  slotFilter(slots: string[]): Brackets[] {
    return this.complexVectorClause(
      'slot',
      map(slots, slot => `%#${slot}#%`),
      (valueName: string) => `c.real_slots_normalized LIKE :${valueName}`
    );
  }

  traitFilter(traits: string[], localizedTraits: boolean): Brackets[] {
    const traits_field = localizedTraits ? 'traits_normalized' : 'real_traits_normalized';
    return this.complexVectorClause(
      'trait',
      map(traits, trait => `%#${trait.toLowerCase()}#%`),
      (valueName: string) => `c.${traits_field} LIKE :${valueName} OR (linked_card.${traits_field} is not null AND linked_card.${traits_field} LIKE :${valueName})`
    );
  }

  skillIconFilter(filters: FilterState): Brackets[] {
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
        new Brackets(qb => qb.where(`(c.type_code != 'investigator')`)
          .andWhere(`(${parts.join(' OR ')})`)),
      ];
    }
    return [];
  }

  locationFilters(filters: FilterState): Brackets[] {
    const {
      shroudEnabled,
      shroud,
      cluesEnabled,
      clues,
      cluesFixed,
      hauntedEnabled,
    } = filters;
    const result: Brackets[] = [
      ...(shroudEnabled ? this.rangeFilter('shroud', shroud, true) : []),
      ...(cluesEnabled ? [
        ...this.rangeFilter('shroud', shroud, true),
      ] : []),
    ];
    if (cluesEnabled && (clues[0] !== clues[1] || clues[0] !== 0)) {
      result.push(where(`c.clues_fixed = ${cluesFixed} OR linked_card.clues_fixed = ${cluesFixed}`));
    }
    if (hauntedEnabled) {
      result.push(where(`c.real_text LIKE '%<b>Haunted</b>%' OR linked_card.real_text LIKE '%<b>Haunted</b>%'`));
    }
    if (result.length) {
      result.push(where(`c.type_code = 'location' OR linked_card.type_code = 'location'`));
    }
    return result;
  }

  skillModifierFilters(skillModifiers: SkillModifierFilters): Brackets[] {
    const result: Brackets[] = [];

    if (skillModifiers.agility) {
      result.push(where(`c.real_text LIKE '%+_ [agility]%'`));
    }
    if (skillModifiers.combat) {
      result.push(where(`c.real_text LIKE '%+_ [combat]%'`));
    }
    if (skillModifiers.willpower) {
      result.push(where(`c.real_text LIKE '%+_ [willpower]%'`));
    }
    if (skillModifiers.intellect) {
      result.push(where(`c.real_text LIKE '%+_ [intellect]%'`));
    }
    if (skillModifiers.agility || skillModifiers.combat || skillModifiers.willpower || skillModifiers.intellect) {
      result.push(where(`c.real_text LIKE '%+_ skill value%'`));
    }
    const combinedResult = combineQueriesOpt(result, 'or');
    if (combinedResult) {
      return [combinedResult];
    }
    return [];
  }

  assetFilters(filters: FilterState): Brackets[] {
    const {
      assetHealthEnabled,
      assetHealth,
      assetSanityEnabled,
      assetSanity,
      skillModifiersEnabled,
      skillModifiers,
    } = filters;
    const result: Brackets[] = [
      ...(assetHealthEnabled ? this.rangeFilter('health', assetHealth, true) : []),
      ...(assetSanityEnabled ? this.rangeFilter('sanity', assetSanity, true) : []),
      ...(skillModifiersEnabled ? this.skillModifierFilters(skillModifiers) : []),
    ];
    if (!result.length) {
      return [];
    }
    return [
      combineQueries(
        where(`c.type_code = 'asset' OR linked_card.type_code = 'asset'`),
        result,
        'and'
      ),
    ];
  }

  enemyFilters(filters: FilterState): Brackets[] {
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
    const result: Brackets[] = [
      ...(enemyFightEnabled ? this.rangeFilter('enemy_fight', enemyFight, true) : []),
      ...(enemyEvadeEnabled ? this.rangeFilter('enemy_evade', enemyEvade, true) : []),
      ...(enemyDamageEnabled ? this.rangeFilter('enemy_damage', enemyDamage, true) : []),
      ...(enemyHorrorEnabled ? this.rangeFilter('enemy_horror', enemyHorror, true) : []),
      ...(enemyHealthEnabled ? [
        ...this.rangeFilter('health', enemyHealth, true),
        where(`(c.type_code = 'enemy' AND c.health_per_investigator = ${enemyHealthPerInvestigator}) OR (linked_card.type_code = 'enemy' AND linked_card.health_per_investigator = ${enemyHealthPerInvestigator})`),
      ] : []),
    ];
    if (enemyElite && !enemyNonElite) {
      result.push(where(`c.real_traits_normalized LIKE '%#elite#%' or linked_card.real_traits_normalized LIKE '%#elite#%'`));
    }
    if (enemyNonElite && !enemyElite) {
      result.push(where(`(c.type_code = 'enemy' AND NOT (c.real_traits_normalized LIKE '%#elite#%')) OR (linked_card.type_code = 'enemy' AND NOT (linked_card.real_traits_normalized LIKE '%#elite#%'))`));
    }
    if (enemyRetaliate) {
      result.push(where(`c.real_text LIKE '%Retaliate.%' OR linked_card.real_text LIKE '%Retaliate.%'`));
    }
    if (enemyAlert) {
      result.push(where(`c.real_text LIKE '%Alert.%' OR linked_card.real_text LIKE '%Alert.%'`));
    }
    if (enemyHunter && !enemyNonHunter) {
      result.push(where(`c.real_text LIKE '%Hunter.%' OR linked_card.real_text LIKE '%Hunter.%'`));
    }
    if (enemyNonHunter && !enemyHunter) {
      result.push(where(`(c.type_code = 'enemy' AND NOT (c.real_text LIKE '%Hunter.%')) OR (linked_card.type_code = 'enemy' AND NOT (linked_card.real_text LIKE '%Hunter.%'))`));
    }
    if (enemySpawn) {
      result.push(where(`c.real_text LIKE '%Spawn%' OR linked_card.real_text LIKE '%Spawn%'`));
    }
    if (enemyPrey) {
      result.push(where(`c.real_text LIKE '%Prey%' OR linked_card.real_text LIKE '%Prey%'`));
    }
    if (enemyAloof) {
      result.push(where(`c.real_text LIKE '%Aloof.%' or linked_card.real_text LIKE '%Aloof.%'`));
    }
    if (enemyParley) {
      result.push(where(`c.real_text LIKE '%Parley.%' or linked_card.real_text LIKE '%Parley.%'`));
    }
    if (enemyMassive) {
      result.push(where(`c.real_text LIKE '%Massive.%' or linked_card.real_text LIKE '%Massive.%'`));
    }
    if (enemySwarm) {
      result.push(where(`c.real_text LIKE '%Swarming%' or linked_card.real_text LIKE '%Swarming%'`));
    }

    if (result.length ||
      (enemyHunter && enemyNonHunter) ||
      (enemyElite && enemyNonElite)) {
      result.push(where(`c.type_code = 'enemy' or linked_card.type_code = 'enemy'`));
    }
    return result;
  }


  miscFilter(filters: FilterState): Brackets[] {
    const {
      victory,
      vengeance,
    } = filters;
    const result: Brackets[] = [];
    if (victory) {
      result.push(where('c.victory >= 0 or linked_card.victory >= 0'));
    }
    if (vengeance) {
      result.push(VENGEANCE_FILTER);
    }
    return result;
  }

  levelFilter(filters: FilterState): Brackets[] {
    const {
      levelEnabled,
      level,
      exceptional,
      nonExceptional,
    } = filters;
    if (!levelEnabled) {
      return [];
    }
    const result = this.rangeFilter('xp', level, false);
    if (exceptional && !nonExceptional) {
      result.push(where(`c.real_text LIKE '%Exceptional.%' or linked_card.real_text LIKE '%Exceptional.%'`));
    }
    if (nonExceptional && !exceptional) {
      result.push(where(`NOT (c.real_text LIKE '%Exceptional.%' AND linked_card.real_text LIKE '%Exceptional.%')`));
    }
    return result;
  }

  costFilter(filters: FilterState): Brackets[] {
    const {
      costEnabled,
      cost,
    } = filters;
    if (costEnabled) {
      return this.rangeFilter('cost', cost, false);
    }
    return [];
  }

  equalsVectorClause(values: string[], field: string, valuePrefix?: string[]): Brackets[] {
    if (values.length) {
      const valueName = this.fieldName([...(valuePrefix || []), field]);
      return [
        where(
          `c.${field} IN (:...${valueName}) OR linked_card.${field} IN (:...${valueName})`,
          { [valueName]: values }
        ),
      ];
    }
    return [];
  }

  playerCardFilters(filters: FilterState): Brackets[] {
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
      slots,
      actions,
    } = filters;
    const result: Brackets[] = [
      ...this.slotFilter(slots),
      ...this.equalsVectorClause(uses, 'uses'),
    ];
    if (fast) {
      result.push(where(`c.real_text LIKE '%Fast.%' OR linked_card.real_text LIKE '%Fast.%'`));
    }
    if (bonded) {
      result.push(where(`c.bonded_name is not null OR linked_card.bonded_name is not null`));
    }
    if (fightAction) {
      result.push(where(`c.real_text LIKE '%<b>Fight.</b>%' OR linked_card.real_text LIKE '%<b>Fight.</b>%'`));
    }
    if (evadeAction) {
      result.push(where(`c.real_text LIKE '%<b>Evade.</b>%' OR linked_card.real_text LIKE '%<b>Evade.</b>%'`));
    }
    if (investigateAction) {
      result.push(where(`c.real_text LIKE '%<b>Investigate.</b>%' OR linked_card.real_text LIKE '%<b>Investigate.</b>%'`));
    }
    if (permanent) {
      result.push(where(`c.real_text LIKE '%Permanent.%' OR linked_card.real_text LIKE '%Permanent.%'`));
    }
    if (exile) {
      result.push(where(`c.real_text LIKE '%exile%' or linked_card.real_text LIKE '%exile%'`));
    }
    if (unique) {
      result.push(where('(c.is_unique = true OR linked_card.is_unique = true) AND c.type_code != "enemy"'));
    }
    if (seal) {
      result.push(where(`c.seal = true or linked_card.seal = true`));
    }
    if (myriad) {
      result.push(where(`c.real_text LIKE '%Myriad.%' or linked_card.real_text LIKE '%Myriad.%'`));
    }
    if (actions.length) {
      const parts: Brackets[] = [];
      forEach(actions, action => {
        if (ACTION_TEXT[action]) {
          parts.push(where(`c.real_text like '%${ACTION_TEXT[action]}%' or linked_card.real_text like '%${ACTION_TEXT[action]}%'`));
        }
      });
      const combined = combineQueriesOpt(parts, 'or');
      if (combined) {
        result.push(combined);
      }
    }
    return result;
  }

  bondedFilter(field: 'real_name' | 'bonded_name', bonded_names: string[]): Brackets | undefined {
    const bondedClause = combineQueriesOpt(
      this.complexVectorClause(
        field,
        bonded_names,
        valueName => `(c.${field} = :${valueName})`
      ), 'or');
    if (!bondedClause) {
      return undefined;
    }
    return combineQueries(BASIC_QUERY, [bondedClause], 'and');
  }

  factionFilter(factions: FactionCodeType[]): Brackets[] {
    return this.complexVectorClause(
      'faction',
      factions,
      valueName => `(c.faction_code = :${valueName} OR c.faction2_code = :${valueName} OR c.faction3_code = :${valueName})`
    );
  }

  filterToQuery(filters: FilterState, localizedTraits: boolean): Brackets | undefined {
    return combineQueriesOpt(
      [
        ...this.factionFilter(filters.factions),
        ...this.equalsVectorClause(filters.types, 'type_code'),
        ...this.equalsVectorClause(filters.subTypes, 'subtype_code'),
        ...this.playerCardFilters(filters),
        ...this.equalsVectorClause(filters.packCodes, 'pack_code'),
        ...this.equalsVectorClause(filters.encounters, 'encounter_name'),
        ...this.equalsVectorClause(filters.illustrators, 'illustrator'),
        ...this.miscFilter(filters),
        ...this.levelFilter(filters),
        ...this.costFilter(filters),
        ...this.traitFilter(filters.traits, localizedTraits),
        ...this.assetFilters(filters),
        ...this.enemyFilters(filters),
        ...this.locationFilters(filters),
        ...this.skillIconFilter(filters),
      ],
      'and'
    );
  }
}