import { Column } from 'typeorm/browser';
import { filter, keys, map } from 'lodash';

import CardRequirement from './CardRequirement';
import ChoiceRequirement from './ChoiceRequirement';
import RandomRequirement from './RandomRequirement';

export default class DeckRequirement {
  @Column('integer', { nullable: true })
  public size?: number;

  @Column('simple-json', { nullable: true })
  public card?: CardRequirement[];

  @Column('simple-json', { nullable: true })
  public random!: RandomRequirement[];

  @Column('simple-json', { nullable: true })
  public choice?: ChoiceRequirement[];

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
    dr.choice = map(json.choice, r => {
      const cr = new ChoiceRequirement();
      cr.target = r.target;
      cr.value = r.value;
      cr.permanent = !!r.permanent;
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
