import { concat, forEach, map, filter } from 'lodash';

import Card from '@data/types/Card';
import { CardFilterData, FilterState, defaultFilterState } from '@lib/filters';
import Database from '@data/sqlite/Database';
import { Brackets } from 'typeorm/browser';
import { tabooSetQuery } from '@data/sqlite/query';
import { CARD_FACTION_CODES } from '@app_constants';

function update(value: number | undefined | null, minMax: [number, number]): [number, number] {
  if (value === undefined || value === null || value < 0) {
    return minMax;
  }
  return [
    Math.min(value, minMax[0]),
    Math.max(value, minMax[1]),
  ];
}


export async function calculateDefaultDbFilterState(
  db: Database,
  query?: Brackets,
  tabooSetId?: number
): Promise<[FilterState, CardFilterData]> {
  const cards = await db.cards();
  let factionsQuery = cards.createQueryBuilder('c')
    .select('distinct c.faction_code as faction_code')
    .leftJoin('c.linked_card', 'linked_card')
    .where(tabooSetQuery(tabooSetId));
  let cardsQuery = cards.createQueryBuilder('c')
    .select([
      'max(c.xp ) as xp, max(linked_card.xp) as linked_xp',
      'max(c.cost) as cost, max(linked_card.cost) as linked_cost',
      'max(c.shroud) as shroud, max(linked_card.shroud) as linked_shroud',
      'max(c.clues) as clues, max(linked_card.clues) as linked_clues',
      'max(case when c.type_code = "enemy" then c.health else 0 end) as health, max(case when linked_card.type_code = "enemy" then linked_card.health else 0 end) as linked_health',
      'max(c.enemy_damage) as enemy_damage, max(linked_card.enemy_damage) as linked_enemy_damage',
      'max(c.enemy_horror) as enemy_horror, max(linked_card.enemy_horror) as linked_enemy_horror',
      'max(c.enemy_fight) as enemy_fight, max(linked_card.enemy_fight) as linked_enemy_fight',
      'max(c.enemy_evade) as enemy_evade, max(linked_card.enemy_evade) as linked_enemy_evade',
      'max(case when c.slot is not null then 1 else 0 end) as has_slot',
      'max(case when c.uses is not null then 1 else 0 end) as has_uses',
      'max(case when c.subtype_code is not null then 1 else 0 end) as has_weakness',
    ].join(', '))
    .leftJoin('c.linked_card', 'linked_card')
    .where(tabooSetQuery(tabooSetId));
  if (query) {
    cardsQuery = cardsQuery.andWhere(query);
    factionsQuery = factionsQuery.andWhere(query);
  }
  const countsP = cardsQuery.getRawMany();
  const factionsP = factionsQuery.getRawMany();
  const counts = (await countsP)[0];
  const fields = {
    level: 'xp',
    cost: 'cost',
    shroud: 'shroud',
    clues: 'clues',
    health: 'health',
    enemyDamage: 'enemy_damage',
    enemyHorror: 'enemy_horror',
    enemyFight: 'enemy_fight',
    enemyEvade: 'enemy_evade',
  };
  const filterState = {
    ...defaultFilterState,
  };
  forEach(fields, (dbField, field) => {
    filterState[field] = [0, Math.max(counts[dbField], counts[`linked_${dbField}`])];
  });
  const allFactions = map((await factionsP), result => result.faction_code);
  const factions = new Set(allFactions);
  const filterData: CardFilterData = {
    hasCost: (counts.cost !== null || counts.linked_cost !== null),
    hasLocation: (counts.shroud !== null || counts.linked_shroud !== null),
    hasEnemy: (counts.health !== null || counts.linked_health !== null),
    hasXp: (counts.xp !== null || counts.linked_xp !== null),
    hasWeakness: !!counts.has_weakness,
    allFactions: filter(
      CARD_FACTION_CODES,
      code => factions.has(code)
    ),
    hasSlot: !!counts.has_slot,
    hasUses: !!counts.has_uses,
    hasSkill: true,
  };
  return [filterState, filterData];

}

export function calculateDefaultFilterState(cards: Card[]) {
  const fields = [
    'xp',
    'cost',
  ];
  const locationFields = [
    'shroud',
    'clues',
  ];
  const enemyFields = [
    'health',
    'enemy_damage',
    'enemy_horror',
    'enemy_fight',
    'enemy_evade',
  ];

  const result: { [field: string]: [number, number]} = {
    xp: [10, 0],
    cost: [12, 0],
    shroud: [10, 0],
    clues: [10, 0],
    health: [10, 0],
    enemy_damage: [10, 0],
    enemy_horror: [10, 0],
    enemy_fight: [10, 0],
    enemy_evade: [10, 0],
  };
  forEach(concat(fields, concat(locationFields, enemyFields)), field => {
    result[field] = [10, 0];
  });
  forEach(cards, card => {
    result.xp = update(card.xp, result.xp);
    result.cost = update(card.cost, result.cost);
    if (card.type_code === 'location') {
      result.shroud = update(card.shroud, result.shroud);
      result.clues = update(card.clues, result.clues);
    }
    if (card.type_code === 'enemy') {
      result.health = update(card.health, result.health);
      result.enemy_damage = update(card.enemy_damage, result.enemy_damage);
      result.enemy_horror = update(card.enemy_horror, result.enemy_horror);
      result.enemy_fight = update(card.enemy_fight, result.enemy_fight);
      result.enemy_evade = update(card.enemy_evade, result.enemy_evade);
    }
    if (card.linked_card) {
      result.xp = update(card.linked_card.xp, result.xp);
      result.cost = update(card.linked_card.cost, result.cost);
      if (card.linked_card.type_code === 'location') {
        result.shroud = update(card.linked_card.shroud, result.shroud);
        result.clues = update(card.linked_card.clues, result.clues);
      }
      if (card.linked_card.type_code === 'enemy') {
        result.health = update(card.linked_card.health, result.health);
        result.enemy_damage = update(card.linked_card.enemy_damage, result.enemy_damage);
        result.enemy_horror = update(card.linked_card.enemy_horror, result.enemy_horror);
        result.enemy_fight = update(card.linked_card.enemy_fight, result.enemy_fight);
        result.enemy_evade = update(card.linked_card.enemy_evade, result.enemy_evade);
      }
    }
  });

  return {
    ...defaultFilterState,
    level: result.xp,
    cost: result.cost,
    shroud: result.shroud,
    clues: result.clues,
    enemyHealth: result.health,
    enemyDamage: result.enemy_damage,
    enemyHorror: result.enemy_horror,
    enemyFight: result.enemy_fight,
    enemyEvade: result.enemy_evade,
  };
}
