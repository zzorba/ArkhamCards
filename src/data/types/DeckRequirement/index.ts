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
    // Matches by tail: [[code1, code2], [alt1, alt2, alt3, alt4, alt5, alt6]]
    // means: code1 with alternates [alt1, alt2, alt3, alt4, alt5], code2 with alternates [alt6]
    // Extras go with the first code
    if (json.card && Array.isArray(json.card) && json.card.length > 0) {
      const firstSet = json.card[0];
      if (isCardSet(firstSet)) {
        const firstSetLength = firstSet.length;

        dr.card = [];
        for (let index = 0; index < firstSetLength; index++) {
          const cr = new CardRequirement();
          cr.code = firstSet[index];
          cr.alternates = [];

          // Collect alternates from remaining sets, matching from the tail
          for (let setIndex = 1; setIndex < json.card.length; setIndex++) {
            const alternateSet = json.card[setIndex];
            if (Array.isArray(alternateSet)) {
              const altLength = alternateSet.length;
              const offset = altLength - firstSetLength;

              if (index === 0) {
                // First item gets all extras plus its matched item
                for (let i = 0; i <= offset; i++) {
                  cr.alternates.push(alternateSet[i]);
                }
              } else {
                // Other items get their tail-matched item
                const altIndex = offset + index;
                if (altIndex < altLength) {
                  cr.alternates.push(alternateSet[altIndex]);
                }
              }
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
