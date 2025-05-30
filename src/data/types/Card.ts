import {
  Entity,
  Index,
  Column,
  PrimaryColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm/browser';
import { Platform } from 'react-native';
import {
  head,
  forEach,
  flatMap,
  filter,
  find,
  keys,
  min,
  omit,
  sortBy,
  indexOf,
  sumBy,
  uniq,
} from 'lodash';
import { removeDiacriticalMarks } from 'remove-diacritical-marks';
import { remove as removeAccents } from 'remove-accents';
import { c, t } from 'ttag';

import {
  Pack,
  SortType,
  SORT_BY_COST,
  SORT_BY_CYCLE,
  SORT_BY_ENCOUNTER_SET,
  SORT_BY_FACTION,
  SORT_BY_FACTION_PACK,
  SORT_BY_FACTION_XP,
  SORT_BY_PACK,
  SORT_BY_TITLE,
  SORT_BY_TYPE,
  TraumaAndCardData,
  SORT_BY_XP,
  SORT_BY_CARD_ID,
  SORT_BY_SLOT,
  ExtendedSortType,
  SORT_BY_TYPE_SLOT,
} from '@actions/types';
import {
  BASIC_SKILLS,
  RANDOM_BASIC_WEAKNESS,
  type FactionCodeType,
  type TypeCodeType,
  SkillCodeType,
  BODY_OF_A_YITHIAN,
  specialReprintPlayerPacks,
  specialReprintCampaignPacks,
  specialPacks,
  specialReprintCardPacks,
} from '@app_constants';
import DeckRequirement from './DeckRequirement';
import DeckOption from './DeckOption';
import { QuerySort } from '../sqlite/types';
import {
  CoreCardTextFragment,
  Gender_Enum,
  SingleCardFragment,
} from '@generated/graphql/apollo-schema';
import CustomizationOption, {
  CustomizationChoice,
} from './CustomizationOption';
import { processAdvancedChoice } from '@lib/parseDeck';
import CardTextFields from './CardTextFields';
import CardReprintInfo from './CardReprintInfo';

const SERPENTS_OF_YIG = '04014';
const USES_REGEX = /.*Uses\s*\([0-9]+(\s\[per_investigator\])?\s(.+)\)\..*/;
const BONDED_REGEX = /.*Bonded\s*\((.+?)\)\..*/;
const SEAL_REGEX = /.*Seal \(.+\)\..*/;
const SEARCH_REGEX = /["“”‹›«»〞〝〟„＂❝❞‘’❛❜‛',‚❮❯\(\)\-\.…¡!?¿]/g;
const RUSSIAN_E_REGEX = /ё/g;

export const enum CardStatusType {
  PREVIEW = 'p',
  CUSTOM = 'c',
}

export function searchNormalize(text: string, lang: string) {
  if (!text) {
    return '';
  }
  const r = text
    .toLocaleLowerCase(lang)
    .replace(SEARCH_REGEX, '')
    .replace(RUSSIAN_E_REGEX, 'е');
  try {
    if (Platform.OS === 'ios') {
      return removeDiacriticalMarks(r);
    }
    return removeAccents(r);

  } catch (e) {
    console.log(e);
    return r;
  }
}

export const CARD_NUM_COLUMNS = 140;
function arkham_num(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return '-';
  }
  if (value === -2) {
    return 'X';
  }
  if (value === -3) {
    return '?';
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

export interface TranslationData {
  lang: string;
  encounterSets: { [code: string]: string | undefined };
  packs: {
    [pack_code: string]: Pack & {
      cycle_code: string;
      cycle_name: string;
    };
  };
  cardTypeNames: {
    [type_code: string]: string;
  };
  subTypeNames: {
    [type_code: string]: string;
  };
  factionNames: {
    [faction_code: string]: string;
  };
}

const HEADER_SELECT = {
  [SORT_BY_TYPE_SLOT]: `(c.sort_by_type * 10000 + c.sort_by_slot - CASE WHEN c.permanent THEN 1 ELSE 0 END) as headerId, c.sort_by_type_header as headerTitle, c.slot as headerSlot, c.permanent as headerPermanent`,
  [SORT_BY_FACTION]: `c.sort_by_faction as headerId, c.sort_by_faction_header as headerTitle`,
  [SORT_BY_FACTION_PACK]: `(c.sort_by_faction * 10000 + c.sort_by_pack) as headerId, c.sort_by_faction_header as headerTitle, CASE WHEN c.cycle_code = 'investigator' THEN c.cycle_name ELSE c.pack_name END as headerPackName`,
  [SORT_BY_FACTION_XP]: `c.sort_by_faction * 10000 + COALESCE(c.xp, -1) + 1 as headerId, c.sort_by_faction_header as headerTitle, c.xp as headerXp`,
  [SORT_BY_COST]: `c.cost as headerId, c.cost as headerTitle`,
  [SORT_BY_PACK]: `c.sort_by_pack as headerId, CASE WHEN c.cycle_code = 'investigator' THEN c.cycle_name ELSE c.pack_name END as headerTitle`,
  [SORT_BY_ENCOUNTER_SET]: `c.encounter_code as headerId, c.sort_by_encounter_set_header as headerTitle`,
  [SORT_BY_TITLE]: `'0' as headerId`,
  [SORT_BY_TYPE]: `c.sort_by_type as headerId, c.sort_by_type_header as headerTitle`,
  [SORT_BY_CYCLE]: `c.sort_by_cycle as headerId, c.cycle_name as headerTitle`,
  [SORT_BY_XP]: `c.xp as headerId, c.xp as headerTitle`,
  [SORT_BY_CARD_ID]: `c.sort_by_cycle as headerId, c.cycle_name as headerTitle`,
  [SORT_BY_SLOT]: `c.sort_by_slot as headerId, c.slot as headerTitle`,
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
  public encounter_code?: string;

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
    encounter_code?: string
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
    this.encounter_code = encounter_code;
  }

  public static headerSort(sorts?: SortType[]): ExtendedSortType {
    if (!sorts || !sorts.length) {
      return SORT_BY_TYPE;
    }
    if (sorts.length >= 2) {
      if (sorts[0] === SORT_BY_FACTION) {
        if (sorts[1] === SORT_BY_PACK) {
          return SORT_BY_FACTION_PACK;
        }
        if (sorts[1] === SORT_BY_XP) {
          return SORT_BY_FACTION_XP;
        }
      } else if (sorts[0] === SORT_BY_TYPE) {
        if (sorts[1] === SORT_BY_SLOT) {
          return SORT_BY_TYPE_SLOT;
        }
      }
    }
    return head(sorts) || SORT_BY_TYPE;
  }

  public static selectStatement(sorts?: SortType[]): string {
    const parts: string[] = [
      `c.id as id`,
      `c.code as code`,
      `c.renderName as renderName`,
      `c.renderSubname as renderSubname`,
      `c.pack_code as pack_code`,
      `c.reprint_pack_codes as reprint_pack_codes`,
      `c.spoiler as spoiler`,
      `c.encounter_code as encounter_code`,
      HEADER_SELECT[PartialCard.headerSort(sorts)],
    ];
    return parts.join(', ');
  }

  public static fromRaw(
    raw: any,
    sort?: ExtendedSortType
  ): PartialCard | undefined {
    if (
      raw.id !== null &&
      raw.code !== null &&
      raw.renderName !== null &&
      raw.pack_code !== null
    ) {
      let header = raw.headerTitle;
      switch (sort) {
        case SORT_BY_TYPE_SLOT:
          if (raw.headerPermanent) {
            header = `${raw.headerTitle}: ${t`Permanent`}`;
          } else {
            header = raw.headerSlot
              ? `${raw.headerTitle}: ${raw.headerSlot}`
              : raw.headerTitle;
          }
          break;
        case SORT_BY_FACTION_PACK:
          header = `${raw.headerTitle} - ${raw.headerPackName}`;
          break;
        case SORT_BY_FACTION_XP:
          header =
            typeof raw.headerXp === 'number'
              ? `${raw.headerTitle} (${raw.headerXp})`
              : raw.headerTitle;
          break;
        case SORT_BY_TITLE:
          header = t`All Cards`;
          break;
        case SORT_BY_COST: {
          const card = { cost: raw.headerCost || null };
          header = card.cost === null ? t`Cost: None` : t`Cost: ${card.cost}`;
          break;
        }
        case SORT_BY_XP: {
          const level = raw.headerTitle;
          header = t`Level ${level}`;
          break;
        }
        case SORT_BY_SLOT:
          header =
            raw.headerTitle === null ? c('slots').t`None` : raw.headerTitle;
          break;
      }
      return new PartialCard(
        raw.id,
        raw.code,
        raw.renderName,
        raw.headerId === null || raw.headerId === undefined
          ? 'null'
          : `${raw.headerId}`,
        header,
        raw.pack_code,
        raw.reprint_pack_codes ? raw.reprint_pack_codes.split(',') : undefined,
        raw.renderSubname,
        !!raw.spoiler,
        raw.encounter_code
      );
    }
    return undefined;
  }
}

interface CardRestrictions {
  restrictions_all_investigators?: string[];
  restrictions_investigator?: string;
  restrictions_faction?: string[];
  restrictions_trait?: string[];
}

@Entity('card')
@Index('code_taboo', ['code', 'taboo_set_id'], { unique: true })
@Index('player_cards', ['browse_visible'])
@Index('sort_type', [
  'browse_visible',
  'taboo_set_id',
  'sort_by_type',
  'renderName',
  'xp',
])
@Index('sort_faction', [
  'browse_visible',
  'taboo_set_id',
  'sort_by_faction',
  'renderName',
  'xp',
])
@Index('sort_cost', [
  'browse_visible',
  'taboo_set_id',
  'cost',
  'renderName',
  'xp',
])
@Index('sort_pack', [
  'browse_visible',
  'taboo_set_id',
  'sort_by_pack',
  'position',
])
@Index('sort_pack_encounter', [
  'browse_visible',
  'taboo_set_id',
  'sort_by_pack',
  'encounter_code',
  'encounter_position',
])
@Index('sort_name_xp', ['browse_visible', 'taboo_set_id', 'renderName', 'xp'])
@Index('sort_cycle_xp', ['browse_visible', 'taboo_set_id', 'sort_by_cycle'])
@Index('encounter_query_index', [
  'browse_visible',
  'taboo_set_id',
  'encounter_code',
])
@Index('type_code', ['type_code'])
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

  @Column('simple-json', { nullable: true })
  public reprint_info?: CardReprintInfo[];

  @Column('text', { nullable: true })
  public status?: CardStatusType;

  @Column('text', { nullable: true })
  public gender?: Gender_Enum;

  @Column('text')
  public type_code!: TypeCodeType;

  @Column('text', { nullable: true })
  public alternate_of_code?: string;

  @Column('text', { nullable: true })
  public alternate_required_code?: string;

  @Column('integer', { nullable: true })
  public taboo_set_id?: number;

  @Column('boolean', { nullable: true })
  public taboo_placeholder?: boolean;

  @Column('text', { nullable: true })
  public taboo_text_change?: string;

  @Column('text', { nullable: true })
  public taboo_original_text?: string;

  @Column('text', { nullable: true })
  public taboo_original_back_text?: string;

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

  private _textAlreadyCustomized?: boolean;

  @Column('text', { nullable: true })
  public flavor?: string;

  @Column('integer', { nullable: true })
  public cost?: number;
  @Column('text', { nullable: true })
  public real_text?: string;
  @Column('simple-array', { nullable: true })
  public tags?: string[];
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
  public imageurl?: string;
  @Column('text', { nullable: true })
  public backimageurl?: string;
  @Column('text', { nullable: true })
  public imagesrc?: string;

  hasImage(): boolean {
    return !!this.imageurl || !!this.imagesrc;
  }

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
  @Column('text', { nullable: true })
  public restrictions_trait?: string;
  @Column('text', { nullable: true })
  public restrictions_faction?: string;

  @Column('simple-json', { nullable: true })
  public deck_requirements?: DeckRequirement;
  @Column('simple-json', { nullable: true })
  public deck_options?: DeckOption[];

  @Column('simple-json', { nullable: true })
  public side_deck_requirements?: DeckRequirement;
  @Column('simple-json', { nullable: true })
  public side_deck_options?: DeckOption[];

  @Column('simple-json', { nullable: true })
  public customization_options?: CustomizationOption[];

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
  @Column('boolean', { nullable: true })
  public removable_slot?: boolean;

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
  @Column('boolean', { nullable: true })
  public heals_damage?: boolean;

  @Column('integer', { nullable: true, select: false })
  public sort_by_type?: number;
  @Column('text', { nullable: true, select: false })
  public sort_by_type_header?: string;
  @Column('integer', { nullable: true, select: false })
  public sort_by_faction?: number;
  @Column('text', { nullable: true, select: false })
  public sort_by_faction_header?: string;
  @Column('text', { nullable: true, select: false })
  public sort_by_encounter_set_header?: string;
  @Column('integer', { nullable: true, select: false })
  public sort_by_pack?: number;
  @Column('integer', { nullable: true, select: false })
  public sort_by_cycle?: number;
  @Column('integer', { nullable: true, select: false })
  public sort_by_slot?: number;

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

  public clone(): Card {
    const card = new Card();
    forEach(Object.keys(this), (key) => {
      // @ts-ignore ts7053
      card[key] = this[key];
    });
    return card;
  }

  public customizationChoice(
    index: number,
    xp: number,
    choice: string | undefined,
    cards: CardsMap | undefined
  ): CustomizationChoice | undefined {
    if (!this.customization_options) {
      return undefined;
    }
    const option = this.customization_options[index];
    if (!option) {
      return undefined;
    }
    return processAdvancedChoice(
      {
        option,
        xp_spent: xp,
        xp_locked: 0,
        unlocked: option.xp === xp,
        editable: true,
      },
      choice,
      option,
      cards
    );
  }

  public withCustomizations(
    listSeperator: string,
    customizations: CustomizationChoice[] | undefined,
    extraTicks?: number
  ): Card {
    if (!this.customization_options) {
      return this;
    }
    if (
      !customizations ||
      !find(customizations, (c) => c.xp_spent || c.unlocked)
    ) {
      return this;
    }
    if (this._textAlreadyCustomized) {
      return this;
    }
    const card = this.clone();
    const xp_spent =
      sumBy(customizations, (c) => c.xp_spent) + (extraTicks || 0);
    card.xp = Math.floor((xp_spent + 1) / 2.0);
    const unlocked = sortBy(
      filter(customizations, (c) => c.unlocked),
      (c) => c.option.index
    );
    const lines = (card.text || '').split('\n');

    const text_edits: string[] = [];
    forEach(unlocked, (change) => {
      const option = change.option;
      if (option.health) {
        card.health = (card.health || 0) + option.health;
      }
      if (option.sanity) {
        card.sanity = (card.sanity || 0) + option.sanity;
      }
      if (option.deck_limit) {
        card.deck_limit = option.deck_limit;
      }
      if (option.real_slot) {
        card.real_slot = option.real_slot;
        card.slot = Card.slotText(card.real_slot);
      }
      if (option.cost) {
        card.cost = (card.cost || 0) + option.cost;
      }
      if (option.real_traits) {
        card.real_traits = option.real_traits;
      }
      if (option.tags?.length) {
        card.tags = [...(card.tags || []), ...option.tags];
      }
      let text_edit = option.text_edit || '';
      if (option.text_change && option.choice) {
        switch (change.type) {
          case 'choose_trait': {
            const traits =
              change.choice.map((x) => `[[${x}]]`).join(listSeperator) || '';
            text_edit = traits
              ? text_edit.replace('_____', `<u>${traits}</u>`)
              : text_edit;
            break;
          }
          case 'choose_card': {
            const cardNames = change.cards
              .map((card) => card.name)
              .join(listSeperator);
            text_edit = cardNames
              ? `${text_edit} <u>${cardNames}</u>`
              : text_edit;
            break;
          }
          case 'choose_skill': {
            const skill = change.choice;
            text_edit = skill
              ? text_edit.replace('_____', `[${skill}]`)
              : text_edit;
            break;
          }
        }
      }
      text_edits.push(text_edit);
      if (option.text_change && text_edit) {
        const position = option.position || 0;
        if (option.choice !== 'choose_card') {
          switch (option.text_change) {
            case 'trait':
              card.traits = text_edit;
              break;
            case 'insert':
              // Delayed execution
              break;
            case 'replace':
              lines[position] = text_edit;
              break;
            case 'append':
              lines.push(text_edit);
              break;
          }
        }
      }
      if (option.choice) {
        switch (change.type) {
          case 'choose_trait': {
            change.choice.forEach((trait) => {
              const lower = trait.toLowerCase().trim();
              const translated = c('trait').t`Firearm`.toLowerCase();
              if (lower === 'firearm' || lower === translated) {
                card.tags = uniq([
                  ...(card.tags || []),
                  'fa',
                ]);
              }
            })
          }
          case 'remove_slot': {
            if (card.real_slot) {
              card.real_slot = flatMap(
                card.real_slot.split('.'),
                (slot, index) => {
                  if (index === change.choice) {
                    return [];
                  }
                  return slot.trim();
                }
              ).join('. ');
            }
            if (card.slot) {
              card.slot = flatMap(card.slot.split('.'), (slot, index) => {
                if (index === change.choice) {
                  return [];
                }
                return slot.trim();
              }).join('. ');
            }
          }
        }
      }
    });
    const final_lines: string[] = [];
    forEach(unlocked, ({ option }, idx) => {
      const text_edit = text_edits[idx];
      if (
        option.text_change === 'insert' &&
        option.position === -1 &&
        text_edit
      ) {
        final_lines.push(text_edit);
      }
    });

    forEach(lines, (line, idx) => {
      final_lines.push(line);
      forEach(unlocked, ({ option }, unlockedIdx) => {
        const text_edit = text_edits[unlockedIdx];
        if (
          option.text_change === 'insert' &&
          option.position === idx &&
          text_edit
        ) {
          final_lines.push(text_edit);
        }
      });
    });
    card.text = final_lines.join('\n');
    card._textAlreadyCustomized = true;
    return card;
  }

  public cardName(): string {
    return this.subname ? t`${this.name} <i>(${this.subname})</i>` : this.name;
  }

  public custom(): boolean {
    return (
      this.status === CardStatusType.CUSTOM ||
      this.status === CardStatusType.PREVIEW ||
      this.code.startsWith('z')
    );
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

  public matchesOption(option: DeckOption): boolean {
    if (option.type_code) {
      if (
        !find(option.type_code, (type_code) => this.type_code === type_code)
      ) {
        return false;
      }
    }
    if (option.trait) {
      if (
        !find(
          option.trait,
          (trait) =>
            !!this.real_traits &&
            this.real_traits.toLowerCase().indexOf(trait.toLowerCase()) !== -1
        )
      ) {
        return false;
      }
    }
    return true;
  }

  public imageUri(): string | undefined {
    if (this.imageurl) {
      if (this.imageurl.startsWith('https://img.arkhamcards.com')) {
        return this.imageurl.replace(
          'img.arkhamcards.com',
          'img2.arkhamcards.com'
        );
      }
      return this.imageurl;
    }
    if (!this.imagesrc) {
      return undefined;
    }
    const baseUri = this.custom()
      ? 'https://img2.arkhamcards.com'
      : 'https://arkhamdb.com';
    const uri = `${baseUri}${this.imagesrc}`;
    return uri;
  }
  public backImageUri(): string | undefined {
    if (this.backimageurl) {
      if (this.backimageurl.startsWith('https://img.arkhamcards.com')) {
        return this.backimageurl.replace(
          'img.arkhamcards.com',
          'img2.arkhamcards.com'
        );
      }
      return this.backimageurl;
    }
    if (!this.backimagesrc) {
      return undefined;
    }
    const baseUri = this.custom()
      ? 'https://img2.arkhamcards.com'
      : 'https://arkhamdb.com';
    return `${baseUri}${this.backimagesrc}`;
  }

  isBasicWeakness(): boolean {
    return (
      this.type_code !== 'scenario' && this.subtype_code === 'basicweakness'
    );
  }

  factionCode(): FactionCodeType {
    return this.faction_code || 'neutral';
  }

  factionCodes(): FactionCodeType[] {
    return [
      this.faction_code || 'neutral',
      ...(this.faction2_code ? [this.faction2_code] : []),
      ...(this.faction3_code ? [this.faction3_code] : []),
    ];
  }

  getHealth(traumaData: TraumaAndCardData | undefined) {
    if (!traumaData) {
      return this.health || 0;
    }
    const isYithian = !!(
      traumaData.storyAssets &&
      find(traumaData.storyAssets, (code) => code === BODY_OF_A_YITHIAN)
    );
    return isYithian ? 7 : this.health || 0;
  }

  getSanity(traumaData: TraumaAndCardData | undefined) {
    if (!traumaData) {
      return this.sanity || 0;
    }
    const isYithian = !!(
      traumaData.storyAssets &&
      find(traumaData.storyAssets, (code) => code === BODY_OF_A_YITHIAN)
    );
    return isYithian ? 7 : this.sanity || 0;
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
    return (
      this.eliminated(traumaData) ||
      (traumaData &&
        ((traumaData.physical || 0) > 0 || (traumaData.mental || 0) > 0))
    );
  }

  traumaString(
    listSeperator: string,
    traumaData: TraumaAndCardData | undefined
  ) {
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
    if (this.code === '02010' || this.code === '03238' || this.cost === -2) {
      return 'X';
    }
    if (this.permanent || this.double_sided || linked || this.cost === null) {
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
      case 'willpower':
        return this.skill_willpower || 0;
      case 'intellect':
        return this.skill_intellect || 0;
      case 'combat':
        return this.skill_combat || 0;
      case 'agility':
        return this.skill_agility || 0;
      case 'wild':
        return this.skill_wild || 0;
      default: {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        const _exhaustiveCheck: never = skill;
        return 0;
      }
    }
  }

  investigatorSelectOptions(): DeckOption[] {
    if (this.type_code === 'investigator' && this.deck_options) {
      return filter(this.deck_options, (option) => {
        return (
          !!(option.faction_select && option.faction_select.length > 0) ||
          !!(option.deck_size_select && option.deck_size_select.length > 0) ||
          !!(option.option_select && option.option_select.length > 0)
        );
      });
    }
    return [];
  }

  collectionQuantity(
    packInCollection: { [pack_code: string]: boolean | undefined },
    ignore_collection: boolean
  ): number {
    if (this.encounter_code || this.subtype_code) {
      return this.quantity || 0;
    }

    let quantity = this.quantity || 0;
    if (this.pack_code === 'core') {
      if (packInCollection.no_core) {
        quantity = 0;
      } else if (packInCollection.core) {
        // Second core set is indicated.
        quantity *= 2;
      } else if (ignore_collection) {
        quantity = Math.max(this.deck_limit || 0, this.quantity || 0);
      }
    } else if (!ignore_collection && !packInCollection[this.pack_code]) {
      quantity = 0;
    }
    if (this.reprint_info) {
      forEach(this.reprint_info, (reprint) => {
        if (reprint.pack_code && !!packInCollection[reprint.pack_code]) {
          quantity += Math.max(reprint.quantity || 0, this.deck_limit || 0);
        }
      });
    } else {
      forEach(this.reprint_pack_codes, (pack) => {
        if (!!packInCollection[pack]) {
          quantity += Math.max(this.quantity || 0, this.deck_limit || 0);
        }
      });
    }

    const alternatePack = this.encounter_code
      ? specialReprintCampaignPacks[this.pack_code]
      : specialReprintPlayerPacks[this.pack_code];
    if (alternatePack && packInCollection[alternatePack]) {
      quantity += this.quantity ?? 0;
    }
    const alternateCodePack = specialReprintCardPacks[this.code];
    if (alternateCodePack && packInCollection[alternateCodePack]) {
      quantity += this.quantity ?? 0;
    }
    return quantity;
  }

  collectionDeckLimit(
    packInCollection: { [pack_code: string]: boolean | undefined },
    ignore_collection: boolean
  ): number {
    if (ignore_collection) {
      return this.deck_limit || 0;
    }
    if (this.pack_code !== 'core' || packInCollection.core) {
      return this.deck_limit || 0;
    }
    const reprintPacks = this.reprint_pack_codes || REPRINT_CARDS[this.code];
    if (
      reprintPacks &&
      find(reprintPacks, (pack) => !!packInCollection[pack])
    ) {
      return this.deck_limit || 0;
    }
    return Math.min(this.quantity || 0, this.deck_limit || 0);
  }

  static parseRestrictions(json?: {
    investigator?: {
      [key: string]: string;
    };
    faction?: string[];
    trait?: string[];
  }): CardRestrictions | undefined {
    if (json && json.investigator && keys(json.investigator).length) {
      const investigators = keys(json.investigator);
      const mainInvestigator = min(investigators);
      return {
        restrictions_all_investigators: investigators,
        restrictions_investigator: mainInvestigator,
        restrictions_faction: json.faction ?? undefined,
        restrictions_trait: json.trait ?? undefined,
      };
    }
    if (json?.faction || json?.trait) {
      return {
        restrictions_faction: json.faction ?? undefined,
        restrictions_trait: json.trait ?? undefined,
      };
    }
    return undefined;
  }

  static basicFactions() {
    return [t`Guardian`, t`Seeker`, t`Rogue`, t`Mystic`, t`Survivor`];
  }

  static factionHeaderOrder() {
    const factions = Card.basicFactions();
    const triples: string[] = [];
    const doubles: string[] = [];
    forEach(factions, (f1, idx1) => {
      forEach(factions, (f2, idx2) => {
        if (idx1 < idx2) {
          forEach(factions, (f3, idx3) => {
            if (idx1 < idx2 && idx2 < idx3) {
              triples.push(`${f1} / ${f2} / ${f3}`);
            }
          });
          doubles.push(`${f1} / ${f2}`);
        }
      });
    });
    return [
      ...factions,
      t`Neutral`,
      t`Specialist`,
      ...doubles,
      ...triples,
      t`Basic Weakness`,
      t`Signature Weakness`,
      t`Weakness`,
      t`Mythos`,
    ];
  }

  static factionCodeToName(code: string, defaultName: string) {
    switch (code) {
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

  static factionSortHeader(
    card: SingleCardFragment,
    translation: CardTextFields,
    restrictions?: CardRestrictions
  ) {
    if (card.spoiler) {
      return t`Mythos`;
    }
    switch (card.subtype_code) {
      case 'basicweakness':
        return t`Basic Weakness`;
      case 'weakness':
        if (card.restrictions || restrictions?.restrictions_investigator) {
          return t`Signature Weakness`;
        }
        return t`Weakness`;
      default: {
        if (!card.faction_code || !translation.faction_name) {
          return t`Unknown`;
        }
        if (card.faction2_code && translation.faction2_name) {
          const factions = Card.basicFactions();
          const faction1 = Card.factionCodeToName(
            card.faction_code,
            translation.faction_name
          );
          const faction2 = Card.factionCodeToName(
            card.faction2_code,
            translation.faction2_name
          );
          if (card.faction3_code && translation.faction3_name) {
            const faction3 = Card.factionCodeToName(
              card.faction3_code,
              translation.faction3_name
            );
            const [f1, f2, f3] = sortBy([faction1, faction2, faction3], (x) =>
              indexOf(factions, x)
            );
            return `${f1} / ${f2} / ${f3}`;
          }
          const [f1, f2] = sortBy([faction1, faction2], (x) =>
            indexOf(factions, x)
          );
          return `${f1} / ${f2}`;
        }
        if (
          card.faction_code === 'neutral' &&
          restrictions?.restrictions_trait?.length
        ) {
          return t`Specialist`;
        }

        return Card.factionCodeToName(
          card.faction_code,
          translation.faction_name
        );
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

  static slotPosition(
    card: SingleCardFragment & { linked_card?: SingleCardFragment | null }
  ): number {
    if (card.hidden && card.linked_card) {
      return Card.slotPosition(card.linked_card);
    }
    if (card.permanent) {
      return 99;
    }
    if (card.real_slot) {
      switch (card.real_slot) {
        case 'Hand':
          return 1;
        case 'Hand x2':
          return 2;
        case 'Accessory':
          return 3;
        case 'Ally':
          return 4;
        case 'Arcane':
          return 5;
        case 'Arcane x2':
          return 6;
        case 'Body':
          return 7;
        case 'Tarot':
          return 8;
        case 'Body. Arcane':
          return 9;
        case 'Body. Hand x2':
          return 10;
        case 'Hand. Arcane':
          return 11;
        case 'Hand x2. Arcane':
          return 12;
        case 'Ally. Arcane':
          return 13;
        case 'Arcane. Accessory':
          return 14;
        default:
          return 16;
      }
    }
    return 100;
  }

  static typeSortHeader(
    card: SingleCardFragment & { linked_card?: SingleCardFragment | null },
    restrictions: CardRestrictions | undefined
  ): string {
    if (card.hidden && card.linked_card) {
      return Card.typeSortHeader(card.linked_card, restrictions);
    }
    switch (card.subtype_code) {
      case 'basicweakness':
        return t`Basic Weakness`;
      case 'weakness':
        if (card.spoiler) {
          return t`Story`;
        }
        if (card.restrictions || restrictions?.restrictions_investigator) {
          return t`Signature Weakness`;
        }
        return t`Weakness`;
      default:
        if (card.spoiler || card.encounter_code) {
          return t`Story`;
        }
        switch (card.type_code) {
          case 'asset':
            return t`Asset`;
          case 'event':
            return t`Event`;
          case 'skill':
            return t`Skill`;
          case 'investigator':
            return t`Investigator`;
          default:
            return t`Scenario`;
        }
    }
  }

  private static slotText(real_slot: string) {
    switch (real_slot.toLowerCase()) {
      case 'hand':
        return t`Hand`;
      case 'arcane':
        return t`Arcane`;
      case 'accessory':
        return t`Accessory`;
      case 'body':
        return t`Body`;
      case 'ally':
        return t`Ally`;
      case 'tarot':
        return t`Tarot`;
      case 'hand x2':
        return t`Hand x2`;
      case 'arcane x2':
        return t`Arcane x2`;
      default:
        return undefined;
    }
  }

  private static gqlTextFields(
    card: SingleCardFragment & {
      translations: CoreCardTextFragment[];
      linked_card?:
        | null
        | (SingleCardFragment & {
            translations: CoreCardTextFragment[];
          });
    },
    data: TranslationData
  ): CardTextFields {
    const t = card.translations.length ? card.translations[0] : undefined;
    return {
      name: t ? t.name : card.real_name,
      pack_name: data.packs[card.pack_code]?.name || card.real_pack_name,
      type_name: data.cardTypeNames[card.type_code],
      faction_name: data.factionNames[card.faction_code],
      faction2_name: card.faction2_code
        ? data.factionNames[card.faction2_code]
        : undefined,
      faction3_name: card.faction3_code
        ? data.factionNames[card.faction3_code]
        : undefined,

      flavor: (t ? t.flavor : card.real_flavor) || undefined,
      slot: (t ? t.slot : card.real_slot) || undefined,
      subname: (t ? t.subname : card.real_subname) || undefined,
      text: (t ? t.text : card.real_text) || undefined,
      traits: (t ? t.traits : card.real_traits) || undefined,
      back_flavor: (t ? t.back_flavor : card.real_back_flavor) || undefined,
      back_name: (t ? t.back_name : card.real_back_name) || undefined,
      back_text: (t ? t.back_text : card.real_back_text) || undefined,
      customization_text:
        (t ? t.customization_text : card.real_customization_text) || undefined,
      customization_change:
        (t ? t.customization_change : card.real_customization_change) ||
        undefined,
      taboo_text_change:
        (t ? t.taboo_text_change : card.real_taboo_text_change) || undefined,
      taboo_original_text:
        (t ? t.taboo_original_text : card.real_taboo_original_text) ||
        undefined,
      taboo_original_back_text:
        (t ? t.taboo_original_back_text : card.real_taboo_original_back_text) ||
        undefined,
      encounter_name: card.encounter_code
        ? data.encounterSets[card.encounter_code] ||
          card.real_encounter_set_name ||
          undefined
        : undefined,
      subtype_name: card.subtype_code
        ? data.subTypeNames[card.subtype_code]
        : undefined,
    };
  }

  static fromGraphQl(
    card: SingleCardFragment & {
      translations: CoreCardTextFragment[];
      linked_card?:
        | null
        | (SingleCardFragment & {
            translations: CoreCardTextFragment[];
          });
    },
    data: TranslationData
  ): Card {
    const translation = Card.gqlTextFields(card, data);
    const deck_requirements = card.deck_requirements
      ? DeckRequirement.parse(card.deck_requirements)
      : null;

    const side_deck_requirements = card.side_deck_requirements
      ? DeckRequirement.parse(card.side_deck_requirements)
      : null;

    if (card.code === '03004') {
      card.deck_options = [
        { faction: ['mystic', 'neutral'], level: { min: 0, max: 5 } },
        { tag: ['uc'], level: { min: 0, max: 4 } },
        { uses: ['charges', 'charge'], level: { min: 0, max: 4 } },
        { trait: ['occult'], level: { min: 0, max: 0 } },
      ];
    }
    const deck_options = card.deck_options
      ? DeckOption.parseList(card.deck_options)
      : [];

    const wild = card.skill_wild || 0;
    const eskills: any = {};
    if (card.type_code !== 'investigator' && wild > 0) {
      forEach(BASIC_SKILLS, (skill) => {
        const value = card[`skill_${skill}`] || 0;
        if (value > 0) {
          eskills[`eskill_${skill}`] = value + wild;
        }
      });
    }

    const name = translation.name.replace('', '');
    let renderName = name;
    let renderSubname = translation.subname;
    const json = card;
    if (card.type_code === 'act' && json.stage) {
      renderSubname = t`Act ${json.stage}`;
    } else if (card.type_code === 'agenda' && json.stage) {
      renderSubname = t`Agenda ${json.stage}`;
    } else if (card.type_code === 'scenario') {
      renderSubname = t`Scenario`;
    }
    const linked_card = card.linked_card
      ? Card.fromGraphQl(card.linked_card, data)
      : null;
    if (linked_card) {
      linked_card.back_linked = true;
      if (card.hidden && !linked_card.hidden) {
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
    const customization_options = CustomizationOption.fromGql(
      card,
      translation
    );
    const removable_slot = !!find(
      customization_options,
      (option) => option.choice === 'remove_slot'
    );
    const real_traits =
      find(customization_options, (t) => !!t.real_traits)?.real_traits ||
      card.real_traits;

    const normalize_array = (array: string[] | undefined): string | null =>
      array
        ?.map((t) => t.toLowerCase().trim())
        .filter((t) => !!t)
        .map((t) => `#${t}#`)
        .join(',') ?? null;
    const real_traits_normalized = normalize_array(real_traits?.split('.'));
    const traits_normalized = normalize_array(translation.traits?.split('.'));
    const real_slots_normalized = normalize_array(card.real_slot?.split('.'));
    const slots_normalized = normalize_array(translation.slot?.split('.'));

    const restrictions = Card.parseRestrictions(card.restrictions);
    const uses_match =
      card.code === '08062'
        ? ['foo', 'bar', 'charges']
        : card.real_text && card.real_text.match(USES_REGEX);
    const usesRaw = uses_match ? uses_match[2].toLowerCase() : null;
    const uses = usesRaw === 'charge' ? 'charges' : usesRaw;

    const bonded_match = card.real_text && card.real_text.match(BONDED_REGEX);
    const bonded_name = bonded_match ? bonded_match[1] : null;

    const seal_match = card.real_text && card.real_text.match(SEAL_REGEX);
    const seal = !!seal_match || card.code === SERPENTS_OF_YIG;

    const heals_horror =
      !!find(card.tags, (t) => t === 'hh') ||
      !!find(
        customization_options,
        (option) => !!find(option.tags, (t) => t === 'hh')
      );
    const heals_damage =
      !!find(card.tags, (t) => t === 'hd') ||
      !!find(
        customization_options,
        (option) => !!find(option.tags, (t) => t === 'hd')
      );

    const myriad = !!card.real_text && card.real_text.indexOf('Myriad.') !== -1;
    const advanced =
      !!card.real_text && card.real_text.indexOf('Advanced.') !== -1;

    const sort_by_type_header = Card.typeSortHeader(card, restrictions);
    const sort_by_type = Card.typeHeaderOrder().indexOf(sort_by_type_header);
    const sort_by_faction_header = Card.factionSortHeader(
      card,
      translation,
      restrictions
    );
    const sort_by_faction = Card.factionHeaderOrder().indexOf(
      sort_by_faction_header
    );
    const pack = data.packs[card.pack_code] || null;
    const sort_by_pack = pack
      ? pack.cycle_position * 200 +
        (pack.cycle_code === 'investigator' ? 0 : pack.position)
      : -1;
    const sort_by_cycle = pack?.cycle_position || 0;
    const sort_by_encounter_set_header =
      translation.encounter_name ||
      (linked_card && linked_card.encounter_name) ||
      t`N/A`;
    const sort_by_slot = Card.slotPosition(card);
    const spoiler = !!(card.spoiler || (linked_card && linked_card.spoiler));
    const enemy_horror =
      card.type_code === 'enemy' ? card.enemy_horror || 0 : null;
    const enemy_damage =
      card.type_code === 'enemy' ? card.enemy_damage || 0 : null;
    const firstName =
      card.type_code === 'investigator' && translation.name.indexOf(' ') !== -1
        ? translation.name
          .substring(0, translation.name.indexOf(' '))
          .replace(/"/g, '')
        : translation.name;
    const permanent = !!card.permanent;

    const altArtInvestigator = card.alt_art_investigator;
    let status: CardStatusType | undefined = undefined;
    if (!card.official) {
      status = CardStatusType.CUSTOM;
    } else if (card.preview) {
      status = CardStatusType.PREVIEW;
    }
    const s_search_name = searchNormalize(
      filter([renderName, renderSubname], (x) => !!x).join(' '),
      data.lang
    );
    const s_search_name_back = searchNormalize(
      filter(
        [name, translation.subname, translation.back_name],
        (x) => !!x
      ).join(' '),
      data.lang
    );
    const s_search_game = searchNormalize(
      filter([translation.text, translation.traits], (x) => !!x).join(' '),
      data.lang
    );
    const s_search_game_back =
      (translation.back_text &&
        searchNormalize(translation.back_text, data.lang)) ||
      '';
    const s_search_flavor =
      (translation.flavor && searchNormalize(translation.flavor, data.lang)) ||
      '';
    const s_search_flavor_back =
      (translation.back_flavor &&
        searchNormalize(translation.back_flavor, data.lang)) ||
      '';

    const s_search_real_name = searchNormalize(
      filter([card.real_name, card.real_subname], (x) => !!x).join(' '),
      'en'
    );
    const s_search_real_name_back = searchNormalize(
      filter([card.real_name, card.real_subname], (x) => !!x).join(' '),
      'en'
    );
    const s_search_real_game = searchNormalize(
      filter([card.real_text, real_traits], (x) => !!x).join(' '),
      'en'
    );
    const result = {
      ...omit(card, [
        'customization_options',
        'customization_text',
        'deck_options',
        'deck_requirements',
        'side_deck_requirements',
        'alt_art_investigator',
        'taboo_xp',
        'official',
        'preview',
        'permanent',
        'real_pack_name',
        'real_flavor',
        'real_customization_text',
        'real_taboo_text_change',
        'real_taboo_original_text_change',
        'real_taboo_original_back_text_change',
        'real_customization_text',
      ]),
      ...translation,
      ...eskills,
      id: card.id,
      extra_xp: card.taboo_xp,
      permanent,
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
      side_deck_requirements,
      deck_requirements,
      deck_options,
      linked_card,
      spoiler,
      traits_normalized,
      customization_options,
      real_traits_normalized,
      real_slots_normalized,
      slots_normalized,
      uses,
      bonded_name,
      cycle_name: pack.cycle_name,
      cycle_code: pack.cycle_code,
      has_restrictions:
        !!restrictions && !!restrictions.restrictions_investigator,
      restrictions_investigator: restrictions?.restrictions_investigator,
      restrictions_all_investigators:
        restrictions?.restrictions_all_investigators,
      restrictions_trait: normalize_array(restrictions?.restrictions_trait),
      restrictions_faction: normalize_array(restrictions?.restrictions_faction),
      seal,
      status,
      myriad,
      removable_slot,
      advanced,
      heals_horror,
      heals_damage,
      enemy_horror,
      enemy_damage,
      altArtInvestigator,
      sort_by_type,
      sort_by_faction,
      sort_by_pack,
      sort_by_cycle,
      sort_by_type_header,
      sort_by_faction_header,
      sort_by_encounter_set_header,
      sort_by_slot,
    };
    result.browse_visible = 0;
    if (
      result.code.startsWith('z') ||
      result.status === CardStatusType.PREVIEW ||
      result.status === CardStatusType.CUSTOM
    ) {
      result.browse_visible += 16;
    }
    if (result.code === RANDOM_BASIC_WEAKNESS) {
      result.deck_limit = 5;
      result.quantity = 5;
    }
    if (
      result.code === RANDOM_BASIC_WEAKNESS ||
      result.code === BODY_OF_A_YITHIAN
    ) {
      result.browse_visible += 3;
    } else if (
      !result.altArtInvestigator &&
      !result.back_linked &&
      !result.hidden
    ) {
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
    result.mythos_card =
      !!result.encounter_code || !!result.linked_card?.encounter_code;
    result.spoiler =
      result.spoiler || (result.linked_card && result.linked_card.spoiler);
    return result;
  }

  static querySort(sortIgnoreQuotes: boolean, sorts?: SortType[]): QuerySort[] {
    const result: QuerySort[] = [];
    let sortByName = true;
    let sortByXp = true;
    forEach(sorts, (sort) => {
      switch (sort) {
        case SORT_BY_TYPE:
          result.push({ s: 'c.sort_by_type', direction: 'ASC' });
          break;
        case SORT_BY_FACTION:
          result.push({ s: 'c.sort_by_faction', direction: 'ASC' });
          break;
        case SORT_BY_COST:
          result.push({ s: 'c.cost', direction: 'ASC' });
          break;
        case SORT_BY_PACK:
          result.push({ s: 'c.sort_by_pack', direction: 'ASC' });
          break;
        case SORT_BY_TITLE:
          sortByName = false;
          result.push({
            s: sortIgnoreQuotes ? 'c.s_search_name' : 'c.renderName',
            direction: 'ASC',
          });
          break;
        case SORT_BY_XP:
          sortByXp = false;
          result.push({ s: 'c.xp', direction: 'ASC' });
          break;
        case SORT_BY_CYCLE:
          result.push({ s: 'c.sort_by_cycle', direction: 'ASC' });
          break;
        case SORT_BY_CARD_ID:
          result.push({ s: 'c.code', direction: 'ASC' });
          break;
        case SORT_BY_SLOT:
          result.push({ s: 'c.sort_by_slot', direction: 'ASC' });
          result.push({ s: 'c.permanent', direction: 'DESC' });
          break;
        case SORT_BY_ENCOUNTER_SET:
          sortByName = false;
          sortByXp = false;
          result.push({ s: 'c.sort_by_pack', direction: 'ASC' });
          result.push({ s: 'c.encounter_code', direction: 'ASC' });
          result.push({ s: 'c.encounter_position', direction: 'ASC' });
          break;
        default:
          /* eslint-disable @typescript-eslint/no-unused-vars */
          const _exhaustiveCheck: never = sort;

          break;
      }
    });
    if (sortByName) {
      result.push({
        s: sortIgnoreQuotes ? 'c.s_search_name' : 'c.renderName',
        direction: 'ASC',
      });
    }
    if (sortByXp) {
      result.push({ s: 'c.xp', direction: 'ASC' });
    }
    return result;
  }
}

export type InvestigatorChoice = {
  main: Card;
  front: Card;
  back: Card;
};

export function cardInCollection(
  card: Card | PartialCard,
  packInCollection: { [pack_code: string]: boolean | undefined }
): boolean {
  if (packInCollection[card.pack_code]) {
    return true;
  }
  const alternatePack = card.encounter_code
    ? specialReprintCampaignPacks[card.pack_code]
    : specialReprintPlayerPacks[card.pack_code];
  if (alternatePack && packInCollection[alternatePack]) {
    return true;
  }
  const alternateCardPack = specialReprintCardPacks[card.code];
  if (alternateCardPack && packInCollection[alternateCardPack]) {
    return true;
  }
  const reprintPacks = card.reprint_pack_codes || REPRINT_CARDS[card.code];
  if (!reprintPacks) {
    return false;
  }
  return !!find(reprintPacks, (pack) => !!packInCollection[pack]);
}

export function packInCollection(
  { pack, encounter }: { pack: string; encounter: boolean },
  inCollection: {
    [pack_code: string]: boolean | undefined;
  }
) {
  if (inCollection[pack]) {
    return true;
  }
  const alternatePack = encounter
    ? specialReprintCampaignPacks[pack]
    : specialReprintPlayerPacks[pack];
  if (alternatePack && inCollection[alternatePack]) {
    return true;
  }
  const specialPackMatch = find(specialPacks, (specialPack) => {
    if (
      inCollection[specialPack.code] &&
      find(specialPack.packs, (p) => p === pack)
    ) {
      return encounter === !specialPack.player;
    }
    return false;
  });
  if (specialPackMatch) {
    return true;
  }
  return false;
}

export type CardKey = keyof Card;

export interface CardsMap {
  [code: string]: Card | undefined;
}
