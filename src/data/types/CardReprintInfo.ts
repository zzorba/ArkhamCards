import { Column } from 'typeorm/browser';
import Card from './Card';


export default class CardReprintInfo {
  @Column('text', { nullable: true })
  public pack_code?: string;

  @Column('text', { nullable: true })
  public pack_name?: string;

  @Column('integer', { nullable: true })
  public quantity?: number;

  @Column('integer', { nullable: true })
  public position?: number;

  @Column('text', { nullable: true })
  public cycle_code?: string;

  @Column('text', { nullable: true })
  public cycle_name?: string;

  static parse(card: Card): CardReprintInfo {
    const cri = new CardReprintInfo();
    cri.pack_code = card.pack_code;
    cri.pack_name = card.pack_name;
    cri.quantity = card.quantity;
    cri.position = card.position;
    cri.cycle_code = card.cycle_code;
    cri.cycle_name = card.cycle_name;

    return cri;
  }
}
