import Realm from 'realm';
import { map } from 'lodash';
import { t } from 'ttag';

import DeckAtLeastOption from './DeckAtLeastOption';
import DeckOptionLevel from './DeckOptionLevel';
import { TypeCodeType } from '../constants';

export default class DeckOption {
  public static schema: Realm.ObjectSchema = {
    name: 'DeckOption',
    properties: {
      faction: 'string[]',
      uses: 'string[]',
      trait: 'string[]',
      text: 'string[]',
      type_code: 'string[]',
      atleast: 'DeckAtLeastOption?',
      level: 'DeckOptionLevel?',
      limit: 'int?',
      error: 'string?',
      not: 'bool?',
      real_name: 'string?',
      faction_select: 'string[]',
    },
  };

  public type_code!: TypeCodeType[];
  public faction!: string[];
  public uses!: string[];
  public trait!: string[];
  public text!: string[];
  public atleast?: DeckAtLeastOption;
  public level?: DeckOptionLevel;
  public limit?: number;
  public error?: string;
  public not?: boolean;
  public real_name?: string;
  public faction_select!: string[];

  name() {
    switch (this.real_name) {
      case 'Secondary Class':
        return t`Secondary Class`;
      default:
        return this.real_name;
    }
  }

  toQuery() {
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
    return query;
  }
}
