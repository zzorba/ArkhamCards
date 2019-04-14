import Realm from 'realm';
import { forEach, filter, keys, map, min } from 'lodash';

import { t } from 'ttag';
import CardRequirement from './CardRequirement';
import CardRestrictions from './CardRestrictions';
import DeckRequirement from './DeckRequirement';
import RandomRequirement from './RandomRequirement';
import DeckOption from './DeckOption';
import DeckOptionLevel from './DeckOptionLevel';
import DeckAtLeastOption from './DeckAtLeastOption';
import { BASIC_SKILLS, FactionCodeType, SkillCodeType, TypeCodeType } from '../constants';

const USES_REGEX = new RegExp('.*Uses\\s*\\([0-9]+\\s(.+)\\)\\..*');
const HEALS_HORROR_REGEX = new RegExp('[Hh]eals? (that much )?(\\d+ damage (and|or) )?(\\d+ )?horror');

export default class Card {
  public static schema: Realm.ObjectSchema = {
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
      faction2_code: { type: 'string', optional: true, indexed: true },
      faction2_name: 'string?',
      position: 'int',
      enemy_damage: 'int?',
      enemy_horror: 'int?',
      enemy_fight: 'int?',
      enemy_evade: 'int?',
      encounter_code: 'string?',
      encounter_name: 'string?',
      encounter_position: 'int?',
      exceptional: 'bool?',
      xp: { type: 'int', optional: true, indexed: true },
      victory: 'int?',
      vengeance: 'int?',
      renderName: 'string',
      renderSubname: 'string?',
      name: 'string',
      real_name: 'string',
      subname: 'string?',
      firstName: 'string?',
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
      shroud: 'int?',
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
      // Effective skills (add wilds to them)
      eskill_willpower: 'int?',
      eskill_intellect: 'int?',
      eskill_combat: 'int?',
      eskill_agility: 'int?',
      linked_to_code: 'string?',
      linked_to_name: 'string?',

      // Parsed data (from original)
      restrictions: 'CardRestrictions?',
      deck_requirements: 'DeckRequirement?',
      deck_options: 'DeckOption[]',
      linked_card: 'Card',
      back_linked: 'bool?',

      // Derived data.
      altArtInvestigator: 'bool?',
      cycle_name: 'string?',
      has_restrictions: 'bool',
      traits_normalized: 'string?',
      real_traits_normalized: 'string?',
      slots_normalized: 'string?',
      uses: 'string?',
      heals_horror: 'bool?',
      sort_by_type: 'int',
      sort_by_faction: 'int',
      sort_by_pack: 'int',
    },
  };

  public code!: string;
  public pack_code!: string;
  public pack_name!: string;
  public type_code!: TypeCodeType;
  public type_name!: string;
  public subtype_code?: 'basicweakness' | 'weakness';
  public subtype_name!: string | null;
  public slot!: string | null;
  public faction_code?: FactionCodeType;
  public faction_name!: string | null;
  public faction2_code?: FactionCodeType;
  public faction2_name!: string | null;
  public position!: number;
  public enemy_damage!: number | null;
  public enemy_horror!: number | null;
  public enemy_fight!: number | null;
  public enemy_evade!: number | null;
  public encounter_code!: string | null;
  public encounter_name!: string | null;
  public encounter_position!: number | null;
  public exceptional?: boolean;
  public xp!: number | null;
  public victory!: number | null;
  public vengeance!: number | null;
  public renderName!: string;
  public renderSubname!: string | null;
  public name!: string;
  public real_name!: string;
  public subname!: string | null;
  public firstName!: string | null;
  public illustrator!: string | null;
  public text!: string | null;
  public flavor!: string | null;
  public cost!: number | null;
  public real_text!: string | null;
  public back_name!: string | null;
  public back_text!: string | null;
  public back_flavor!: string | null;
  public quantity!: number | null;
  public spoiler?: boolean;
  public stage!: number | null; // Act/Agenda deck
  public clues!: number | null;
  public shroud!: number | null;
  public clues_fixed?: boolean;
  public doom!: number | null;
  public health!: number | null;
  public health_per_investigator?: boolean;
  public sanity!: number | null;
  public deck_limit!: number | null;
  public traits!: string | null;
  public real_traits!: string | null;
  public is_unique?: boolean;
  public exile?: boolean;
  public hidden?: boolean;
  public permanent?: boolean;
  public double_sided?: boolean;
  public url!: string | null;
  public octgn_id!: string | null;
  public imagesrc!: string | null;
  public backimagesrc!: string | null;
  public skill_willpower!: number | null;
  public skill_intellect!: number | null;
  public skill_combat!: number | null;
  public skill_agility!: number | null;
  public skill_wild!: number | null;
  // Effective skills (add wilds to them)
  public eskill_willpower!: number | null;
  public eskill_intellect!: number | null;
  public eskill_combat!: number | null;
  public eskill_agility!: number | null;
  public linked_to_code!: string | null;
  public linked_to_name!: string | null;

  // Parsed data (from original)
  public restrictions?: CardRestrictions;
  public deck_requirements?: DeckRequirement;
  public deck_options!: DeckOption[];
  public linked_card?: Card;
  public back_linked?: boolean;

  // Derived data.
  public altArtInvestigator?: boolean;
  public cycle_name!: string | null;
  public has_restrictions!: boolean;
  public traits_normalized!: string | null;
  public real_traits_normalized!: string | null;
  public slots_normalized!: string | null;
  public uses!: string | null;
  public heals_horror?: boolean;
  public sort_by_type!: number;
  public sort_by_faction!: number;
  public sort_by_pack!: number;

  factionCode(): FactionCodeType {
    return this.faction_code || 'neutral';
  }

  costString(linked?: boolean) {
    if (this.type_code !== 'asset' && this.type_code !== 'event') {
      return '';
    }
    if (this.permanent ||
      this.double_sided ||
      linked ||
      (this.cost === null && (
        this.subtype_code === 'weakness' ||
        this.subtype_code === 'basicweakness'))) {
      return t`Cost: -`;
    }
    const costString = this.cost !== null ? this.cost : 'X';
    return t`Cost: ${costString}`;
  }

  skillCount(skill: SkillCodeType): number {
    switch (skill) {
      case 'willpower': return this.skill_willpower || 0;
      case 'intellect': return this.skill_intellect || 0;
      case 'combat': return this.skill_combat || 0;
      case 'agility': return this.skill_agility || 0;
      case 'wild': return this.skill_wild || 0;
      default:
        const _exhaustiveCheck: never = skill;
        return 0;
    }
  }

  static parseDeckRequirements(json: any) {
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

  static parseDeckOptions(jsonList: any[]) {
    return map(jsonList, json => {
      const deck_option = new DeckOption();
      deck_option.faction = json.faction || [];
      deck_option.uses = json.uses || [];
      deck_option.text = json.text || [];
      deck_option.trait = json.trait || [];
      deck_option.type_code = json.type || [];
      deck_option.limit = json.limit;
      deck_option.error = json.error;
      deck_option.not = json.not ? true : undefined;

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

  static parseRestrictions(json?: { investigator?: { [key: string]: string} }) {
    if (json && json.investigator && keys(json.investigator).length) {
      const result = new CardRestrictions();
      result.investigators = keys(json.investigator);
      const mainInvestigator = min(result.investigators);
      if (mainInvestigator) {
        result.investigator = mainInvestigator;
      }
      return result;
    }
    return null;
  }

  static factionHeaderOrder() {
    return [
      t`Guardian / Rogue`,
      t`Rogue / Survivor`,
      t`Survivor / Seeker`,
      t`Seeker / Mystic`,
      t`Mystic / Guardian`,
      t`Guardian`,
      t`Seeker`,
      t`Mystic`,
      t`Rogue`,
      t`Survivor`,
      t`Neutral`,
      t`Weakness`,
      t`Mythos`,
    ];
  }

  static factionCodeToName(code: string, defaultName: string) {
    switch(code) {
      case 'guardian':
        return t`Guardian`;
      case 'rogue':
        return t`Rogue`;
      case 'mystic':
        return t`Mystic`;
      case 'seeker':
        return t`Seeker`;
      case 'survivor':
        return t`Survivor`;
      case 'neutral':
        return t`Neutral`;
      default:
        return defaultName;
    }
  }

  static factionSortHeader(json: any) {
    if (json.spoiler) {
      return t`Mythos`;
    }
    switch(json.subtype_code) {
      case 'basicweakness':
      case 'weakness':
        return t`Weakness`;
      default: {
        if (!json.faction_code || !json.faction_name) {
          return t`Unknown`;
        }
        if (json.faction2_code && json.faction2_name) {
          const faction1 = Card.factionCodeToName(json.faction_code, json.faction_name);
          const faction2 = Card.factionCodeToName(json.faction2_code, json.faction2_name);
          return `${faction1} / ${faction2}`;
        }
        return Card.factionCodeToName(json.faction_code, json.faction_name);
      }
    }
  }

  static typeHeaderOrder() {
    return [
      t`Investigator`,
      t`Asset: Hand`,
      t`Asset: Hand x2`,
      t`Asset: Hand. Arcane`,
      t`Asset: Body. Hand x2`,
      t`Asset: Accessory`,
      t`Asset: Ally`,
      t`Asset: Arcane`,
      t`Asset: Arcane x2`,
      t`Asset: Body`,
      t`Asset: Permanent`,
      t`Asset: Tarot`,
      t`Asset: Other`,
      t`Event`,
      t`Skill`,
      t`Basic Weakness`,
      t`Weakness`,
      t`Scenario`,
      t`Story`,
    ];
  }

  static typeSortHeader(json: any): string {
    if (json.hidden && json.linked_card) {
      return Card.typeSortHeader(json.linked_card);
    }
    switch(json.subtype_code) {
      case 'basicweakness':
        return t`Basic Weakness`;
      case 'weakness':
        if (json.spoiler) {
          return t`Story`;
        }
        return t`Weakness`;
      default:
        switch(json.type_code) {
          case 'asset':
            if (json.spoiler) {
              return t`Story`;
            }
            if (json.permanent || json.double_sided) {
              return t`Asset: Permanent`;
            }
            switch(json.slot) {
              case 'Hand':
                return t`Asset: Hand`;
              case 'Hand x2':
                return t`Asset: Hand x2`;
              case 'Accessory':
                return t`Asset: Accessory`;
              case 'Ally':
                return t`Asset: Ally`;
              case 'Arcane':
                return t`Asset: Arcane`;
              case 'Arcane x2':
                return t`Asset: Arcane x2`;
              case 'Body':
                return t`Asset: Body`;
              case 'Tarot':
                return t`Asset: Tarot`;
              case 'Body. Hand x2':
                return t`Asset: Body. Hand x2`;
              case 'Hand. Arcane':
                return t`Asset: Hand. Arcane`;
              default:
                return t`Asset: Other`;
            }
          case 'event':
            if (json.spoiler) {
              return t`Story`;
            }
            return t`Event`;
          case 'skill':
            if (json.spoiler) {
              return t`Story`;
            }
            return t`Skill`;
          case 'investigator':
            if (json.spoiler) {
              return t`Story`;
            }
            return t`Investigator`;
          default:
            return t`Scenario`;
        }
    }
  }

  static fromJson(
    json: any,
    packsByCode: {[pack_code: string]: { position: number, cycle_position: number}},
    cycleNames: {[cycle_code: string]: string},
    lang: string): Card {
    if (json.code === '02041') {
      json.subtype_code = null;
      json.subtype_name = null;
    }
    const deck_requirements = json.deck_requirements ?
      Card.parseDeckRequirements(json.deck_requirements) :
      null;
    const deck_options = json.deck_options ?
      Card.parseDeckOptions(json.deck_options) :
      [];

    const wild = json.skill_wild || 0;
    const eskills: any = {};
    if (json.type_code !== 'investigator' && wild > 0) {
      forEach(BASIC_SKILLS, skill => {
        const value = json[`skill_${skill}`] || 0;
        if (value > 0) {
          eskills[`eskill_${skill}`] = value + wild;
        }
      });
    }

    const name = json.name.replace('', '');
    let renderName = name;
    let renderSubname = json.subname;
    if (json.type_code === 'act' && json.stage) {
      renderSubname = t`Act ${json.stage}`;
    } else if (json.type_code === 'agenda' && json.stage) {
      renderSubname = t`Agenda ${json.stage}`;
    } else if (json.type_code === 'scenario') {
      renderSubname = t`Scenario`;
    }
    const linked_card = json.linked_card ?
      Card.fromJson(json.linked_card, packsByCode, cycleNames, lang) :
      null;
    if (linked_card) {
      linked_card.back_linked = true;
      if (json.hidden && !linked_card.hidden) {
        renderName = linked_card.name;
        if (linked_card.type_code === 'act' && linked_card.stage) {
          renderSubname = t`Act ${linked_card.stage}`;
        } else if (linked_card.type_code === 'agenda' && linked_card.stage) {
          renderSubname = t`Agenda ${linked_card.stage}`;
        } else {
          renderSubname = linked_card.subname;
        }
      }
    }

    const real_traits_normalized = json.real_traits ? map(
      filter(
        map(json.real_traits.split('.'), trait => trait.toLowerCase().trim()),
        trait => trait),
      trait => `#${trait}#`).join(',') : null;
    const traits_normalized = json.traits ? map(
      filter(
        map(json.traits.split('.'), trait => trait.toLowerCase().trim()),
        trait => trait),
      trait => `#${trait}#`).join(',') : null;
    const slots_normalized = json.slot ? map(
      filter(
        map(json.slot.split('.'), slot => slot.toLowerCase().trim()),
        slot => slot),
      slot => `#${slot}#`).join(',') : null;
    const restrictions = Card.parseRestrictions(json.restrictions);
    const uses_match = json.real_text && json.real_text.match(USES_REGEX);
    const uses = uses_match ? uses_match[1].toLowerCase() : null;

    const heals_horror_match = json.real_text && json.real_text.match(HEALS_HORROR_REGEX);
    const heals_horror = heals_horror_match ? true : null;

    const sort_by_type = Card.typeHeaderOrder().indexOf(Card.typeSortHeader(json));
    const sort_by_faction = Card.factionHeaderOrder().indexOf(Card.factionSortHeader(json));
    const pack = packsByCode[json.pack_code] || null;
    const sort_by_pack = pack ? (pack.cycle_position * 100 + pack.position) : -1;
    const cycle_name = pack ? cycleNames[pack.cycle_position] : null;
    const spoiler = !!(json.spoiler || (linked_card && linked_card.spoiler));
    const enemy_horror = json.type_code === 'enemy' ? (json.enemy_horror || 0) : null;
    const enemy_damage = json.type_code === 'enemy' ? (json.enemy_damage || 0) : null;
    const firstName = json.type_code === 'investigator' && json.name.indexOf(' ') !== -1 ?
      json.name.substring(0, json.name.indexOf(' ')).replace(/"/g, '') :
      json.name;

    const altArtInvestigator =
      json.code === '98001' || // Jenny
      json.code === '98004' || // Roland
      json.code === '98010' || // Carolyn
      json.code === '99001'; // PROMO Marie

    return Object.assign(
      {},
      json,
      eskills,
      {
        name,
        firstName,
        renderName,
        renderSubname,
        deck_requirements,
        deck_options,
        linked_card,
        spoiler,
        traits_normalized,
        real_traits_normalized,
        slots_normalized,
        uses,
        cycle_name,
        has_restrictions: !!restrictions,
        restrictions,
        heals_horror,
        sort_by_type,
        sort_by_faction,
        sort_by_pack,
        enemy_horror,
        enemy_damage,
        altArtInvestigator,
      },
    );
  }
}

export type CardKey = keyof Card;
export interface CardsMap {
  [code: string]: Card
};
