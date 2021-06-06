import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany } from 'typeorm/browser';
import { Rule as JsonRule } from '@data/scenario/types';
import { map } from 'lodash';

class RuleTableCell {
  @Column('text', { nullable: true })
  public color?: string;

  @Column('text')
  public text!: string;
}

export class RuleTableRow {
  @Column('simple-json', { nullable: true })
  public row!: RuleTableCell[];
}

@Entity('rule')
export default class Rule {
  @PrimaryColumn('text')
  public id!: string;

  @Column('integer', { nullable: true })
  public order?: number;

  @Column('text')
  public lang!: string;

  @Column('text')
  public title!: string;

  @Column('text', { nullable: true })
  public text?: string;

  @Column('simple-json', { nullable: true })
  table?: RuleTableRow[];

  @OneToMany(() => Rule, rule => rule.parentRule, { cascade: true, eager: true })
  public rules?: Rule[];

  @ManyToOne(() => Rule, rule => rule.rules)
  public parentRule?: Rule;

  static parse(lang: string, rule: JsonRule, order?: number): Rule {
    const result = new Rule();
    result.id = rule.id;
    result.order = order;
    result.title = rule.title;
    result.lang = lang;
    result.text = rule.text;
    result.table = rule.table ? map(rule.table, jsonTableRow => {
      const tableRow = new RuleTableRow();
      tableRow.row = map(jsonTableRow.row, cellJson => {
        const cell = new RuleTableCell();
        cell.color = cellJson.color || undefined;
        cell.text = cellJson.text;
        return cell;
      });
      return tableRow;
    }) : undefined;
    result.rules = rule.rules ? map(rule.rules, jsonSubRule => {
      const subRule = Rule.parse(lang, jsonSubRule);
      subRule.parentRule = result;
      return subRule;
    }) : undefined;
    return result;
  }
}
