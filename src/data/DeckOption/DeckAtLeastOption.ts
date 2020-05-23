import { Column } from 'typeorm';

export default class DeckAtLeastOption {
  @Column('integer', { nullable: true })
  public factions?: number;

  @Column('integer', { nullable: true })
  public min?: number;
}
