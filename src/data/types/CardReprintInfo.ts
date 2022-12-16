import { Column } from 'typeorm/browser';
import { filter, keys, map } from 'lodash';
import Card from './Card';


export default class CardReprintInfo {
  @Column('text', { nullable: true })
  public pack_code?: string;

  @Column('text', { nullable: true })
  public pack_name?: string;

  @Column('integer', { nullable: true })
  public quantity?: number;

  static parse(card: Card): CardReprintInfo {
    const cri = new CardReprintInfo();
    cri.pack_code = card.pack_code;
    cri.pack_name = card.pack_name;
    cri.quantity = card.quantity;
    return cri;
  }
}
