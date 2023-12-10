import { Brackets, Column } from 'typeorm/browser';
import { indexOf, map, omit, find } from 'lodash';
import { t } from 'ttag';

import { DeckMeta } from '@actions/types';
import DeckAtLeastOption from './DeckAtLeastOption';
import DeckOptionLevel from './DeckOptionLevel';
import { FactionCodeType, TypeCodeType } from '@app_constants';
import FilterBuilder from '@lib/filters';
import { combineQueries, combineQueriesOpt, where } from '@data/sqlite/query';

export function localizeDeckOptionError(error?: string): undefined | string {
  if (!error) {
    return undefined;
  }
  const LOCALIZED_OPTIONS: { [key: string]: string | undefined } = {
    'You cannot have more than 5 cards that are not Guardian or Neutral': t`You cannot have more than 5 cards that are not Guardian or Neutral`,
    'You cannot have more than 5 cards that are not Seeker or Neutral': t`You cannot have more than 5 cards that are not Seeker or Neutral`,
    'You cannot have more than 5 cards that are not Rogue or Neutral': t`You cannot have more than 5 cards that are not Rogue or Neutral`,
    'You cannot have more than 5 cards that are not Mystic or Neutral': t`You cannot have more than 5 cards that are not Mystic or Neutral`,
    'You cannot have more than 5 cards that are not Survivor or Neutral': t`You cannot have more than 5 cards that are not Survivor or Neutral`,
    'You must have at least 7 cards from 3 different factions': t`You must have at least 7 cards from 3 different factions`,
    'You cannot have more than 15 level 0-1 Seeker and/or Mystic cards': t`You cannot have more than 15 level 0-1 Seeker and/or Mystic cards`,
    'You cannot have more than 15 level 0-1 Guardian and/or Survivor cards': t`You cannot have more than 15 level 0-1 Guardian and/or Survivor cards`,
    'You cannot have more than 5 Guardian and/or Mystic cards': t`You cannot have more than 5 Guardian and/or Mystic cards`,
    'You cannot have more than 5 Seeker and/or Survivor cards': t`You cannot have more than 5 Seeker and/or Survivor cards`,
    'You cannot have more than 5 Mystic and/or Survivor cards': t`You cannot have more than 5 Mystic and/or Survivor cards`,
    'You cannot have more than 5 level 0 Mystic cards': t`You cannot have more than 5 level 0 Mystic cards`,
    'You cannot have more than 5 level 0 Survivor cards': t`You cannot have more than 5 level 0 Survivor cards`,
    'You cannot have more than 5 level 0 Guardian cards': t`You cannot have more than 5 level 0 Guardian cards`,
    'You cannot have more than 5 level 0 Seeker cards': t`You cannot have more than 5 level 0 Seeker cards`,
    'You cannot have more than 5 level 0 Rogue cards': t`You cannot have more than 5 level 0 Rogue cards`,
    'You cannot have more than 5 cards that are not Seeker, Neutral, or Paradox traited.': t`You cannot have more than 5 cards that are not Seeker, Neutral, or Paradox traited.`,
    'You must have at least 7 cards from each class': t`You must have at least 7 cards from each class`,
    'More off-class card than the number of weaknesses in your deck and bonded cards.': t`More off-class card than the number of weaknesses in your deck and bonded cards.`,
    'No permanents except story and signature permanents': t`No permanents except story and signature permanents`,
    'You cannot have more than 5 Survivor cards.': t`You cannot have more than 5 Survivor cards.`,
    'You cannot have more than 5 Mystic cards.': t`You cannot have more than 5 Mystic cards.`,
  };
  return LOCALIZED_OPTIONS[error] || error;
}


export function localizeOptionName(real_name: string): string {
  switch (real_name) {
    case 'Secondary Class':
      return t`Secondary Class`;
    case 'Deck Size':
      return t`Deck Size`;
    case 'Trait Choice':
      return t`Trait Choice`;
    case 'Blessed':
      return t`Blessed`;
    case 'Cursed':
      return t`Cursed`;
    case 'Blessed and Cursed':
      return t`Blessed and Cursed`;
    case 'Asset Class Choice':
      return t`Asset Class Choice`;
    case 'Skill Class Choice':
      return t`Skill Class Choie`;
    case 'Event Class Choice':
      return t`Event Class Choice`;
    case 'Class Choice':
      return t`Class Choice`;
    default:
      return real_name;
  }
}
export default class DeckOption {
  @Column('simple-array', { nullable: true })
  public type_code?: TypeCodeType[];

  @Column('simple-array', { nullable: true })
  public faction?: FactionCodeType[];

  @Column('simple-array', { nullable: true })
  public uses?: string[];

  @Column('simple-array', { nullable: true })
  public tag?: string[];

  @Column('simple-array', { nullable: true })
  public trait?: string[];

  @Column('simple-array', { nullable: true })
  public text?: string[];

  @Column('simple-array', { nullable: true })
  public slot?: string[];

  @Column('simple-json')
  public atleast?: DeckAtLeastOption;

  @Column('simple-json')
  public level?: DeckOptionLevel;

  @Column('simple-json')
  public base_level?: DeckOptionLevel;

  @Column('integer', { nullable: true })
  public limit?: number;

  @Column('text', { nullable: true })
  public error?: string;

  @Column('boolean', { nullable: true })
  public not?: boolean;

  @Column('boolean', { nullable: true })
  public restrictions?: boolean;

  @Column('boolean', { nullable: true })
  public permanent?: boolean;

  @Column('boolean', { nullable: true })
  public ignore_match?: boolean;

  // These fields are used for choice ones.
  @Column('text', { nullable: true })
  public real_name?: string;

  @Column('text', { nullable: true })
  public id?: string;

  @Column('simple-array', { nullable: true })
  public faction_select?: FactionCodeType[];

  @Column('simple-array', { nullable: true })
  public deck_size_select?: string[];

  @Column('simple-json', { nullable: true })
  public option_select?: (DeckOption & { id: string })[];

  @Column('integer', { nullable: true })
  public size?: number;

  public dynamic?: boolean;

  static optionName(option: DeckOption) {
    return localizeOptionName(option.real_name || '');
  }

  static deckSizeOnly(option: DeckOption): boolean {
    return !!(option.deck_size_select && option.deck_size_select.length > 0);
  }

  static parseList(jsonList: any[]): DeckOption[] {
    return map(jsonList, DeckOption.parse);
  }

  static parse(json: any): DeckOption {
    const deck_option = new DeckOption();
    deck_option.faction = json.faction || [];
    deck_option.faction_select = json.faction_select || [];
    deck_option.deck_size_select = json.deck_size_select || [];
    deck_option.uses = json.uses || [];
    deck_option.text = json.text || [];
    deck_option.slot = json.slot || [];
    deck_option.tag = json.tag || [];
    deck_option.trait = json.trait || [];
    deck_option.type_code = json.type || [];
    deck_option.limit = json.limit;
    deck_option.error = json.error;
    deck_option.id = json.id;
    if (json.permanent !== null && json.permanent !== undefined) {
      deck_option.permanent = json.permanent;
    }
    deck_option.size = json.size;
    deck_option.restrictions = json.restrictions;
    deck_option.not = json.not ? true : undefined;
    deck_option.ignore_match = json.ignore_match ? true : undefined;
    deck_option.real_name = json.name || json.real_name || undefined;
    if (json.option_select) {
      deck_option.option_select = map(json.option_select, o => {
        return {
          ...omit(o, ['name', 'id']),
          id: o.id,
          real_name: o.name,
        };
      });
    }
    if (json.base_level) {
      const level = new DeckOptionLevel();
      level.min = json.base_level.min;
      level.max = json.base_level.max;
      deck_option.base_level = level;
    }

    if (json.level) {
      const level = new DeckOptionLevel();
      level.min = json.level.min;
      level.max = json.level.max;
      deck_option.level = level;
    }

    if (json.atleast) {
      const atleast = new DeckAtLeastOption();
      if (json.atleast.factions) {
        atleast.factions = json.atleast.factions;
      }
      if (json.atleast.types) {
        atleast.types = json.atleast.types;
      }
      atleast.min = json.atleast.min;
      deck_option.atleast = atleast;
    }

    return deck_option;
  }
}

export class DeckOptionQueryBuilder {
  option: DeckOption;
  filterBuilder: FilterBuilder;
  index: number;

  constructor(option: DeckOption, index: number, prefix: string = 'deck') {
    this.option = option;
    this.index = index;
    this.filterBuilder = new FilterBuilder(`${prefix}${index}`);
  }

  private selectedFactionFilter(meta?: DeckMeta): Brackets[] {
    if (this.option.faction_select && this.option.faction_select.length) {
      if (meta) {
        const selection = this.option.id ? (meta[this.option.id] as FactionCodeType) : meta.faction_selected;
        if (selection && indexOf(this.option.faction_select, selection) !== -1) {
          // If we have a deck select ONLY the ones they specified.
          // If not select them all.
          return this.filterBuilder.factionFilter([selection]);
        }
      }
      return this.filterBuilder.factionFilter(this.option.faction_select);
    }
    return [];
  }

  private permanentFilter() {
    if (this.option.permanent !== null && this.option.permanent !== undefined) {
      return [
        where('c.permanent = :permanent', { permanent: this.option.permanent ? 1 : 0}),
      ];
    }
    return [];
  }

  private selectedOptionFilter(meta?: DeckMeta): Brackets[] {
    if (this.option.option_select && this.option.option_select.length) {
      const option = find(this.option.option_select, o => o.id === meta?.option_selected) || this.option.option_select[0];
      const query = new DeckOptionQueryBuilder(DeckOption.parse(option), this.index).toQuery(meta);
      return query ? [query] : [];
    }
    return [];
  }
  private textClause(): Brackets[] {
    if ((this.option.tag?.length && this.option.tag[0] === 'hh') || (
      this.option.text && this.option.text.length && (
        this.option.text[0] === '[Hh]eals? (that much )?((\\d+|all) damage (and|or) )?((\\d+|all) )?horror' ||
        this.option.text[0] === '[Hh]eals? (that much )?((\\d+|all) damage (from that asset )?(and|or) )?((\\d+|all) )?horror' ||
        this.option.text[0] === '[Hh]eals? (that much )?((\\d+|all|(X total)) damage (from that asset )?(and|or) )?((\\d+|all|(X total)) )?horror' ||
        this.option.text[0] === '[Hh]eals? (that much )?((\\d+|all|(X total) )?damage (from that asset )?(and|or) )?((\\d+|all|(X total)) )?horror' ||
        this.option.text[0] === '[Hh]eals? (that much )?(((\\d+|all|(X total)) )?damage (from that asset )?(and|or) )?((\\d+|all|(X total)) )?horror' ||
        this.option.text[0] === '[Hh]eals?( that much)?( (\\+?\\d+|all|(X total)))?( damage)?( from that asset)?( (and|or))?( (\\d+|all|(X total)))?(\\s|\\/)horror'
      )
    )) {
      return [where('c.heals_horror is not null AND c.heals_horror = 1')];
    }

    if ((this.option.tag?.length && this.option.tag[0] === 'hd') || (
      this.option.text && this.option.text.length && (
        this.option.text[0] === '[Hh]eals? (that much )?((((\\d+)|(all)|(X total)) )?horror (from that asset )?(and|or) )?(((\\d+)|(all)|(X total)) )?damage' ||
        this.option.text[0] === '[Hh]eals? (that much )?((((\\+?\\d+)|(all)|(X total)) )?horror (from that asset )?(and|or) )?(((\\+?\\d+)|(all)|(X total)) )?damage'
      )
    )) {
      return [where('c.heals_damage is not null AND c.heals_damage = 1')];
    }
    if (this.option.text?.length && this.option.text[0] === '<b>Parley\\.<\\/b>') {
      return [where(`c.real_text LIKE '%Parley.%' or linked_card.real_text LIKE '%Parley.%'`)]
    }
    if (this.option.text?.length && this.option.text[0] === '<b>Fight\\.<\\/b>') {
      return [where(`c.real_text LIKE '%Fight.%' or linked_card.real_text LIKE '%Fight.%'`)]
    }
    return [];
  }
  private levelFilter(isUpgrade?: boolean): Brackets[] {
    if (!this.option.level) {
      return [];
    }
    const level = (!this.option.base_level || isUpgrade) ? this.option.level : this.option.base_level;
    return !this.option.not ? [
        combineQueries(
          where('c.customization_options is not null'),
          this.filterBuilder.rangeFilter('xp', [level.min, level.max], true),
          'or'
        )] : this.filterBuilder.rangeFilter('xp', [level.min, level.max], true);
  }

  toQuery(meta?: DeckMeta, isUpgrade?: boolean): Brackets | undefined {
    const clauses: Brackets[] = [
      ...this.filterBuilder.factionFilter(this.option.faction || []),
      ...this.textClause(),
      ...this.levelFilter(isUpgrade),
      ...this.selectedFactionFilter(meta),
      ...this.selectedOptionFilter(meta),
      ...this.filterBuilder.slotFilter(this.option.slot || []),
      ...this.filterBuilder.equalsVectorClause(this.option.uses || [], 'uses'),
      ...this.permanentFilter(),
      ...this.filterBuilder.traitFilter(this.option.trait || [], false),
      ...this.filterBuilder.equalsVectorClause(this.option.type_code || [], 'type_code'),
      ...(this.option.text?.length ? [] : this.filterBuilder.tagFilter(this.option.tag ?? [])),
    ];
    return combineQueriesOpt(clauses, 'and', !!this.option.not);
  }
}