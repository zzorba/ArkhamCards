import { Entity, Column, PrimaryColumn } from 'typeorm/browser';

@Entity('taboo_set')
export default class TabooSet {
  public static schema: Realm.ObjectSchema = {
    name: 'TabooSet',
    primaryKey: 'id',
    properties: {
      id: 'int',
      code: 'string',
      name: 'string',
      cardCount: 'int',
      active: 'bool?',
      date_start: 'string',
      date_update: 'string?',
    },
  };

  @PrimaryColumn('integer')
  id!: number;

  @Column('text', { nullable: true })
  code?: string;

  @Column('text', { nullable: true })
  name?: string;

  @Column('integer', { nullable: true })
  cardCount?: number;

  @Column('boolean', { nullable: true })
  active?: boolean;

  @Column('text', { nullable: true })
  date_start?: string;

  @Column('text', { nullable: true })
  date_update?: string;

  static fromJson(json: any, cardCount: number): TabooSet {
    return {
      id: json.id,
      code: json.code,
      name: json.name,
      cardCount,
      active: json.active === 1,
      date_start: json.date_start,
      date_update: json.date_update,
    };
  }
}
