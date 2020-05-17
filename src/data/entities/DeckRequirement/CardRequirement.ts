import { Column } from 'typeorm/browser';

export default class CardRequirement {
  @Column('text', { nullable: true })
  public code?: string;

  @Column('simple-array', { nullable: true })
  public alternates?: string[];
}
