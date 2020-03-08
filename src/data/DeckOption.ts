import Realm from 'realm';
import { indexOf, map } from 'lodash';
import { t } from 'ttag';

import { DeckMeta } from 'actions/types';
import DeckAtLeastOption from './DeckAtLeastOption';
import DeckOptionLevel from './DeckOptionLevel';
import { FactionCodeType, TypeCodeType } from '../constants';

export default class DeckOption {
  public static schema: Realm.ObjectSchema = {
    name: 'DeckOption',
    properties: {
      faction: 'string[]',
      uses: 'string[]',
      trait: 'string[]',
      text: 'string[]',
      slot: 'string[]',
      type_code: 'string[]',
      atleast: 'DeckAtLeastOption?',
      level: 'DeckOptionLevel?',
      limit: 'int?',
      error: 'string?',
      not: 'bool?',
      real_name: 'string?',
      faction_select: 'string[]',
      deck_size_select: 'string[]',
    },
  };

  public type_code?: TypeCodeType[];
  public faction?: FactionCodeType[];
  public uses?: string[];
  public trait?: string[];
  public text?: string[];
  public slot?: string[];
  public atleast?: DeckAtLeastOption;
  public level?: DeckOptionLevel;
  public limit?: number;
  public error?: string;
  public not?: boolean;
  public real_name?: string;
  public faction_select?: FactionCodeType[];
  public deck_size_select?: string[];

  name() {
    switch (this.real_name) {
      case 'Secondary Class':
        return t`Secondary Class`;
      case 'Deck Size':
        return t`Deck Size`;
      default:
        return this.real_name;
    }
  }

  deckSizeOnly(): boolean {
    return !!(this.deck_size_select && this.deck_size_select.length > 0);
  }

  toQuery(meta?: DeckMeta) {
    let query = this.not ? 'NOT (' : '(';
    let dirty = false;
    if (this.faction && this.faction.length) {
      if (dirty) {
        query += ' AND';
      }
      query += ' (';
      query +=
        map(this.faction, faction =>
          ` faction_code == '${faction}' OR faction2_code == '${faction}'`)
          .join(' OR');
      query += ' )';

      dirty = true;
    }
    if (this.faction_select && this.faction_select.length) {
      if (dirty) {
        query += ' AND';
      }
      let factions = this.faction_select;
      if (meta &&
        meta.faction_selected &&
        indexOf(this.faction_select, meta.faction_selected) !== -1
      ) {
        // If we have a deck select ONLY the ones they specified.
        // If not select them all.
        factions = [meta.faction_selected];
      }
      query += ' (';
      query +=
        map(factions, faction =>
          ` faction_code == '${faction}' OR faction2_code == '${faction}'`)
          .join(' OR');
      query += ' )';

      dirty = true;
    }
    if (this.slot && this.slot.length) {
      if (dirty) {
        query += ' AND';
      }
      query += ' (';
      query += map(this.slot, slot => ` slot == '${slot}'`).join(' OR');
      query += ' )';
      dirty = true;
    }
    if (this.uses && this.uses.length) {
      if (dirty) {
        query += ' AND';
      }
      query += ' (';
      query += map(this.uses, use => ` uses == '${use}'`).join(' OR');
      query += ' )';
      dirty = true;
    }
    if (this.text && this.text.length) {
      if (dirty) {
        query += ' AND';
      }
      // No regex so we have to pre-bake these unfortunately.
      if (this.text[0] === '[Hh]eals? (\\d+ damage (and|or) )?(\\d+ )?horror' ||
        this.text[0] === '[Hh]eals? (that much )?(\\d+ damage (and|or) )?(\\d+ )?horror') {
        query += ' (heals_horror == true)';
        dirty = true;
      }
    }
    if (this.trait && this.trait.length) {
      if (dirty) {
        query += ' AND';
      }
      query += ' (';
      query +=
        map(this.trait, trait => ` real_traits_normalized contains '#${trait}#'`)
          .join(' OR');
      query += ' )';
      dirty = true;
    }
    if (this.level) {
      if (dirty) {
        query += ' AND';
      }
      query += ' (';
      query += ` xp >= ${this.level.min} AND xp <= ${this.level.max}`;
      query += ' )';
      dirty = true;
    }
    if (this.type_code && this.type_code.length) {
      if (dirty) {
        query += ' AND';
      }
      query += ' (';
      query +=
        map(this.type_code, type => ` type_code = '${type}'`).join(' OR');
      query += ' )';
      dirty = true;
    }
    query += ' )';
    if (query === '( )') {
      return null;
    }
    return query;
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
