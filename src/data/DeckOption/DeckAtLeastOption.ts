import { Column } from 'typeorm/browser';

export default class DeckAtLeastOption {
  @Column('integer')
  public factions!: number;

  @Column('integer')
  public min!: number;
}
