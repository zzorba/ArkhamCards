import { concat, forEach } from 'lodash';
const defaultFilterState = {
  factions: [],
  uses: [],
  types: [],
  subTypes: [],
  xpLevels: [],
  traits: [],
  packs: [],
  cycleNames: [],
  playerFiltersEnabled: false,
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
  exile: false,
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
  enemyKeywordsEnabled: false,
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

function update(value, minMax) {
  if (value === null || value < 0) {
    return minMax;
  }
  return [
    Math.min(value, minMax[0]),
    Math.max(value, minMax[1]),
  ];
}

export default function calculateDefaultFilterState(cards) {
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

  const result = {};
  forEach(concat(fields, concat(locationFields, enemyFields)), field => {
    result[field] = [10, 0];
  });
  forEach(cards, card => {
    forEach(fields, field => {
      result[field] = update(card[field], result[field]);
      if (card.linked_card) {
        result[field] = update(card.linked_card[field], result[field]);
      }
    });
    if (card.type_code === 'location') {
      forEach(locationFields, field => {
        result[field] = update(card[field], result[field]);
      });
    }
    if (card.type_code === 'enemy') {
      forEach(enemyFields, field => {
        result[field] = update(card[field], result[field]);
      });
    }
    if (card.linked_card) {
      if (card.linked_card.type_code === 'location') {
        forEach(locationFields, field => {
          result[field] = update(card.linked_card[field], result[field]);
        });
      }
      if (card.linked_card.type_code === 'enemy') {
        forEach(enemyFields, field => {
          result[field] = update(card.linked_card[field], result[field]);
        });
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
