import { Column } from 'typeorm';

export default class DeckOptionLevel {
  @Column('integer')
  public min!: number;

  @Column('integer')
  public max!: number;
}
