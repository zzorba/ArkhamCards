import { Column } from 'typeorm/browser';

export default class DeckOptionLevel {
  @Column('integer')
  public min!: number;

  @Column('integer')
  public max!: number;
}
