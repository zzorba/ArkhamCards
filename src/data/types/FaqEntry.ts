import { Entity, Column, PrimaryColumn } from 'typeorm/browser';

@Entity('faq_entry')
export default class FaqEntry {

  @PrimaryColumn('text')
  code!: string;

  @Column('text', { nullable: true })
  text?: string;

  @Column('text', { nullable: true })
  updated?: string;

  @Column('datetime', { nullable: true })
  fetched?: Date;

  @Column('text', { nullable: true })
  lastModified?: string;

  static fromJson(code: string, json: any, lastModified?: string) {
    return {
      code,
      fetched: new Date(),
      text: json.text,
      updated: json.updated.date,
      lastModified,
    };
  }

  static empty(code: string, lastModified?: string) {
    return {
      fetched: new Date(),
      code: code,
      text: '',
      updated: '',
      lastModified,
    };
  }
}
