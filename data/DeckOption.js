import { map } from 'lodash';

export default class DeckOption {

  toQuery() {
    let query = this.not ? 'NOT (' : '(';
    let dirty = false;
    if (this.faction && this.faction.length) {
      if (dirty) {
        query += ' AND';
      }
      query += ' (';
      query +=
        map(this.faction, faction => ` faction_code == '${faction}'`)
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
      // No regex so we have to pre-bake these unfortunately.
      if (this.text[0] === '[Hh]eals? (\\d+ damage (and|or) )?(\\d+ )?horror' ||
        this.text[0] === '[Hh]eals? (that much )?(\\d+ damage (and|or) )?(\\d+ )?horror') {
        query += ' heals_horror == true ';
        dirty = true;
      }
    }
    if (this.trait && this.trait.length) {
      if (dirty) {
        query += ' AND';
      }
      query += ' (';
      query +=
        map(this.trait, trait => ` traits_normalized contains '#${trait}#'`)
          .join(' OR');
      query += ' )';
      dirty = true;
    }
    if (this.level) {
      if (dirty) {
        query += ' AND';
      }
      query += ` xp >= ${this.level.min} AND xp <= ${this.level.max}`;
      dirty = true;
    }
    query += ' )';
    return query;
  }
}

DeckOption.schema = {
  name: 'DeckOption',
  properties: {
    faction: 'string[]',
    uses: 'string[]',
    trait: 'string[]',
    text: 'string[]',
    atleast: 'DeckAtLeastOption?',
    level: 'DeckOptionLevel?',
    limit: 'int?',
    error: 'string?',
    not: 'bool?',
  },
};
