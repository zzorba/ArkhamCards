import { Column } from 'typeorm/browser';

export default class DeckOptionLevel {
  @Column('integer', { nullable: true })
  public min?: number;

  @Column('integer', { nullable: true })
  public max!: number;
}
