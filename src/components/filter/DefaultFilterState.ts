import { concat, forEach } from 'lodash';

import { Results } from 'realm';
import Card from 'data/Card';
import { defaultFilterState } from 'lib/filters';

function update(value: number | null, minMax: [number, number]): [number, number] {
  if (value === null || value < 0) {
    return minMax;
  }
  return [
    Math.min(value, minMax[0]),
    Math.max(value, minMax[1]),
  ];
}

export default function calculateDefaultFilterState(cards: Results<Card> | Card[]) {
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
    cost: [10, 0],
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

  return Object.assign(
    {},
    defaultFilterState,
    {
      level: result.xp,
      cost: result.cost,
      shroud: result.shroud,
      clues: result.clues,
      enemyHealth: result.health,
      enemyDamage: result.enemy_damage,
      enemyHorror: result.enemy_horror,
      enemyFight: result.enemy_fight,
      enemyEvade: result.enemy_evade,
    },
  );
}
