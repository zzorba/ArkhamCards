import { find, findIndex, flatMap, forEach, map, partition } from 'lodash';

import { QueryParams } from '@data/sqlite/types';
import { BASIC_QUERY, combineQueries, combineQueriesOpt, where } from '@data/sqlite/query';
import { SKILLS, FactionCodeType, CARD_FACTION_CODES, specialPacksSet, specialPacks } from '@app_constants';
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
  [key: string]: string[] | boolean | number | [number, number] | SkillIconsFilters | SkillModifierFilters;
  factions: FactionCodeType[];
  uses: string[];
  types: string[];
  subTypes: string[];
  xpLevels: string[];
  traits: string[];
  actions: string[];
  taboo_set: number;
  skillModifiers: SkillModifierFilters;
  skillModifiersEnabled: boolean;
  packCodes: string[];
  packNames: string[];
  cycleNames: string[];
  slots: string[];
  encounters: string[];
  illustrators: string[];
  levelEnabled: boolean;
  xpCostEnabled: boolean;
  exceptional: boolean;
  nonExceptional: boolean;
  costEnabled: boolean;
  costEven: boolean;
  costOdd: boolean;
  customizable: boolean;
  victory: boolean;
  multiClass: boolean;
  skillEnabled: boolean;
  unique: boolean;
  nonUnique: boolean;
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
  locationVictoryEnabled: boolean;
  locationVengeanceEnabled: boolean;
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
  enemyConcealed: boolean;
  enemySpawn: boolean;
  enemyPrey: boolean;
  enemyAloof: boolean;
  enemyMassive: boolean;
  enemySwarm: boolean;
  enemyPatrol: boolean;
  enemyVictory: boolean;
  enemyVengeance: boolean;
  // Slider controls that are dynamically sized
  level: [number, number];
  xpCost: [number, number];
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
  parley: '<b>Parley.</b>',
};

export const defaultFilterState: FilterState = {
  factions: [],
  uses: [],
  types: [],
  subTypes: [],
  xpLevels: [],
  actions: [],
  traits: [],
  taboo_set: 0,
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
  costEven: false,
  costOdd: false,
  victory: false,
  skillEnabled: false,
  unique: false,
  nonUnique: false,
  permanent: false,
  fast: false,
  bonded: false,
  customizable: false,
  fightAction: false,
  investigateAction: false,
  evadeAction: false,
  exile: false,
  myriad: false,
  multiClass: false,
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
  locationVictoryEnabled: false,
  locationVengeanceEnabled: false,
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
  enemyConcealed: false,
  enemySpawn: false,
  enemyPrey: false,
  enemyAloof: false,
  enemyMassive: false,
  enemySwarm: false,
  enemyPatrol: false,
  enemyVictory: false,
  enemyVengeance: false,
  xpCostEnabled: false,
  // Slider controls that are dynamically sized
  level: [0, 5],
  xpCost: [0, 10],
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
export const UNIQUE_FILTER: Brackets = where('c.is_unique = 1');
export const NON_STORY_FILTER: Brackets = where('c.xp is not null');

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
    linked: boolean,
    formula: (model: string, field: string, ) => string = (model: string, field: string): string => `${model}.${field}`
  ): Brackets[] {
    if (values[0] === values[1]) {
      const fieldName = this.fieldName([field, 'value']);
      return [
        where(
          `${formula('c', field)} = :${fieldName}${linked ? ` OR (linked_card.${field} is not null AND ${formula('linked_card', field)} = :${fieldName})` : ''}`,
          { [fieldName]: values[0] },
        ),
      ];
    }
    const minFieldName = this.fieldName([field, 'min']);
    const maxFieldName = this.fieldName([field, 'max']);
    return [where(
      `(${formula('c', field)} >= :${minFieldName} AND ${formula('c', field)} <= :${maxFieldName})${linked ? ` OR (linked_card.${field} is not null AND (${formula('linked_card', field)} >= :${minFieldName} AND ${formula('linked_card', field)} <= :${maxFieldName}))` : ''}`,
      {
        [minFieldName]: values[0],
        [maxFieldName]: values[1],
      },
    )];
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
    const [none, otherSlots] = partition(slots, s => s === 'none');
    const clause: Brackets[] = this.complexVectorClause(
      'slot',
      map(otherSlots, slot => `%#${slot}#%`),
      (valueName: string) => `c.real_slots_normalized LIKE :${valueName}`
    );
    if (!none.length) {
      return clause;
    }
    const noneClause: Brackets = where(`c.real_slots_normalized is null AND c.type_code = 'asset' and NOT c.permanent`);
    return [combineQueries(noneClause, clause, 'or')];
  }

  customizableFilter(filters: FilterState): Brackets[] {
    if (!filters.customizable) {
      return [];
    }
    return [where('c.customization_options is not null')];
  }

  traitFilter(traits: string[], localizedTraits: boolean): Brackets[] {
    const traits_field = localizedTraits ? 'traits_normalized' : 'real_traits_normalized';
    return this.complexVectorClause(
      'trait',
      map(traits, trait => `%#${trait.toLowerCase()}#%`),
      (valueName: string) => `c.${traits_field} LIKE :${valueName} OR (linked_card.${traits_field} is not null AND linked_card.${traits_field} LIKE :${valueName})`
    );
  }

  tagFilter(tags: string[]): Brackets[] {
    if (!tags.length) {
      return [];
    }
    if (tags.length === 1 && tags[0] === 'the_insane') {
      return [];
    }
    return this.complexVectorClause(
      'tag',
      map(tags, tag => `%${tag}%`),
      (valueName: string) => `c.tags LIKE :${valueName} OR (linked_card.tags is not null AND linked_card.tags LIKE :${valueName})`
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
        new Brackets(qb => qb.where(`c.type_code != 'investigator'`)
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
      locationVengeanceEnabled,
      locationVictoryEnabled,
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
    if (locationVictoryEnabled) {
      result.push(where('c.victory >= 0 or linked_card.victory >= 0'));
    }
    if (locationVengeanceEnabled) {
      result.push(VENGEANCE_FILTER);
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
      enemyConcealed,
      enemyParley,
      enemySpawn,
      enemyPrey,
      enemyAloof,
      enemyMassive,
      enemySwarm,
      enemyPatrol,
      enemyVengeance,
      enemyVictory,
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
        where(`(c.type_code = 'enemy' AND c.health_per_investigator = ${enemyHealthPerInvestigator ? 1 : 0}) OR (linked_card.type_code = 'enemy' AND linked_card.health_per_investigator = ${enemyHealthPerInvestigator ? 1 : 0})`),
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

    if (enemyConcealed) {
      result.push(where(`c.real_text LIKE '%Concealed%' or linked_card.real_text LIKE '%Concealed%'`));
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
    if (enemyPatrol) {
      result.push(where(`c.real_text LIKE '%Patrol%' or linked_card.real_text LIKE '%Patrol%'`));
    }
    if (enemyVictory) {
      result.push(where('c.victory >= 0 or linked_card.victory >= 0'));
    }
    if (enemyVengeance) {
      result.push(VENGEANCE_FILTER);
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
      multiClass,
    } = filters;
    const result: Brackets[] = [];
    if (multiClass) {
      result.push(where('c.faction2_code is not null'));
    }
    if (victory) {
      result.push(where('c.victory >= 0 or linked_card.victory >= 0'));
    }
    return result;
  }

  xpCostFilter(filters: FilterState): Brackets[] {
    const {
      xpCostEnabled,
      xpCost,
    } = filters;
    if (!xpCostEnabled || !xpCost) {
      return [];
    }
    const q = this.rangeFilter('xp', xpCost, false, (model: string, field: string) => {
      return `(((${model}.${field}) * (case ${model}.exceptional when TRUE then 2 else 1 end)) + COALESCE(${model}.extra_xp, 0))`;
    });
    if (xpCost[0] > 0) {
      return [
        combineQueries(where(`c.customization_options is not null`), q, 'or'),
      ];
    }
    return q;
  }

  xpLevelFilter(filters: FilterState): Brackets[] {
    const {
      levelEnabled,
      level,
    } = filters;
    if (!levelEnabled) {
      return [];
    }
    const q = this.rangeFilter('xp', level, false);
    if (level[0] > 0) {
      return [
        combineQueries(where(`c.customization_options is not null`), q, 'or'),
      ];
    }
    return q;
  }

  levelFilter(filters: FilterState): Brackets[] {
    const {
      exceptional,
      nonExceptional,
    } = filters;
    const result = this.xpLevelFilter(filters);
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
      costEven,
      costOdd,
      cost,
    } = filters;
    if (costEnabled) {
      const costQuery = this.rangeFilter('cost', cost, false);
      if (costEven || costOdd) {
        if (costEven && costOdd) {
          return costQuery;
        }
        if (costEven) {
          return [combineQueries(
            where('c.cost is not null AND c.cost % 2 = 0'),
            costQuery,
            'and'
          )];
        }
        return [combineQueries(
          where('c.cost is not null AND c.cost % 2 = 1'),
          costQuery,
          'and'
        )];
      }
      return costQuery;
    }
    return [];
  }

  equalsVectorClause(values: string[], field: string, valuePrefix?: string[], noLinked?: boolean): Brackets[] {
    if (values.length) {
      const valueName = this.fieldName([...(valuePrefix || []), field]);
      return [
        where(
          noLinked ? `c.${field} IN (:...${valueName})` : `c.${field} IN (:...${valueName}) OR linked_card.${field} IN (:...${valueName})`,
          { [valueName]: values }
        ),
      ];
    }
    return [];
  }

  packCodes(packCodes: string[]): Brackets[] {
    const [specialPackCodes, normalPacks] = partition(packCodes, code => specialPacksSet.has(code));
    const result: Brackets[] = [];

    const packClause = this.equalsVectorClause(normalPacks, 'pack_code');
    if (packClause.length && normalPacks.length) {
      const [packCode, ...otherCodes] = normalPacks;
      result.push(
        combineQueries(
          where(`c.reprint_pack_codes is not NULL AND c.reprint_pack_codes like :packCode`, { packCode: `%${packCode}%` }),
          [
            ...map(otherCodes, (c, idx) =>
              where(`c.reprint_pack_codes is not NULL AND c.reprint_pack_codes like :packCode${idx}`, { [`packCode${idx}`]: `%${c}%` }),
            ),
            ...packClause,
          ],
          'or'
        ),
      );
    }
    if (specialPackCodes.length) {
      const packs = flatMap(specialPackCodes, code => find(specialPacks, pack => pack.code === code) ?? []);
      const [playerPacks, campaignPacks] = partition(packs, pack => pack.player);
      if (playerPacks.length) {
        result.push(
          combineQueries(
            where(`c.encounter_code is null`),
            this.equalsVectorClause(flatMap(playerPacks, pack => pack.packs), 'pack_code'),
            'and'
          ),
        );
      }
      if (campaignPacks.length) {
        result.push(
          combineQueries(
            where(`c.encounter_code is not null`),
            this.equalsVectorClause(flatMap(campaignPacks, pack => pack.packs), 'pack_code'),
            'and'
          ),
        );
      }
    }
    if (result.length) {
      const [first, ...others] = result;
      return [combineQueries(first, others, 'or')];
    }
    return [];
  }

  playerCardFilters(filters: FilterState): Brackets[] {
    const {
      uses,
      unique,
      nonUnique,
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
      result.push(where('(c.is_unique = 1 OR linked_card.is_unique = 1) AND c.type_code != "enemy"'));
    } else if (nonUnique) {
      result.push(where('(c.is_unique is null OR c.is_unique = 0 OR linked_card.is_unique = 0) AND c.type_code != "enemy"'));
    }
    if (seal) {
      result.push(where(`c.seal = 1 or linked_card.seal = 1`));
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
    const bondedClause = where(
      `c.${field} IN (:...bonded_names)`,
      { bonded_names }
    );
    return combineQueries(BASIC_QUERY, [bondedClause], 'and');
  }

  upgradeCardsByNameFilter(real_names: string[]): Brackets | undefined {
    const nameClause = where(
      `c.real_name IN (:...real_names)`,
      { real_names }
    );
    const levelClause = where(`c.xp is not null AND c.xp > 0`);
    return combineQueries(BASIC_QUERY, [nameClause, levelClause], 'and');
  }

  factionFilter(factions: FactionCodeType[]): Brackets[] {
    return this.complexVectorClause(
      'faction',
      factions,
      valueName => `(c.faction_code = :${valueName} OR c.faction2_code = :${valueName} OR c.faction3_code = :${valueName})`
    );
  }

  tabooSetFilter(taboo_set: number): Brackets[] {
    if (taboo_set === 0) {
      return [];
    }
    return [
      where(`c.taboo_set_id = :taboo_set AND c.taboo_placeholder is null`, { taboo_set }),
    ];
  }

  filterToQuery(filters: FilterState, localizedTraits: boolean): Brackets | undefined {
    return combineQueriesOpt(
      [
        ...this.tabooSetFilter(filters.taboo_set),
        ...this.factionFilter(filters.factions),
        ...this.equalsVectorClause(filters.types, 'type_code'),
        ...this.equalsVectorClause(filters.subTypes, 'subtype_code'),
        ...this.playerCardFilters(filters),
        ...this.packCodes(filters.packCodes),
        ...this.equalsVectorClause(filters.encounters, 'encounter_name'),
        ...this.equalsVectorClause(filters.illustrators, 'illustrator'),
        ...this.miscFilter(filters),
        ...this.levelFilter(filters),
        ...this.xpCostFilter(filters),
        ...this.costFilter(filters),
        ...this.customizableFilter(filters),
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