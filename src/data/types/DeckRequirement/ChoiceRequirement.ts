import { Column } from 'typeorm/browser';

export default class ChoiceRequirement {
  @Column('text', { nullable: true })
  public target?: string;

  @Column('text', { nullable: true })
  public value?: string;

  @Column('boolean', { nullable: true })
  public permanent?: boolean;
}
