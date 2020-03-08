import Realm from 'realm';
import { filter, keys, map } from 'lodash';

import CardRequirement from './CardRequirement';
import RandomRequirement from './RandomRequirement';

export default class DeckRequirement {
  public static schema: Realm.ObjectSchema = {
    name: 'DeckRequirement',
    properties: {
      size: 'int',
      card: 'CardRequirement[]',
      random: 'RandomRequirement[]',
    },
  };

  public size!: number;
  public card!: CardRequirement[];
  public random!: RandomRequirement[];

  static parse(json: any): DeckRequirement {
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
}
