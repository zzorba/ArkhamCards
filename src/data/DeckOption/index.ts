import { Column } from 'typeorm/browser';
import { indexOf, map } from 'lodash';
import { Brackets } from 'typeorm/browser';
import { t } from 'ttag';

import { DeckMeta } from 'actions/types';
import DeckAtLeastOption from './DeckAtLeastOption';
import DeckOptionLevel from './DeckOptionLevel';
import { FactionCodeType, TypeCodeType } from 'constants';
import FilterBuilder from 'lib/filters';
import { combineQueriesOpt, where } from 'data/query';

const FILTER_BUILDER = new FilterBuilder('deck');

export default class DeckOption {
  @Column('simple-array', { nullable: true })
  public type_code?: TypeCodeType[];

  @Column('simple-array', { nullable: true })
  public faction?: FactionCodeType[];

  @Column('simple-array', { nullable: true })
  public uses?: string[];

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

  @Column('integer', { nullable: true })
  public limit?: number;

  @Column('text', { nullable: true })
  public error?: string;

  @Column('boolean', { nullable: true })
  public not?: boolean;

  @Column('text', { nullable: true })
  public real_name?: string;

  @Column('simple-array', { nullable: true })
  public faction_select?: FactionCodeType[];

  @Column('simple-array', { nullable: true })
  public deck_size_select?: string[];

  static optionName(option: DeckOption) {
    switch (option.real_name) {
      case 'Secondary Class':
        return t`Secondary Class`;
      case 'Deck Size':
        return t`Deck Size`;
      default:
        return option.real_name;
    }
  }

  static deckSizeOnly(option: DeckOption): boolean {
    return !!(option.deck_size_select && option.deck_size_select.length > 0);
  }

  private selectedFactionFilter(meta?: DeckMeta): Brackets[] {
    if (this.faction_select && this.faction_select.length) {
      if (
        meta &&
        meta.faction_selected &&
        indexOf(this.faction_select, meta.faction_selected) !== -1
      ) {
        // If we have a deck select ONLY the ones they specified.
        // If not select them all.
        return FILTER_BUILDER.factionFilter([meta.faction_selected]);
      }
      return FILTER_BUILDER.factionFilter(this.faction_select);
    }
    return [];
  }

  private textClause(): Brackets[] {
    if (this.text && this.text.length && (
      this.text[0] === '[Hh]eals? (\\d+ damage (and|or) )?(\\d+ )?horror' ||
      this.text[0] === '[Hh]eals? (that much )?(\\d+ damage (and|or) )?(\\d+ )?horror' ||
      this.text[0] === '[Hh]eals? (that much )?((\\d+|all) damage (and|or) )?((\\d+|all) )?horror'
    )) {
      return [where('c.heals_horror = true')];
    }
    return [];
  }

  toQuery(meta?: DeckMeta): Brackets | undefined {
    const clauses: Brackets[] = [
      ...FILTER_BUILDER.factionFilter(this.faction || []),
      ...this.selectedFactionFilter(meta),
      ...FILTER_BUILDER.slotFilter(this.slot || []),
      ...FILTER_BUILDER.equalsVectorClause(this.uses || [], 'uses'),
      ...this.textClause(),
      ...FILTER_BUILDER.traitFilter(this.trait || []),
      ...(this.level ? FILTER_BUILDER.rangeFilter('xp', [this.level.min, this.level.max], true) : []),
      ...FILTER_BUILDER.equalsVectorClause(this.type_code || [], 'type_code')
    ];
    return combineQueriesOpt(clauses, 'and', !!this.not);
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
    deck_option.trait = json.trait || [];
    deck_option.type_code = json.type || [];
    deck_option.limit = json.limit;
    deck_option.error = json.error;
    deck_option.not = json.not ? true : undefined;
    deck_option.real_name = json.name || undefined;
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
  }
}
