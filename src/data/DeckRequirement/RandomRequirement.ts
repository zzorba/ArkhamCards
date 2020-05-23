import { Column } from 'typeorm';

export default class RandomRequirement {
  @Column('text', { nullable: true })
  public target?: string;

  @Column('text', { nullable: true })
  public value?: string;
}
