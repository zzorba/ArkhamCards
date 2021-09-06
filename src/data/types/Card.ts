import { Entity, Index, Column, PrimaryColumn, JoinColumn, OneToOne } from 'typeorm/browser';
import { forEach, filter, keys, map, min, omit, find } from 'lodash';
import { t } from 'ttag';

import { SortType, SORT_BY_COST, SORT_BY_ENCOUNTER_SET, SORT_BY_FACTION, SORT_BY_FACTION_PACK, SORT_BY_FACTION_XP, SORT_BY_FACTION_XP_TYPE_COST, SORT_BY_PACK, SORT_BY_TITLE, SORT_BY_TYPE, TraumaAndCardData } from '@actions/types';
import { BASIC_SKILLS, RANDOM_BASIC_WEAKNESS, FactionCodeType, TypeCodeType, SkillCodeType, BODY_OF_A_YITHIAN } from '@app_constants';
import DeckRequirement from './DeckRequirement';
import DeckOption from './DeckOption';
import { QuerySort } from '../sqlite/types';
import { CoreCardFragment, CoreCardTextFragment } from '@generated/graphql/apollo-schema';

const SERPENTS_OF_YIG = '04014';
const USES_REGEX = new RegExp('.*Uses\\s*\\([0-9]+(\\s\\[per_investigator\\])?\\s(.+)\\)\\..*');
const BONDED_REGEX = new RegExp('.*Bonded\\s*\\((.+?)\\)\\..*');
const SEAL_REGEX = new RegExp('.*Seal \\(.+\\)\\..*');
const HEALS_HORROR_REGEX = new RegExp('[Hh]eals? (that much )?((\\d+|all|(X total)) damage (from that asset )?(and|or) )?((\\d+|all|(X total)) )?horror');
export const SEARCH_REGEX = /["“”‹›‘’«»〞〝〟＂❛❜❝❞❮❯\(\)'\-\.]/g;

function arkham_num(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return '-';
  }
  if (value < 0) {
    return 'X';
  }
  return `${value}`;
}

const REPRINT_CARDS: {
  [code: string]: string[] | undefined;
} = {
  '01017': ['nat'],
  '01023': ['nat'],
  '01025': ['nat'],
  '02186': ['har'],
  '02020': ['har'],
  '01039': ['har'],
  '01044': ['win'],
  '03030': ['win'],
  '04107': ['win'],
  '04232': ['win'],
  '03194': ['win'],
  '01053': ['win'],
  '02029': ['jac'],
  '03034': ['jac'],
  '02190': ['jac'],
  '02153': ['jac'],
  '04032': ['jac'],

  '07004': ['bob'],
  '07005': ['tdg'],
  '02003': ['hoth'],
  '05001': ['tftbw'],
  '08004': ['iotv'],
};

const FEMININE_INVESTIGATORS = new Set([
  '01002', // Daisy Walker
  '01004', // Agnes Baker
  '01005', // Wendy Adams
  '02001', // Zoey Samaras
  '02003', // Jenny Barnes
  '03002', // Mihn Thi Phan
  '03003', // Sefina Rousseau
  '03004', // Akachi Onyele
  '03006', // Lola Hayes
  '04002', // Ursula Downs
  '05001', // Carolyn Fern
  '05004', // Diana
  '05005', // Rita
  '05006', // Marie
  '06002', // Mandy Thompson
  '06005', // Patrice
  '60301', // Wini
  '60401', // Jacqueline
  '60501', // Stella
  '07001', // Sister Mary
  '07002', // Amanda Sharpe
  '07003', // Trish
  '05046', // Gavriella Mizrah
  '05049', // Penny White
  '98001', // Alt-Jenny
  '98019', // Gloria
  '98010', // Alt-Carolyn
]);

const HEADER_SELECT = {
  [SORT_BY_FACTION]: 'c.sort_by_faction as headerId, c.sort_by_faction_header as headerTitle',
  [SORT_BY_FACTION_PACK]: 'c.sort_by_faction_pack as headerId, c.sort_by_faction_pack_header as headerTitle',
  [SORT_BY_FACTION_XP]: 'c.sort_by_faction_xp as headerId, c.sort_by_faction_xp_header as headerTitle',
  [SORT_BY_FACTION_XP_TYPE_COST]: 'c.sort_by_faction_xp as headerId, c.sort_by_faction_xp_header as headerTitle',
  [SORT_BY_COST]: 'c.cost as headerId, c.sort_by_cost_header as headerTitle',
  [SORT_BY_PACK]: 'c.sort_by_pack as headerId, c.pack_name as headerTitle',
  [SORT_BY_ENCOUNTER_SET]: 'c.encounter_code as headerId, c.sort_by_encounter_set_header as headerTitle',
  [SORT_BY_TITLE]: '"0" as headerId',
  [SORT_BY_TYPE]: 'c.sort_by_type as headerId, c.sort_by_type_header as headerTitle',
};

export class PartialCard {
  public id: string;
  public code: string;
  public renderName: string;
  public renderSubName?: string;

  public headerId: string;
  public headerTitle: string;
  public pack_code: string;
  public reprint_pack_codes?: string[];
  public spoiler?: boolean;

  constructor(
    id: string,
    code: string,
    renderName: string,
    headerId: string,
    headerTitle: string,
    pack_code: string,
    reprint_pack_codes?: string[],
    renderSubName?: string,
    spoiler?: boolean,
  ) {
    this.id = id;
    this.code = code;
    this.renderName = renderName;
    this.headerId = headerId;
    this.headerTitle = headerTitle;
    this.pack_code = pack_code;
    this.reprint_pack_codes = reprint_pack_codes;
    this.renderSubName = renderSubName;
    this.spoiler = spoiler;
  }

  public static selectStatement(sort?: SortType): string {
    const parts: string[] = [
      `c.id as id`,
      `c.code as code`,
      `c.renderName as renderName`,
      `c.renderSubname as renderSubname`,
      `c.pack_code as pack_code`,
      `c.reprint_pack_codes as reprint_pack_codes`,
      `c.spoiler as spoiler`,
      HEADER_SELECT[sort || SORT_BY_TYPE],
    ];
    return parts.join(', ');
  }

  public static fromRaw(raw: any, sort?: SortType): PartialCard | undefined {
    if (raw.id !== null && raw.code !== null && raw.renderName !== null && raw.pack_code !== null) {
      return new PartialCard(
        raw.id,
        raw.code,
        raw.renderName,
        (raw.headerId === null || raw.headerId === undefined) ? 'null' : `${raw.headerId}`,
        sort === SORT_BY_TITLE ? t`All Cards` : raw.headerTitle,
        raw.pack_code,
        raw.reprint_pack_codes ? raw.reprint_pack_codes.split(',') : undefined,
        raw.renderSubname,
        !!raw.spoiler
      );
    }
    return undefined;
  }
}

@Entity('card')
@Index('code_taboo', ['code', 'taboo_set_id'], { unique: true })
@Index('player_cards', ['browse_visible'])
@Index('sort_type', ['browse_visible', 'taboo_set_id', 'sort_by_type', 'renderName', 'xp'])
@Index('sort_faction', ['browse_visible', 'taboo_set_id', 'sort_by_faction', 'renderName', 'xp'])
@Index('sort_faction_pack', ['browse_visible', 'taboo_set_id', 'sort_by_faction_pack', 'code'])
@Index('sort_faction_xp', ['browse_visible', 'taboo_set_id', 'sort_by_faction_xp', 'renderName'])
@Index('sort_cost', ['browse_visible', 'taboo_set_id', 'cost', 'renderName', 'xp'])
@Index('sort_pack', ['browse_visible', 'taboo_set_id', 'sort_by_pack', 'position'])
@Index('sort_pack_encounter', ['browse_visible', 'taboo_set_id', 'sort_by_pack', 'encounter_code', 'encounter_position'])
@Index('sort_name_xp', ['browse_visible', 'taboo_set_id', 'renderName', 'xp'])
@Index('encounter_query_index', ['browse_visible', 'taboo_set_id', 'encounter_code'])
export default class Card {
  @PrimaryColumn('text')
  public id!: string;

  @Index('code')
  @Column('text')
  public code!: string;

  @Column('text')
  public name!: string;

  @Index('real_name')
  @Column('text')
  public real_name!: string;

  @Index()
  @Column('text')
  public renderName!: string;

  @Column('text', { nullable: true })
  public duplicate_of_code?: string;

  @Column('simple-array', { nullable: true })
  public reprint_pack_codes?: string[];

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

  @Index('pack_code')
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

  @Column('text', { nullable: true })
  public real_slot?: string;

  @Index('faction_code')
  @Column('text', { nullable: true })
  public faction_code?: FactionCodeType;

  @Column('text', { nullable: true })
  public faction_name?: string;

  @Column('text', { nullable: true })
  public faction2_code?: FactionCodeType;

  @Column('text', { nullable: true })
  public faction2_name?: string;

  @Column('text', { nullable: true })
  public faction3_code?: FactionCodeType;

  @Column('text', { nullable: true })
  public faction3_name?: string;

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

  @Index('encounter_code')
  @Column('text', { nullable: true })
  public encounter_code?: string;

  @Column('text', { nullable: true })
  public encounter_name?: string;

  @Column('integer', { nullable: true })
  public encounter_position?: number;

  @Column('integer', { nullable: true })
  public encounter_size?: number;

  @Column('boolean', { nullable: true })
  public exceptional?: boolean;

  @Index('xp')
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
  @Column('boolean', { nullable: true })
  public clues_fixed?: boolean;
  @Column('integer', { nullable: true })
  public doom?: number;
  @Column('integer', { nullable: true })
  public health?: number;
  @Column('boolean', { nullable: true })
  public health_per_investigator?: boolean;
  @Column('integer', { nullable: true })
  public sanity?: number;

  @Column('text', { select: false })
  public s_search_name!: string;
  @Column('text', { select: false })
  public s_search_name_back!: string;
  @Column('text', { select: false })
  public s_search_game?: string;
  @Column('text', { select: false })
  public s_search_game_back?: string;
  @Column('text', { select: false })
  public s_search_flavor?: string;
  @Column('text', { select: false })
  public s_search_flavor_back?: string;

  @Column('text', { select: false })
  public s_search_real_name!: string;
  @Column('text', { select: false })
  public s_search_real_name_back!: string;
  @Column('text', { select: false })
  public s_search_real_game?: string;

  @Index('deck_limit')
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
  @Column('integer', { nullable: true, select: false })
  public eskill_willpower?: number;
  @Column('integer', { nullable: true, select: false })
  public eskill_intellect?: number;
  @Column('integer', { nullable: true, select: false })
  public eskill_combat?: number;
  @Column('integer', { nullable: true, select: false })
  public eskill_agility?: number;
  @Column('text', { nullable: true, select: false })
  public linked_to_code?: string;
  @Column('text', { nullable: true, select: false })
  public linked_to_name?: string;

  @Column('simple-array', { nullable: true })
  public restrictions_all_investigators?: string[];
  @Column('text', { nullable: true })
  public restrictions_investigator?: string;

  @Column('simple-json', { nullable: true })
  public deck_requirements?: DeckRequirement;
  @Column('simple-json', { nullable: true })
  public deck_options?: DeckOption[];

  @OneToOne(() => Card, { cascade: true, eager: true })
  @Index()
  @JoinColumn({ name: 'linked_card_id' })
  public linked_card?: Card;

  @Column('boolean', { nullable: true, select: false })
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
  @Column('text', { nullable: true, select: false })
  public slots_normalized?: string;
  @Column('text', { nullable: true })
  public real_slots_normalized?: string;
  @Column('text', { nullable: true })
  public uses?: string;
  @Column('text', { nullable: true })
  public bonded_name?: string;
  @Column('boolean', { nullable: true })
  public bonded_from?: boolean;

  @Column('boolean', { nullable: true })
  public seal?: boolean;
  @Column('boolean', { nullable: true })
  public heals_horror?: boolean;

  @Column('integer', { nullable: true, select: false })
  public sort_by_type?: number;
  @Column('text', { nullable: true, select: false })
  public sort_by_type_header?: string;
  @Column('integer', { nullable: true, select: false })
  public sort_by_faction?: number;
  @Column('text', { nullable: true, select: false })
  public sort_by_faction_header?: string;
  @Column('integer', { nullable: true, select: false })
  public sort_by_faction_pack?: number;
  @Column('text', { nullable: true, select: false })
  public sort_by_faction_pack_header?: string;
  @Column('integer', { nullable: true, select: false })
  public sort_by_faction_xp?: number;
  @Column('text', { nullable: true, select: false })
  public sort_by_faction_xp_header?: string;
  @Column('text', { nullable: true, select: false })
  public sort_by_cost_header?: string;
  @Column('text', { nullable: true, select: false })
  public sort_by_encounter_set_header?: string;
  @Column('integer', { nullable: true, select: false })
  public sort_by_pack?: number;
  @Column('integer', { nullable: true, select: false })
  public browse_visible!: number;

  @Column('boolean')
  public mythos_card!: boolean;

  public static ELIDED_FIELDS = [
    'c.slots_normalized',
    'c.back_linked',
    'c.eskill_willpower',
    'c.eskill_intellect',
    'c.eskill_combat',
    'c.eskill_agility',
    'c.linked_to_code',
    'c.linked_to_name',
    'c.sort_by_type',
    'c.sort_by_type_header',
    'c.sort_by_faction',
    'c.sort_by_faction_header',
    'c.sort_by_faction_pack',
    'c.sort_by_faction_pack_header',
    'c.sort_by_faction_xp',
    'c.sort_by_faction_xp_header',
    'c.sort_by_cost_header',
    'c.sort_by_encounter_set_header',
    'c.sort_by_pack',
    'c.browse_visible',
    'c.s_search_name',
    'c.s_search_name_back',
    'c.s_search_game',
    'c.s_search_game_back',
    'c.s_search_flavor',
    'c.s_search_flavor_back',
    'c.s_search_real_name',
    'c.s_search_real_name_back',
    'c.s_search_real_game',
  ];

  public cardName(): string {
    return this.subname ? t`${this.name} <i>(${this.subname})</i>` : this.name;
  }

  public custom(): boolean {
    return this.code.startsWith('z');
  }

  public grammarGenderMasculine(): boolean {
    return !FEMININE_INVESTIGATORS.has(this.code);
  }

  public enemyFight(): string {
    return arkham_num(this.enemy_fight);
  }
  public enemyEvade(): string {
    return arkham_num(this.enemy_evade);
  }
  public enemyHealth(): string {
    return arkham_num(this.health);
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

  getHealth(traumaData: TraumaAndCardData | undefined) {
    if (!traumaData) {
      return this.health || 0;
    }
    const isYithian = !!(traumaData.storyAssets && find(traumaData.storyAssets, code => code === BODY_OF_A_YITHIAN));
    return isYithian ? 7 : (this.health || 0);
  }

  getSanity(traumaData: TraumaAndCardData | undefined) {
    if (!traumaData) {
      return this.sanity || 0;
    }
    const isYithian = !!(traumaData.storyAssets && find(traumaData.storyAssets, code => code === BODY_OF_A_YITHIAN));
    return isYithian ? 7 : (this.sanity || 0);
  }

  killed(traumaData: TraumaAndCardData | undefined) {
    if (!traumaData) {
      return false;
    }
    if (traumaData.killed) {
      return true;
    }
    return this.getHealth(traumaData) <= (traumaData.physical || 0);
  }

  insane(traumaData: TraumaAndCardData | undefined) {
    if (!traumaData) {
      return false;
    }
    if (traumaData.insane) {
      return true;
    }
    return this.getSanity(traumaData) <= (traumaData.mental || 0);
  }

  eliminated(traumaData: TraumaAndCardData | undefined) {
    return this.killed(traumaData) || this.insane(traumaData);
  }

  hasTrauma(traumaData: TraumaAndCardData | undefined) {
    return this.eliminated(traumaData) || (traumaData && (
      (traumaData.physical || 0) > 0 ||
      (traumaData.mental || 0) > 0
    ));
  }

  traumaString(listSeperator: string, traumaData: TraumaAndCardData | undefined) {
    if (!traumaData) {
      return t`None`;
    }
    const parts = [];
    if (this.killed(traumaData)) {
      return t`Killed`;
    }
    if (this.insane(traumaData)) {
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
    return parts.join(listSeperator);
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

  collectionDeckLimit(packInCollection: { [pack_code: string]: boolean | undefined }, ignore_collection: boolean): number {
    if (ignore_collection) {
      return this.deck_limit || 0;
    }
    if (this.pack_code !== 'core' || packInCollection.core) {
      return this.deck_limit || 0;
    }
    const reprintPacks = this.reprint_pack_codes || REPRINT_CARDS[this.code];
    if (reprintPacks && find(reprintPacks, pack => !!packInCollection[pack])) {
      return this.deck_limit || 0;
    }
    return Math.min(this.quantity || 0, this.deck_limit || 0);
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
      t`Basic Weakness`,
      t`Signature Weakness`,
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
        return t`Basic Weakness`;
      case 'weakness':
        if (json.restrictions || json.has_restrictions) {
          return t`Signature Weakness`;
        }
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

  static basicTypeHeaderOrder() {
    return [
      t`Investigator`,
      t`Asset`,
      t`Event`,
      t`Skill`,
      t`Basic Weakness`,
      t`Signature Weakness`,
      t`Weakness`,
      t`Scenario`,
      t`Story`,
    ];
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
      t`Asset: Body. Arcane`,
      t`Asset: Hand. Arcane`,
      t`Asset: Body. Hand x2`,
      t`Asset: Other`,
      t`Event`,
      t`Skill`,
      t`Basic Weakness`,
      t`Signature Weakness`,
      t`Weakness`,
      t`Scenario`,
      t`Story`,
    ];
  }

  static typeSortHeader(json: any, basic?: boolean): string {
    if (json.hidden && json.linked_card) {
      return Card.typeSortHeader(json.linked_card, basic);
    }
    switch(json.subtype_code) {
      case 'basicweakness':
        return t`Basic Weakness`;
      case 'weakness':
        if (json.spoiler) {
          return t`Story`;
        }
        if (json.restrictions || json.has_restrictions) {
          return t`Signature Weakness`;
        }
        return t`Weakness`;
      default:
        switch(json.type_code) {
          case 'asset':
            if (json.spoiler || json.encounter_code) {
              return t`Story`;
            }
            if (basic) {
              return t`Asset`;
            }
            if (json.permanent || json.double_sided) {
              return t`Asset: Permanent`;
            }
            switch(json.real_slot) {
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
              case 'Body. Arcane':
                return t`Asset: Body. Arcane`;
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

  static fromGraphQl(
    card: CoreCardFragment & {
      packs: { name: string }[];
      translations: CoreCardTextFragment[];
    },
    lang: string
  ) {
    const cardTypeNames: { [key: string]: string } = {
      asset: t`Asset`,
      event: t`Event`,
      skill: t`Skill`,
      investigator: t`Investigator`,
      treachery: t`Treachery`,
      scenario: t`Scenario`,
      location: t`Location`,
      enemy: t`Enemy`,
      act: t`Act`,
      agenda: t`Agenda`,
    };
    const factionNames: { [key: string]: string } = {
      neutral: t`Neutral`,
      guardian: t`Guardian`,
      seeker: t`Seeker`,
      rogue: t`Rogue`,
      mystic: t`Mystic`,
      survivor: t`Survivor`,
      mythos: t`Mythos`,
    };

    const subTypeName: { [key: string]: string } = {
      weakness: t`Weakness`,
      basicweakness: t`Basic Weakness`,
    };
    const json: any = card.translations.length ? {
      ...omit(card, '__typename', 'real_pack_name', 'real_flavor'),
      ...omit(card.translations[0], '__typename'),
    } : {
      ...omit(card, '__typename', 'real_pack_name', 'real_flavor'),
      flavor: card.real_flavor,
      name: card.real_name,
      slot: card.real_slot,
      subname: card.real_subname,
      text: card.real_text,
      traits: card.real_traits,
    };
    json.pack_name = card.packs.length ? card.packs[0].name : card.real_pack_name;
    json.type_name = cardTypeNames[card.type_code];
    json.faction_name = factionNames[card.faction_code];
    if (card.subtype_code) {
      json.subtype_name = subTypeName[card.subtype_code];
    }
    return Card.fromJson(json,
      {
        [card.pack_code]: {
          position: card.pack_position,
          cycle_position: 0,
        },
      },
      {
        '0': {
          name: t`Fan-Made Content`,
          code: 'fan',
        },
      },
      lang
    );
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
    const linked_card = json.linked_card && json.code !== '86024' ?
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
    const real_slot = json.real_slot || json.slot;
    const real_slots_normalized = real_slot ? map(
      filter(
        map(real_slot.split('.'), s => s.toLowerCase().trim()),
        s => !!s
      ),
      slot => `#${slot}#`
    ).join(',') : null;
    const slot = json.slot || null;
    const slots_normalized = json.slot ? map(
      filter(
        map(json.slot.split('.'), s => s.toLowerCase().trim()),
        s => !!s
      ),
      s => `#${s}#`).join(',') : null;

    const restrictions = Card.parseRestrictions(json.restrictions);
    const uses_match = json.real_text && json.real_text.match(USES_REGEX);
    const uses = uses_match ? uses_match[2].toLowerCase() : null;

    const bonded_match = json.real_text && json.real_text.match(BONDED_REGEX);
    const bonded_name = bonded_match ? bonded_match[1] : null;

    const seal_match = json.real_text && json.real_text.match(SEAL_REGEX);
    const seal = !!seal_match || json.code === SERPENTS_OF_YIG;

    const heals_horror_match = json.real_text && json.real_text.match(HEALS_HORROR_REGEX);
    const heals_horror = heals_horror_match ? true : null;
    const myriad = !!json.real_text && json.real_text.indexOf('Myriad.') !== -1;
    const advanced = !!json.real_text && json.real_text.indexOf('Advanced.') !== -1;

    const sort_by_type_header = Card.typeSortHeader(json);
    const sort_by_type = Card.typeHeaderOrder().indexOf(sort_by_type_header);
    const sort_by_faction_header = Card.factionSortHeader(json);
    const sort_by_faction = Card.factionHeaderOrder().indexOf(sort_by_faction_header);
    const pack = packsByCode[json.pack_code] || null;
    const cycle_position = pack?.cycle_position || 0;
    const sort_by_faction_pack = sort_by_faction * 1000 + (cycle_position * 20) + (cycle_position >= 50 ? pack.position : 0);
    const sort_by_faction_pack_header = `${sort_by_faction_header} - ${json.pack_name}`;

    const basic_type_header = Card.typeSortHeader(json, true);
    const sort_by_faction_xp = (sort_by_faction * 1000) + (typeof json.xp === 'number' ? json.xp : 6) * 100 + Card.basicTypeHeaderOrder().indexOf(basic_type_header);
    const sort_by_faction_xp_header = typeof json.xp === 'number' ?
      `${sort_by_faction_header} (${json.xp}) - ${basic_type_header}` :
      `${sort_by_faction_header} - ${basic_type_header}`;

    const sort_by_pack = pack ? (pack.cycle_position * 100 + pack.position) : -1;
    const sort_by_cost_header = (json.cost === null || json.cost === undefined) ? t`Cost: None` : t`Cost: ${json.cost}`;
    const sort_by_encounter_set_header = json.encounter_name ||
      (linked_card && linked_card.encounter_name) ||
      t`N/A`;
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
      json.code === '98013' || // Silas
      json.code === '98016' || // Dexter
      json.code === '98007' || // Norman
      json.code === '99001'; // PROMO Marie

    const s_search_name = filter([
      renderName && renderName.toLocaleLowerCase(lang),
      renderSubname && renderSubname.toLocaleLowerCase(lang),
    ], x => !!x).join(' ').replace(SEARCH_REGEX, '');
    const s_search_name_back = filter([
      name && name.toLocaleLowerCase(lang),
      json.subname && json.subname.toLocaleLowerCase(lang),
      json.back_name && json.back_name.toLocaleLowerCase(lang),
    ], x => !!x).join(' ').replace(SEARCH_REGEX, '');
    const s_search_game = filter([
      json.text && json.text.toLocaleLowerCase(lang),
      json.traits && json.traits.toLocaleLowerCase(lang),
    ]).join(' ').replace(SEARCH_REGEX, '');
    const s_search_game_back = ((json.back_text && json.back_text.toLocaleLowerCase(lang)) || '').replace(SEARCH_REGEX, '');
    const s_search_flavor = ((json.flavor && json.flavor.toLocaleLowerCase(lang)) || '').replace(SEARCH_REGEX, '');
    const s_search_flavor_back = ((json.back_flavor && json.back_flavor.toLocaleLowerCase(lang)) || '').replace(SEARCH_REGEX, '');

    const s_search_real_name = filter([
      json.real_name.toLocaleLowerCase('en'),
      json.real_subname && json.real_subname.toLocaleLowerCase('en'),
    ], x => !!x).join(' ').replace(SEARCH_REGEX, '');
    const s_search_real_name_back = filter([
      json.real_name.toLocaleLowerCase('en'),
      json.real_subname && json.real_subname.toLocaleLowerCase('en'),
    ], x => !!x).join(' ').replace(SEARCH_REGEX, '');
    const s_search_real_game = filter([
      json.real_text && json.real_text.toLocaleLowerCase('en'),
      json.real_traits && json.real_traits.toLocaleLowerCase('en'),
    ]).join(' ').replace(SEARCH_REGEX, '');
    let result = {
      ...json,
      ...eskills,
      id: json.code,
      tabooSetId: null,
      s_search_name,
      s_search_name_back,
      s_search_game,
      s_search_game_back,
      s_search_flavor,
      s_search_flavor_back,
      s_search_real_name,
      s_search_real_name_back,
      s_search_real_game,
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
      real_slot,
      real_slots_normalized,
      slot,
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
      sort_by_faction_xp,
      sort_by_pack,
      enemy_horror,
      enemy_damage,
      altArtInvestigator,
      sort_by_cost_header,
      sort_by_type_header,
      sort_by_faction_header,
      sort_by_encounter_set_header,
      sort_by_faction_pack_header,
      sort_by_faction_xp_header,
    };
    if (result.type_code === 'story' && result.linked_card && result.linked_card.type_code === 'location') {
      // console.log(`Reversing ${result.name} to ${result.linked_card.name}`);
      result = {
        ...result.linked_card,
        back_linked: null,
        hidden: null,
        linked_to_code: result.code,
        linked_to_name: result.name,
        linked_card: {
          ...result,
          linked_card: undefined,
          back_linked: true,
          hidden: true,
          linked_to_code: result.linked_card.code,
          linked_to_name: result.linked_card.name,
          browse_visible: false,
          mythos_card: true,
        },
      };
    }
    result.browse_visible = 0;
    if (result.code.startsWith('z')) {
      result.browse_visible += 16;
    }
    if (result.code === RANDOM_BASIC_WEAKNESS || result.code === BODY_OF_A_YITHIAN) {
      result.browse_visible += 3;
    } else if ((!result.altArtInvestigator && !result.back_linked && !result.hidden)) {
      if (result.encounter_code) {
        // It's an encounter card.
        result.browse_visible += 2;
      }
      if (result.deck_limit > 0 || result.bonded_name) {
        // It goes in a deck.
        result.browse_visible += 1;
      }
    } else if (result.altArtInvestigator) {
      result.browse_visible += 4;
    }
    if (result.duplicate_of_code) {
      result.browse_visible += 8;
    }
    result.mythos_card = !!result.encounter_code || !!result.linked_card?.encounter_code;
    result.spoiler = result.spoiler || (result.linked_card && result.linked_card.spoiler);
    return result;
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
    if (json.deck_limit !== undefined) {
      result.deck_limit = json.deck_limit;
    }
    return result;
  }

  static querySort(sortIgnoreQuotes: boolean, sort?: SortType): QuerySort[] {
    switch(sort) {
      case SORT_BY_FACTION:
        return [
          { s: 'c.sort_by_faction', direction: 'ASC' },
          { s: sortIgnoreQuotes ? 'c.s_search_name' : 'c.renderName', direction: 'ASC' },
          { s: 'c.xp', direction: 'ASC' },
        ];
      case SORT_BY_FACTION_PACK:
        return [
          { s: 'c.sort_by_faction_pack', direction: 'ASC' },
          { s: 'c.code', direction: 'ASC' },
        ];
      case SORT_BY_FACTION_XP:
        return [
          { s: 'c.sort_by_faction_xp', direction: 'ASC' },
          { s: sortIgnoreQuotes ? 'c.s_search_name' : 'c.renderName', direction: 'ASC' },
          { s: 'c.code', direction: 'ASC' },
        ];
      case SORT_BY_FACTION_XP_TYPE_COST:
        return [
          { s: 'c.sort_by_faction_xp', direction: 'ASC' },
          { s: 'c.cost', direction: 'ASC' },
          { s: sortIgnoreQuotes ? 'c.s_search_name' : 'c.renderName', direction: 'ASC' },
        ];
      case SORT_BY_COST:
        return [
          { s: 'c.cost', direction: 'ASC' },
          { s: sortIgnoreQuotes ? 'c.s_search_name' : 'c.renderName', direction: 'ASC' },
          { s: 'c.xp', direction: 'ASC' },
        ];
      case SORT_BY_PACK:
        return [
          { s: 'c.sort_by_pack', direction: 'ASC' },
          { s: 'c.position', direction: 'ASC' },
        ];
      case SORT_BY_ENCOUNTER_SET:
        return [
          { s: 'c.sort_by_pack', direction: 'ASC' },
          { s: 'c.encounter_code', direction: 'ASC' },
          { s: 'c.encounter_position', direction: 'ASC' },
        ];
      case SORT_BY_TITLE:
        return [
          { s: sortIgnoreQuotes ? 'c.s_search_name' : 'c.renderName', direction: 'ASC' },
          { s: 'c.xp', direction: 'ASC' },
        ];
      case SORT_BY_TYPE:
      default:
        return [
          { s: 'c.sort_by_type', direction: 'ASC' },
          { s: sortIgnoreQuotes ? 'c.s_search_name' : 'c.renderName', direction: 'ASC' },
          { s: 'c.xp', direction: 'ASC' },
        ];
    }
  }
}

export function cardInCollection(card: Card | PartialCard, packInCollection: { [pack_code: string]: boolean | undefined }): boolean {
  if (packInCollection[card.pack_code]) {
    return true;
  }
  const reprintPacks = card.reprint_pack_codes || REPRINT_CARDS[card.code];
  if (!reprintPacks) {
    return false;
  }
  return !!find(reprintPacks, pack => !!packInCollection[pack]);
}

export type CardKey = keyof Card;

export interface CardsMap {
  [code: string]: Card | undefined;
}
