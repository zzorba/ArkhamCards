import { TabooSetFragment } from '@generated/graphql/apollo-schema';
import { Entity, Column, PrimaryColumn } from 'typeorm/browser';

@Entity('taboo_set')
export default class TabooSet {
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

  static fromGQL(tabooSet: TabooSetFragment): TabooSet {
    return {
      id: tabooSet.id,
      name: tabooSet.name || undefined,
      code: tabooSet.code,
      cardCount: tabooSet.card_count,
      active: tabooSet.active,
      date_start: tabooSet.date,
      date_update: tabooSet.date,
    };
  }
}
