import { FactionCodeType, SkillCodeType, TypeCodeType } from '@app_constants';
import Card, { CardStatusType, normalize_array } from './Card';
import { cardFactionCode, cardSkillCount, cardCustom, cardRealCost, cardCollectionDeckLimit } from './cardHelpers';
import { SORT_BY_TYPE_SLOT, SORT_BY_FACTION_PACK, SORT_BY_FACTION_XP, SORT_BY_TITLE, SORT_BY_COST, SORT_BY_XP, SORT_BY_SLOT, SortType, ExtendedSortType, SORT_BY_TYPE, SORT_BY_FACTION, SORT_BY_PACK, SORT_BY_ENCOUNTER_SET, SORT_BY_CYCLE, SORT_BY_CARD_ID } from '@actions/types';
import { c, t } from 'ttag';
import CustomizationOption, { CustomizationChoice } from './CustomizationOption';
import { filter, find, forEach, head, sortBy, sumBy, uniq } from 'lodash';

export type LinkedListCard = Pick<Card,
  // Cost
  | 'cost'
  | 'xp'
  | 'realCost'
  | 'permanent'
  | 'double_sided'
  // Type
  | 'type_code'
  | 'subtype_code'
  // Faction
  | 'faction_code'
  | 'faction_name'
  | 'faction2_code'
  | 'factionCode'
  // Misc
  | 'hidden'
  | 'hasCustomizations'
  // Pack +Encounter
  | 'encounter_code'
  | 'encounter_name'
  | 'mythos_card'
  | 'pack_code'
> & {
  linked_card?: LinkedListCard;
};

/**
 * Lightweight card representation for list views.
 * Contains only the fields needed to render CardSearchResult.
 * This is a Pick of Card - any Card object satisfies this interface.
 */
export type ListCard = LinkedListCard & Pick<Card,
  // Identity
  | 'id'
  | 'code'
  | 'name'
  | 'real_name'
  | 'renderName'
  | 'renderSubname'
  // Display
  // Faction
  | 'faction3_code'
  // Stats
  | 'deck_limit'
  | 'quantity'
  // Skills
  | 'skill_willpower'
  | 'skill_intellect'
  | 'skill_combat'
  | 'skill_agility'
  | 'skill_wild'
  // Taboo
  | 'taboo_set_id'
  | 'taboo_placeholder'
  | 'extra_xp'
  // Special flags
  | 'advanced'
  | 'status'
  | 'spoiler'
  | 'reprint_pack_codes'
  // Traits
  | 'real_traits_normalized'
  // Restrictions & tags
  | 'tags'
  // Customizations
  | 'customization_options'
  // Bonded
  | 'bonded_name'
  // Helper methods
  | 'skillCount'
  | 'custom'
  | 'hasInvestigatorRestrictions'
  | 'collectionDeckLimit'
> & {
  // Methods that return ListCard instead of Card
  withCustomizations(listSeperator: string, customizations: CustomizationChoice[] | undefined, extraTicks?: number): ListCard;
};

export type ListCardWithHeader = ListCard & {
  // Header fields (dynamic based on sort)
  headerId: string;
  headerTitle: string;
}

/**
 * Lightweight implementation of LinkedListCard for database queries.
 * Can be created from raw SQL results with only the minimal fields.
 */
export class LinkedListCardImpl implements LinkedListCard {
  cost?: number;
  xp?: number;
  permanent?: boolean;
  double_sided?: boolean;
  type_code: TypeCodeType;
  subtype_code?: 'basicweakness' | 'weakness';
  faction_code: FactionCodeType;
  faction_name?: string;
  faction2_code?: FactionCodeType;
  hidden?: boolean;
  mythos_card: boolean;
  encounter_code?: string;
  encounter_name?: string;
  pack_code: string;
  linked_card?: LinkedListCard;

  // Private fields from SQL - use methods instead
  private has_customizations?: boolean;

  constructor(data: any) {
    this.cost = data.cost;
    this.xp = data.xp;
    this.permanent = data.permanent;
    this.double_sided = data.double_sided;
    this.type_code = data.type_code || '';
    this.subtype_code = data.subtype_code;
    this.faction_code = data.faction_code || 'neutral';
    this.faction_name = data.faction_name;
    this.faction2_code = data.faction2_code;
    this.hidden = data.hidden;
    this.mythos_card = data.mythos_card;
    this.encounter_code = data.encounter_code;
    this.encounter_name = data.encounter_name;
    this.pack_code = data.pack_code || '';
    this.linked_card = data.linked_card;
    this.has_customizations = data.has_customizations;
  }

  factionCode(): FactionCodeType {
    return cardFactionCode(this);
  }

  realCost(linked?: boolean): string | null {
    return cardRealCost(this, linked);
  }

  hasCustomizations(): boolean {
    return !!this.has_customizations;
  }

  /**
   * SQL SELECT statement for fetching LinkedListCard fields
   */
  static selectStatement(alias: string = 'linked_card'): string {
    const fields = [
      `${alias}.cost`,
      `${alias}.xp`,
      `${alias}.permanent`,
      `${alias}.double_sided`,
      `${alias}.type_code`,
      `${alias}.subtype_code`,
      `${alias}.faction_code`,
      `${alias}.faction_name`,
      `${alias}.faction2_code`,
      `${alias}.hidden`,
      `${alias}.mythos_card`,
      `${alias}.encounter_code`,
      `${alias}.encounter_name`,
      `${alias}.pack_code`,
      `CASE WHEN ${alias}.customization_options IS NOT NULL THEN 1 ELSE 0 END as has_customizations`,
    ];

    return fields.map(field => {
      const fieldName = field.includes(' as ') ? field : `${field} as ${alias}_${field.split('.').pop()}`;
      return fieldName;
    }).join(', ');
  }

  /**
   * Create LinkedListCardImpl from raw SQL result with prefix
   */
  static fromRaw(raw: any, prefix: string = 'linked_card'): LinkedListCardImpl | undefined {
    const type_code = raw[`${prefix}_type_code`];
    if (!type_code) {
      return undefined;
    }

    return new LinkedListCardImpl({
      cost: raw[`${prefix}_cost`],
      xp: raw[`${prefix}_xp`],
      permanent: raw[`${prefix}_permanent`],
      double_sided: raw[`${prefix}_double_sided`],
      type_code,
      subtype_code: raw[`${prefix}_subtype_code`],
      faction_code: raw[`${prefix}_faction_code`],
      faction_name: raw[`${prefix}_faction_name`],
      faction2_code: raw[`${prefix}_faction2_code`],
      hidden: raw[`${prefix}_hidden`],
      mythos_card: raw[`${prefix}_mythos_card`],
      encounter_code: raw[`${prefix}_encounter_code`],
      encounter_name: raw[`${prefix}_encounter_name`],
      pack_code: raw[`${prefix}_pack_code`],
      has_customizations: raw[`${prefix}_has_customizations`],
    });
  }
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

/**
 * Lightweight implementation of ListCard for database queries.
 * Can be created from raw SQL results with only the minimal fields.
 */
export class ListCardImpl implements ListCardWithHeader {
  id: string;
  code: string;
  name: string;
  real_name: string;
  renderName: string;
  renderSubname?: string;
  pack_code: string;
  type_code: TypeCodeType;
  subtype_code?: 'basicweakness' | 'weakness';
  faction_code: FactionCodeType;
  faction_name?: string;
  faction2_code?: FactionCodeType;
  faction3_code?: FactionCodeType;
  cost?: number;
  xp?: number;
  deck_limit?: number;
  permanent?: boolean;
  double_sided?: boolean;
  skill_willpower?: number;
  skill_intellect?: number;
  skill_combat?: number;
  skill_agility?: number;
  skill_wild?: number;
  taboo_set_id?: number;
  taboo_placeholder?: boolean;
  extra_xp?: number;
  advanced?: boolean;
  hidden?: boolean;
  status?: CardStatusType;
  mythos_card: boolean;
  encounter_code?: string;
  encounter_name?: string;
  real_traits_normalized?: string;
  linked_card?: LinkedListCard;
  spoiler?: boolean;
  reprint_pack_codes?: string[];
  tags?: string[];
  customization_options?: CustomizationOption[];
  bonded_name?: string;
  quantity?: number;

  // Header fields
  headerId: string;
  headerTitle: string;

  // Private fields from SQL - use methods instead
  private has_investigator_restrictions?: boolean;

  constructor(data: any, private _textAlreadyCustomized: boolean = false) {
    this.id = data.id || '';
    this.code = data.code || '';
    this.name = data.name || '';
    this.real_name = data.real_name || data.name || '';
    this.renderName = data.renderName || data.name || '';
    this.renderSubname = data.renderSubname;
    this.pack_code = data.pack_code || '';
    this.type_code = data.type_code || '';
    this.subtype_code = data.subtype_code;
    this.faction_code = data.faction_code || 'neutral';
    this.faction_name = data.faction_name;
    this.faction2_code = data.faction2_code;
    this.faction3_code = data.faction3_code;
    this.cost = data.cost;
    this.xp = data.xp;
    this.deck_limit = data.deck_limit;
    this.permanent = data.permanent;
    this.double_sided = data.double_sided;
    this.skill_willpower = data.skill_willpower;
    this.skill_intellect = data.skill_intellect;
    this.skill_combat = data.skill_combat;
    this.skill_agility = data.skill_agility;
    this.skill_wild = data.skill_wild;
    this.taboo_set_id = data.taboo_set_id;
    this.taboo_placeholder = data.taboo_placeholder;
    this.extra_xp = data.extra_xp;
    this.advanced = data.advanced;
    this.hidden = data.hidden;
    this.status = data.status;
    this.mythos_card = data.mythos_card;
    this.encounter_code = data.encounter_code;
    this.encounter_name = data.encounter_name;
    this.real_traits_normalized = data.real_traits_normalized;
    this.linked_card = data.linked_card;
    this.spoiler = data.spoiler;
    this.reprint_pack_codes = data.reprint_pack_codes;
    this.headerId = data.headerId || '';
    this.headerTitle = data.headerTitle || '';
    this.tags = data.tags;
    this.customization_options = data.customization_options;
    this.bonded_name = data.bonded_name;
    this.quantity = data.quantity;
    this.has_investigator_restrictions = data.has_investigator_restrictions;
  }

  factionCode(): FactionCodeType {
    return cardFactionCode(this);
  }

  skillCount(skill: SkillCodeType): number {
    return cardSkillCount(this, skill);
  }

  custom(): boolean {
    return cardCustom(this);
  }

  realCost(linked?: boolean): string | null {
    return cardRealCost(this, linked);
  }

  hasCustomizations(): boolean {
    return !!this.customization_options;
  }

  hasInvestigatorRestrictions(): boolean {
    return !!this.has_investigator_restrictions;
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

  /**
   * SQL SELECT statement for fetching ListCard fields
   * Use this with a LEFT JOIN to linked_card if needed:
   * .leftJoin('c.linked_card', 'linked_card')
   */
  static selectStatement(includeLinkedCard: boolean = false, sorts?: SortType[]): string {
    const fields = [
      'c.id as id',
      'c.code',
      'c.name',
      'c.real_name',
      'c.renderName',
      'c.renderSubname',
      'c.pack_code',
      'c.type_code',
      'c.subtype_code',
      'c.faction_code',
      'c.faction_name',
      'c.faction2_code',
      'c.faction3_code',
      'c.cost',
      'c.xp',
      'c.deck_limit',
      'c.permanent',
      'c.double_sided',
      'c.skill_willpower',
      'c.skill_intellect',
      'c.skill_combat',
      'c.skill_agility',
      'c.skill_wild',
      'c.taboo_set_id',
      'c.taboo_placeholder',
      'c.extra_xp',
      'c.advanced',
      'c.hidden',
      'c.status',
      'c.mythos_card',
      'c.encounter_code',
      'c.encounter_name',
      'c.real_traits',
      'c.real_traits_normalized',
      'c.spoiler',
      'c.reprint_pack_codes',
      'c.tags',
      'c.customization_options',
      'c.bonded_name',
      'c.quantity',
      'CASE WHEN c.restrictions_investigator IS NOT NULL THEN 1 ELSE 0 END as has_investigator_restrictions',
      HEADER_SELECT[ListCardImpl.headerSort(sorts)],
    ];

    if (includeLinkedCard) {
      // Add linked card fields using LinkedListCardImpl.selectStatement
      fields.push(LinkedListCardImpl.selectStatement('linked_card'));
    }

    return fields.join(', ');
  }

  /**
   * Create ListCardImpl from raw SQL result
   */
  static fromRaw(raw: any, sort?: ExtendedSortType): ListCardImpl | undefined {
    if (!raw.id || !raw.code || !raw.name) {
      return undefined;
    }

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

    const card = new ListCardImpl({
      ...raw,
      headerId: raw.headerId === null || raw.headerId === undefined
        ? 'null'
        : `${raw.headerId}`,
      headerTitle: header,
      reprint_pack_codes: raw.reprint_pack_codes ? raw.reprint_pack_codes.split(',') : undefined,
      spoiler: !!raw.spoiler,
    });

    // Parse linked_card if present using LinkedListCardImpl
    const linkedCard = LinkedListCardImpl.fromRaw(raw, 'linked_card');
    if (linkedCard) {
      card.linked_card = linkedCard;
    }

    return card;
  }

  collectionDeckLimit(
    packInCollection: { [pack_code: string]: boolean | undefined },
    ignore_collection: boolean
  ): number {
    return cardCollectionDeckLimit(this, packInCollection, ignore_collection);
  }

  withHeaderId(headerId: string): ListCardImpl {
    return new ListCardImpl({
      ...this,
      headerId,
    });
  }

  public withCustomizations(
    listSeperator: string,
    customizations: CustomizationChoice[] | undefined,
    extraTicks?: number
  ): ListCard {
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
    const xp_spent =
      sumBy(customizations, (c) => c.xp_spent) + (extraTicks || 0);
    const xp = Math.floor((xp_spent + 1) / 2.0);
    const unlocked = sortBy(
      filter(customizations, (c) => c.unlocked),
      (c) => c.option.index
    );
    let deck_limit = this.deck_limit;
    let cost = this.cost;
    let real_traits_normalized = this.real_traits_normalized;
    let tags = this.tags;

    forEach(unlocked, (change) => {
      const option = change.option;
      if (option.deck_limit) {
        deck_limit = option.deck_limit;
      }
      if (option.cost) {
        cost = (cost ?? 0) + option.cost;
      }
      if (option.real_traits) {
        real_traits_normalized = normalize_array(option.real_traits.split('.'))!;
      }
      if (option.tags?.length) {
        tags = [...(tags ?? []), ...option.tags];
      }
      if (option.choice) {
        switch (change.type) {
          case 'choose_trait': {
            change.choice.forEach((trait) => {
              const lower = trait.toLowerCase().trim();
              const translated = c('trait').t`Firearm`.toLowerCase();
              if (lower === 'firearm' || lower === translated) {
                tags = uniq([
                  ...(tags || []),
                  'fa',
                ]);
              }
            })
          }
          case 'remove_slot': {
            break;
          }
        }
      }
    });

    return new ListCardImpl({
      ...this,
      xp,
      cost,
      deck_limit,
      tags,
      real_traits_normalized,
    }, true);
  }
}

export interface ListCardsMap {
  [code: string]: ListCard | undefined;
}
