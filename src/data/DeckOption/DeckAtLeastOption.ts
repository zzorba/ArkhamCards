import { Column } from 'typeorm/browser';

export default class DeckAtLeastOption {
  @Column('integer', { nullable: true })
  public factions?: number;

  @Column('integer', { nullable: true })
  public min?: number;
}
