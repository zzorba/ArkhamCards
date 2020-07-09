import { Entity, Column, PrimaryColumn } from 'typeorm/browser';

import Card from './Card';

@Entity('encounter_set')
export default class EncounterSet {
  @PrimaryColumn('text')
  code!: string;

  @Column('text', { nullable: true })
  name!: string;

  static fromCard(card: Card): EncounterSet | undefined {
    if (!card.encounter_code || !card.encounter_name) {
      return undefined;
    }
    return {
      code: card.encounter_code,
      name: card.encounter_name,
    };
  }
}
