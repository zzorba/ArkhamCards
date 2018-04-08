import { filter, keys, map } from 'lodash';

import CardRequirement from './CardRequirement';
import CardRestrictions from './CardRestrictions';
import DeckRequirement from './DeckRequirement';
import RandomRequirement from './RandomRequirement';
import DeckOption from './DeckOption';
import DeckOptionLevel from './DeckOptionLevel';
import DeckAtLeastOption from './DeckAtLeastOption';

const USES_REGEX = new RegExp('.*Uses\\s*\\([0-9]+\\s(.+)\\)\\..*');
const HEALS_HORROR_REGEX = new RegExp('[Hh]eals? (\\d+ damage (and|or) )?(\\d+ )?horror');
export default class Card {
  static parseDeckRequirements(json) {
    const dr = new DeckRequirement();
    dr.card = map(keys(json.card), code => {
      const cr = new CardRequirement();
      cr.code = code;
      cr.alternates = filter(
        keys(json.card[code]),
        altCode => altCode !== code
      );
      return cr;
    });
    dr.random = map(json.random, r => {
      const rr = new RandomRequirement();
      rr.target = r.target;
      rr.value = r.value;
      return rr;
    });
    dr.size = json.size;

    return dr;
  }

  static parseDeckOptions(jsonList) {
    return map(jsonList, json => {
      const deck_option = new DeckOption();
      deck_option.faction = json.faction || [];
      deck_option.uses = json.uses || [];
      deck_option.text = json.text || [];
      deck_option.trait = json.trait || [];
      deck_option.limit = json.limit;
      deck_option.error = json.error;
      deck_option.not = json.not ? true : null;

      if (json.level) {
        const level = new DeckOptionLevel();
        level.min = json.level.min;
        level.max = json.level.max;
        deck_option.level = level;
      }

      if (json.atleast) {
        const atleast = new DeckAtLeastOption();
        atleast.factions = json.atleast.factions;
        atleast.min = json.atleast.min;
        deck_option.atleast = atleast;
      }

      return deck_option;
    });
  }

  static parseRestrictions(json) {
    const result = new CardRestrictions();
    result.investigator = json.investigator;
    return result;
  }

  static fromJson(json) {
    const deck_requirements = json.deck_requirements ?
      Card.parseDeckRequirements(json.deck_requirements) :
      null;
    const deck_options = json.deck_options ?
      Card.parseDeckOptions(json.deck_options) :
      [];

    const linked_card = json.linked_card ? Card.fromJson(json.linked_card) : null;

    const traits_normalized = json.traits &&
      map(json.traits.split('\\.'),
        trait => `#${trait.toLowerCase().trim()}#`
      ).join(',');
    const restrictions = json.restrictions ?
      Card.parseRestrictions(json.restrictions) :
      null;

    const uses_match = json.text && json.text.match(USES_REGEX);
    const uses = uses_match ? uses_match[1].toLowerCase() : null;

    const heals_horror_match = json.real_text && json.real_text.match(HEALS_HORROR_REGEX);
    const heals_horror = heals_horror_match ? true : null;
    return Object.assign(
      {},
      json,
      {
        deck_requirements,
        deck_options,
        linked_card,
        spoiler: !!json.spoiler,
        traits_normalized,
        uses,
        restrictions,
        heals_horror,
      },
    );
  }
}

Card.schema = {
  name: 'Card',
  primaryKey: 'code',
  properties: {
    code: 'string', // primary key
    pack_code: 'string',
    pack_name: 'string',
    type_code: { type: 'string', indexed: true },
    type_name: 'string',
    subtype_code: 'string?',
    subtype_name: 'string?',
    slot: 'string?',
    faction_code: { type: 'string', optional: true, indexed: true },
    faction_name: 'string?',
    position: 'int',
    encounter_code: 'string?',
    encounter_name: 'string?',
    encounter_position: 'int?',
    exceptional: 'bool?',
    xp: { type: 'int', optional: true, indexed: true },
    victory: 'int?',
    name: 'string',
    real_name: 'string',
    subname: 'string?',
    illustrator: 'string?',
    text: 'string?',
    flavor: 'string?',
    cost: 'int?',
    real_text: 'string?',
    back_name: 'string?',
    back_text: 'string?',
    back_flavor: 'string?',
    quantity: 'int?',
    spoiler: 'bool?',
    stage: 'int?', // Act/Agenda deck
    clues: 'int?',
    clues_fixed: 'bool?',
    doom: 'int?',
    health: 'int?',
    health_per_investigator: 'bool?',
    sanity: 'int?',
    deck_limit: 'int?',
    traits: 'string?',
    real_traits: 'string?',
    is_unique: 'bool?',
    exile: 'bool?',
    hidden: 'bool?',
    permanent: 'bool?',
    double_sided: 'bool',
    url: 'string?',
    octgn_id: 'string?',
    imagesrc: 'string?',
    backimagesrc: 'string?',
    skill_willpower: 'int?',
    skill_intellect: 'int?',
    skill_combat: 'int?',
    skill_agility: 'int?',
    skill_wild: 'int?',
    linked_to_code: 'string?',
    linked_to_name: 'string?',

    // Parsed data (from original)
    restrictions: 'CardRestrictions?',
    deck_requirements: 'DeckRequirement?',
    deck_options: 'DeckOption[]',
    linked_card: 'Card',

    // Derived data.
    traits_normalized: 'string?',
    uses: 'string?',
    heals_horror: 'bool?',
  },
};
