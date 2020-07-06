import { Entity, Index, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm/browser';
import { forEach, filter, keys, map, min } from 'lodash';
import { t } from 'ttag';

import { TraumaAndCardData } from 'actions/types';
import { BASIC_SKILLS, RANDOM_BASIC_WEAKNESS, FactionCodeType, TypeCodeType, SkillCodeType } from 'app_constants';
import DeckRequirement from './DeckRequirement';
import DeckOption from './DeckOption';

const SERPENTS_OF_YIG = '04014';
const USES_REGEX = new RegExp('.*Uses\\s*\\([0-9]+\\s(.+)\\)\\..*');
const BONDED_REGEX = new RegExp('.*Bonded\\s*\\((.+?)\\)\\..*');
const SEAL_REGEX = new RegExp('.*Seal \\(.+\\)\\..*');
const HEALS_HORROR_REGEX = new RegExp('[Hh]eals? (that much )?((\\d+|all) damage (and|or) )?((\\d+|all) )?horror');

@Entity('card')
@Index(['code', 'taboo_set_id'], { unique: true })
export default class Card {
  @PrimaryColumn('text')
  public id!: string;

  @Index()
  @Column('text')
  public code!: string;

  @Column('text')
  public name!: string;

  @Column('text')
  public real_name!: string;

  @Index()
  @Column('text')
  public renderName!: string;

  @Column('text')
  public type_code!: TypeCodeType;

  @Column('text', { nullable: true })
  public alternate_of_code?: string;

  @Column('integer', { nullable: true })
  public taboo_set_id?: number;

  @Column('boolean', { nullable: true })
  public taboo_placeholder?: boolean;

  @Column('text', { nullable: true })
  public taboo_text_change?: string;

  @Index()
  @Column('text')
  public pack_code!: string;

  @Column('text', { nullable: true })
  public pack_name?: string;

  @Column('text')
  public type_name!: string;

  @Column('text', { nullable: true })
  public subtype_code?: 'basicweakness' | 'weakness';

  @Column('text', { nullable: true })
  public subtype_name?: string;

  @Column('text', { nullable: true })
  public slot?: string;

  @Index()
  @Column('text', { nullable: true })
  public faction_code?: FactionCodeType;

  @Column('text', { nullable: true })
  public faction_name?: string;

  @Column('text', { nullable: true })
  public faction2_code?: FactionCodeType;

  @Column('text', { nullable: true })
  public faction2_name?: string;

  @Column('integer', { nullable: true })
  public position?: number;

  @Column('integer', { nullable: true })
  public enemy_damage?: number;

  @Column('integer', { nullable: true })
  public enemy_horror?: number;

  @Column('integer', { nullable: true })
  public enemy_fight?: number;

  @Column('integer', { nullable: true })
  public enemy_evade?: number;

  @Column('text', { nullable: true })
  public encounter_code?: string;

  @Column('text', { nullable: true })
  public encounter_name?: string;

  @Column('integer', { nullable: true })
  public encounter_position?: number;

  @Column('boolean', { nullable: true })
  public exceptional?: boolean;

  @Index()
  @Column('integer', { nullable: true })
  public xp?: number;

  @Column('integer', { nullable: true })
  public extra_xp?: number;

  @Column('integer', { nullable: true })
  public victory?: number;

  @Column('integer', { nullable: true })
  public vengeance?: number;

  @Column('text', { nullable: true })
  public renderSubname?: string;

  @Column('text', { nullable: true })
  public subname?: string;

  @Column('text', { nullable: true })
  public firstName?: string;

  @Column('text', { nullable: true })
  public illustrator?: string;

  @Column('text', { nullable: true })
  public text?: string;

  @Column('text', { nullable: true })
  public flavor?: string;

  @Column('integer', { nullable: true })
  public cost?: number;
  @Column('text', { nullable: true })
  public real_text?: string;
  @Column('text', { nullable: true })
  public back_name?: string;
  @Column('text', { nullable: true })
  public back_text?: string;
  @Column('text', { nullable: true })
  public back_flavor?: string;
  @Column('integer', { nullable: true })
  public quantity?: number;
  @Column('boolean', { nullable: true })
  public spoiler?: boolean;
  @Column('boolean', { nullable: true })
  public advanced?: boolean;
  @Column('integer', { nullable: true })
  public stage?: number; // Act/Agenda deck
  @Column('integer', { nullable: true })
  public clues?: number;
  @Column('integer', { nullable: true })
  public shroud?: number;
  public clues_fixed?: boolean;
  @Column('integer', { nullable: true })
  public doom?: number;
  @Column('integer', { nullable: true })
  public health?: number;
  @Column('boolean', { nullable: true })
  public health_per_investigator?: boolean;
  @Column('integer', { nullable: true })
  public sanity?: number;

  @Index()
  @Column('integer', { nullable: true })
  public deck_limit?: number;
  @Column('text', { nullable: true })
  public traits?: string;
  @Column('text', { nullable: true })
  public real_traits?: string;
  @Column('boolean', { nullable: true })
  public is_unique?: boolean;
  @Column('boolean', { nullable: true })
  public exile?: boolean;
  @Column('boolean', { nullable: true })
  public hidden?: boolean;
  @Column('boolean', { nullable: true })
  public myriad?: boolean;
  @Column('boolean', { nullable: true })
  public permanent?: boolean;
  @Column('boolean', { nullable: true })
  public double_sided?: boolean;
  @Column('text', { nullable: true })
  public url?: string;
  @Column('text', { nullable: true })
  public octgn_id?: string;
  @Column('text', { nullable: true })
  public imagesrc?: string;
  @Column('text', { nullable: true })
  public backimagesrc?: string;
  @Column('integer', { nullable: true })
  public skill_willpower?: number;
  @Column('integer', { nullable: true })
  public skill_intellect?: number;
  @Column('integer', { nullable: true })
  public skill_combat?: number;
  @Column('integer', { nullable: true })
  public skill_agility?: number;
  @Column('integer', { nullable: true })
  public skill_wild?: number;

  // Effective skills (add wilds to them)
  @Column('integer', { nullable: true })
  public eskill_willpower?: number;
  @Column('integer', { nullable: true })
  public eskill_intellect?: number;
  @Column('integer', { nullable: true })
  public eskill_combat?: number;
  @Column('integer', { nullable: true })
  public eskill_agility?: number;
  @Column('text', { nullable: true })
  public linked_to_code?: string;
  @Column('text', { nullable: true })
  public linked_to_name?: string;

  @Column('simple-array', { nullable: true })
  public restrictions_all_investigators?: string[];
  @Column('text', { nullable: true })
  public restrictions_investigator?: string;

  @Column('simple-json', { nullable: true })
  public deck_requirements?: DeckRequirement;
  @Column('simple-json', { nullable: true })
  public deck_options?: DeckOption[];

  @ManyToOne(() => Card, card => card.id)
  @Index()
  @JoinColumn()
  public linked_card?: Card;

  @Column('boolean', { nullable: true })
  public back_linked?: boolean;

  // Derived data.
  @Column('boolean', { nullable: true })
  public altArtInvestigator?: boolean;
  @Column('text', { nullable: true })
  public cycle_name?: string;
  @Column('text', { nullable: true })
  public cycle_code?: string;
  @Column('boolean', { nullable: true })
  public has_restrictions?: boolean;
  @Column('boolean', { nullable: true })
  public has_upgrades?: boolean;
  @Column('text', { nullable: true })
  public traits_normalized?: string;
  @Column('text', { nullable: true })
  public real_traits_normalized?: string;
  @Column('text', { nullable: true })
  public slots_normalized?: string;
  @Column('text', { nullable: true })
  public uses?: string;
  @Column('text', { nullable: true })
  public bonded_name?: string;
  @Column('boolean', { nullable: true })
  public seal?: boolean;
  @Column('boolean', { nullable: true })
  public heals_horror?: boolean;
  @Column('integer', { nullable: true })
  public sort_by_type?: number;
  @Column('integer', { nullable: true })
  public sort_by_faction?: number;
  @Column('integer', { nullable: true })
  public sort_by_faction_pack?: number;
  @Column('integer', { nullable: true })
  public sort_by_pack?: number;

  public cardName(): string {
    return this.subname ? t`${this.name} <i>(${this.subname})</i>` : this.name;
  }

  isBasicWeakness(): boolean {
    return this.type_code !== 'scenario' &&
      this.subtype_code === 'basicweakness' &&
      this.code !== RANDOM_BASIC_WEAKNESS;
  }

  factionPackSortHeader() {
    return `${Card.factionSortHeader(this)} - ${this.cycle_name}`;
  }

  factionCode(): FactionCodeType {
    return this.faction_code || 'neutral';
  }

  killed(traumaData?: TraumaAndCardData) {
    if (!traumaData) {
      return false;
    }
    if (traumaData.killed) {
      return true;
    }
    return (this.health || 0) <= (traumaData.physical || 0);
  }

  insane(traumaData?: TraumaAndCardData) {
    if (!traumaData) {
      return false;
    }
    if (traumaData.insane) {
      return true;
    }
    return (this.sanity || 0) <= (traumaData.mental || 0);
  }

  eliminated(traumaData?: TraumaAndCardData) {
    return this.killed(traumaData) || this.insane(traumaData);
  }

  hasTrauma(traumaData?: TraumaAndCardData) {
    return this.eliminated(traumaData) || (traumaData && (
      (traumaData.physical || 0) > 0 ||
      (traumaData.mental || 0) > 0
    ));
  }

  traumaString(traumaData?: TraumaAndCardData) {
    if (!traumaData) {
      return t`None`;
    }
    const parts = [];
    if (traumaData.killed || (this.health || 0) <= (traumaData.physical || 0)) {
      return t`Killed`;
    }
    if (traumaData.insane || (this.sanity || 0) <= (traumaData.mental || 0)) {
      return t`Insane`;
    }
    if (traumaData.physical && traumaData.physical !== 0) {
      parts.push(t`${traumaData.physical} Physical`);
    }
    if (traumaData.mental && traumaData.mental !== 0) {
      parts.push(t`${traumaData.mental} Mental`);
    }
    if (!parts.length) {
      return t`None`;
    }
    return parts.join(', ');
  }

  realCost(linked?: boolean) {
    if (this.type_code !== 'asset' && this.type_code !== 'event') {
      return null;
    }
    if (
      this.code === '02010' ||
      this.code === '03238' ||
      this.cost === -2
    ) {
      return 'X';
    }
    if (this.permanent ||
      this.double_sided ||
      linked ||
      this.cost === null
    ) {
      return '-';
    }
    return `${this.cost}`;
  }

  costString(linked?: boolean) {
    const actualCost = this.realCost(linked);
    if (actualCost === null) {
      return '';
    }
    return t`Cost: ${actualCost}`;
  }

  skillCount(skill: SkillCodeType): number {
    switch (skill) {
      case 'willpower': return this.skill_willpower || 0;
      case 'intellect': return this.skill_intellect || 0;
      case 'combat': return this.skill_combat || 0;
      case 'agility': return this.skill_agility || 0;
      case 'wild': return this.skill_wild || 0;
      default: {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        const _exhaustiveCheck: never = skill;
        return 0;
      }
    }
  }

  investigatorSelectOptions(): DeckOption[] {
    if (this.type_code === 'investigator' && this.deck_options) {
      return filter(this.deck_options, option => {
        return !!(option.faction_select && option.faction_select.length > 0) ||
          !!(option.deck_size_select && option.deck_size_select.length > 0);
      });
    }
    return [];
  }

  static parseRestrictions(json?: {
    investigator?: {
      [key: string]: string;
    };
  }): Partial<Card> | undefined {
    if (json && json.investigator && keys(json.investigator).length) {
      const investigators = keys(json.investigator);
      const mainInvestigator = min(investigators);
      return {
        restrictions_all_investigators: investigators,
        restrictions_investigator: mainInvestigator,
      };
    }
    return undefined;
  }

  static factionHeaderOrder() {
    return [
      t`Guardian`,
      t`Seeker`,
      t`Mystic`,
      t`Rogue`,
      t`Survivor`,
      t`Neutral`,
      t`Guardian / Rogue`,
      t`Rogue / Survivor`,
      t`Survivor / Seeker`,
      t`Seeker / Mystic`,
      t`Mystic / Guardian`,
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
      t`Asset: Accessory`,
      t`Asset: Ally`,
      t`Asset: Arcane`,
      t`Asset: Arcane x2`,
      t`Asset: Body`,
      t`Asset: Permanent`,
      t`Asset: Tarot`,
      t`Asset: Ally. Arcane`,
      t`Asset: Hand. Arcane`,
      t`Asset: Body. Hand x2`,
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
              case 'Ally. Arcane':
                return t`Asset: Ally. Arcane`;
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
    packsByCode: {
      [pack_code: string]: {
        position: number;
        cycle_position: number;
      };
    },
    cycleNames: {
      [cycle_code: string]: {
        name?: string;
        code?: string;
      };
    },
    lang: string
  ): Card {
    if (json.code === '02041') {
      json.subtype_code = null;
      json.subtype_name = null;
    }
    const deck_requirements = json.deck_requirements ?
      DeckRequirement.parse(json.deck_requirements) :
      null;
    const deck_options = json.deck_options ?
      DeckOption.parseList(json.deck_options) :
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

    const bonded_match = json.real_text && json.real_text.match(BONDED_REGEX);
    const bonded_name = bonded_match ? bonded_match[1] : null;

    const seal_match = json.real_text && json.real_text.match(SEAL_REGEX);
    const seal = !!seal_match || json.code === SERPENTS_OF_YIG;

    const heals_horror_match = json.real_text && json.real_text.match(HEALS_HORROR_REGEX);
    const heals_horror = heals_horror_match ? true : null;
    const myriad = !!json.real_text && json.real_text.indexOf('Myriad.') !== -1;
    const advanced = !!json.real_text && json.real_text.indexOf('Advanced.') !== -1;

    const sort_by_type = Card.typeHeaderOrder().indexOf(Card.typeSortHeader(json));
    const sort_by_faction = Card.factionHeaderOrder().indexOf(Card.factionSortHeader(json));
    const pack = packsByCode[json.pack_code] || null;
    const sort_by_faction_pack = sort_by_faction * 100 + (pack ? pack.cycle_position : 0);
    const sort_by_pack = pack ? (pack.cycle_position * 100 + pack.position) : -1;
    const cycle_pack = pack ? cycleNames[pack.cycle_position] : null;
    const spoiler = !!(json.spoiler || (linked_card && linked_card.spoiler));
    const enemy_horror = json.type_code === 'enemy' ? (json.enemy_horror || 0) : null;
    const enemy_damage = json.type_code === 'enemy' ? (json.enemy_damage || 0) : null;
    const firstName = json.type_code === 'investigator' && json.name.indexOf(' ') !== -1 ?
      json.name.substring(0, json.name.indexOf(' ')).replace(/"/g, '') :
      json.name;

    const altArtInvestigator =
      !!json.alternate_of_code ||
      json.code === '98001' || // Jenny
      json.code === '98004' || // Roland
      json.code === '98010' || // Carolyn
      // json.code === '98016' || // Dexter for TIC
      // json.code === '98013' || // Silas for TIC
      json.code === '99001'; // PROMO Marie

    return {
      ...json,
      ...eskills,
      id: json.code,
      tabooSetId: null,
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
      bonded_name,
      cycle_name: (cycle_pack && cycle_pack.name) || json.pack_name,
      cycle_code: cycle_pack && cycle_pack.code || json.pack_code,
      has_restrictions: !!restrictions && !!restrictions.restrictions_investigator,
      ...restrictions,
      seal,
      myriad,
      advanced,
      heals_horror,
      sort_by_type,
      sort_by_faction,
      sort_by_faction_pack,
      sort_by_pack,
      enemy_horror,
      enemy_damage,
      altArtInvestigator,
    };
  }

  static placeholderTabooCard(
    tabooId: number,
    card: Card
  ): Card {
    const result: Card = { ...card } as Card;
    result.id = `${tabooId}-${card.code}`;
    result.taboo_set_id = tabooId;
    result.taboo_placeholder = true;
    return result;
  }

  static fromTabooCardJson(
    tabooId: number,
    json: any,
    card: Card
  ): Card {
    const code: string = json.code;
    const result: Card = { ...card } as Card;
    result.id = `${tabooId}-${code}`;
    result.taboo_set_id = tabooId;
    result.taboo_placeholder = false;

    if (json.xp) {
      result.extra_xp = json.xp;
    }
    if (json.text) {
      result.taboo_text_change = json.text;
    }
    if (json.exceptional) {
      result.exceptional = true;
      result.deck_limit = 1;
    }
    return result;
  }
}

export type CardKey = keyof Card;

export interface CardsMap {
  [code: string]: Card;
}
