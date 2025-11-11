import { Column } from 'typeorm/browser';

import CardRequirement from './CardRequirement';
import ChoiceRequirement from './ChoiceRequirement';
import RandomRequirement from './RandomRequirement';

function isCardSet(obj: any): obj is string[] {
  return Array.isArray(obj) && obj.every(item => typeof item === 'string');
}

function isRandomRequirement(obj: any): obj is { target: string; value: string } {
  return typeof obj === 'object' &&
    obj !== null &&
    typeof obj.target === 'string' &&
    typeof obj.value === 'string';
}

function isChoiceRequirement(obj: any): obj is { target: string; value: string; permanent?: boolean } {
  return typeof obj === 'object' &&
    obj !== null &&
    typeof obj.target === 'string' &&
    typeof obj.value === 'string' &&
    (obj.permanent === undefined || typeof obj.permanent === 'boolean');
}

export default class DeckRequirement {
  @Column('integer', { nullable: true })
  public size?: number;

  @Column('simple-json', { nullable: true })
  public card?: CardRequirement[];

  @Column('simple-json', { nullable: true })
  public random!: RandomRequirement[];

  @Column('simple-json', { nullable: true })
  public choice?: ChoiceRequirement[];

  static parse(json: any): DeckRequirement {
    const dr = new DeckRequirement();

    // Parse card requirements from transposed sets format
    // [[code1, code2], [alt1, alt2, alt3]] means: code1+alt1, code2+alt2, and undefined+alt3
    // We need to use the MAX length across all sets
    if (json.card && Array.isArray(json.card) && json.card.length > 0) {
      const firstSet = json.card[0];
      if (isCardSet(firstSet)) {
        // Find max length across all sets
        const maxLength = Math.max(...json.card.map((s: any) => Array.isArray(s) ? s.length : 0));

        dr.card = [];
        for (let index = 0; index < maxLength; index++) {
          const cr = new CardRequirement();
          cr.code = index < firstSet.length ? firstSet[index] : '';
          cr.alternates = [];

          // Collect alternates from remaining sets
          for (let setIndex = 1; setIndex < json.card.length; setIndex++) {
            const alternateSet = json.card[setIndex];
            if (Array.isArray(alternateSet) && index < alternateSet.length) {
              cr.alternates.push(alternateSet[index]);
            }
          }

          dr.card.push(cr);
        }
      }
    }

    // Validate and parse choice requirements
    if (json.choice && Array.isArray(json.choice)) {
      dr.choice = json.choice
        .filter(isChoiceRequirement)
        .map((r: any) => {
          const cr = new ChoiceRequirement();
          cr.target = r.target;
          cr.value = r.value;
          cr.permanent = !!r.permanent;
          return cr;
        });
    }

    // Validate and parse random requirements
    if (json.random && Array.isArray(json.random)) {
      dr.random = json.random
        .filter(isRandomRequirement)
        .map((r: any) => {
          const rr = new RandomRequirement();
          rr.target = r.target;
          rr.value = r.value;
          return rr;
        });
    }

    // Validate size
    if (typeof json.size === 'number') {
      dr.size = json.size;
    }

    return dr;
  }
}
