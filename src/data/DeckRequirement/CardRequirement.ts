import { Column } from 'typeorm';

export default class CardRequirement {
  @Column('text', { nullable: true })
  public code?: string;

  @Column('simple-array', { nullable: true })
  public alternates?: string[];
}
