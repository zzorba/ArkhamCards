import { Column } from 'typeorm/browser';

interface RuleTable {
  @Column('simple-json', { nullable: true })
  public row: {
    [k: string]: any;
  }[];

}
