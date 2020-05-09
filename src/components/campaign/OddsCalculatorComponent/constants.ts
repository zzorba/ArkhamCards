import { t } from 'ttag';

import { InvestigatorElderSign } from './types';
import { ChaosTokenType } from 'constants';
import Card from 'data/Card';

const ELDER_SIGN_REGEX = new RegExp('.*\\[elder_sign\\] effect: (.\\d+)\\..*');

export function modifiers(card: Card): {
  token: ChaosTokenType;
  value: number;
}[] {
  switch (card.code) {
    // Jim Culver
    case '02004':
      return [{
        token: 'skull',
        value: 0,
      }];
    default :
      return [];
  }
}

export function elderSign(
  card: Card
): InvestigatorElderSign {
  switch (card.code) {
    // Roland Banks
    case '01001':
      return {
        type: 'counter',
        text: t`Number of clues on your location`,
      };
    // Agnes Baker
    case '01004':
      return {
        type: 'counter',
        text: t`Horror on Agnes Baker`,
      };
    // Wendy Adams
    case '01005':
      return {
        type: 'switch',
        text: t`Wendy's Amulet in play`,
        values: [0, 'auto_succeed'],
      };
    // Jenny Barnes
    case '02003':
      return {
        type: 'counter',
        text: t`Number of resources you have`,
      };
    // Mark Harrigan
    case '03001':
      return {
        type: 'counter',
        text: t`Damage on Mark Harrigan`,
      };
    // Finn Edwards
    case '04003':
      return {
        type: 'counter',
        text: t`Number of exhausted enemies in play`,
      };
    // Father Mateo
    case '04004':
      return {
        type: 'constant',
        value: 'auto_succeed',
      };
    // Preston Fairmont
    case '05003':
      return {
        type: 'switch',
        text: t`Spend two resources to automatically succeed`,
        values: [0, 'auto_succeed'],
      };
    // Preston Fairmont
    case '98007':
      return {
        type: 'counter',
        text: t`Resource cost of the top card on your deck`,
      };
    default:
      if (card.real_text) {
        const match = card.real_text.match(ELDER_SIGN_REGEX);
        if (match) {
          return {
            type: 'constant',
            value: parseInt(match[1], 10),
          };
        }
      }
      return {
        type: 'constant',
        value: 0,
      };
  }
}
