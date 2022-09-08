import { flatMap } from 'lodash';
import { t } from 'ttag';

import { ChaosTokenType } from '@app_constants';
import Card from '@data/types/Card';
import { SingleChaosTokenValue } from '@data/scenario/types';

const ELDER_SIGN_REGEX = new RegExp('.*\\[elder_sign\\][^:]+: (.\\d+)\\..*');
const ELDER_SIGN_TEXT_REGEX = new RegExp('\\[elder_sign][^:]+:(.*)');
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

function basicElderSignValue(card: Card): SingleChaosTokenValue {
  switch (card.code) {
    // Roland Banks
    case '01001':
      return {
        token: 'elder_sign',
        type: 'counter',
        counter: {
          prompt: t`Number of clues on your location`,
          min: 0,
        },
      };
    // Agnes Baker
    case '01004':
      return {
        token: 'elder_sign',
        type: 'counter',
        counter: {
          prompt: t`Horror on Agnes Baker`,
          min: 0,
        },
      };
    // Wendy Adams
    case '01005':
      return {
        token: 'elder_sign',
        type: 'condition',
        condition: {
          default_value: {
            modifier: 0,
          },
          options: [
            {
              prompt: t`Wendy's Amulet in play`,
              modified_value: {
                modifier: 'auto_succeed',
              },
            },
          ],
        },
      };
    // Jenny Barnes
    case '02003':
    case '98001':
      return {
        token: 'elder_sign',
        type: 'counter',
        counter: {
          prompt: t`Number of resources you have`,
        },
      };
    // Mark Harrigan
    case '03001':
      return {
        token: 'elder_sign',
        type: 'counter',
        counter: {
          prompt: t`Damage on Mark Harrigan`,
        },
      };
    // Finn Edwards
    case '04003':
      return {
        token: 'elder_sign',
        type: 'counter',
        counter: {
          prompt: t`Number of exhausted enemies in play`,
        },
      };
    // Father Mateo
    case '04004':
      return {
        token: 'elder_sign',
        value: {
          modifier: 'auto_succeed',
        },
      };
    // Preston Fairmont
    case '05003':
      return {
        token: 'elder_sign',
        type: 'condition',
        condition: {
          default_value: {
            modifier: 0,
          },
          options: [
            {
              prompt: t`Spend two resources to automatically succeed`,
              modified_value: {
                modifier: 'auto_succeed',
              },
            },
          ],
        },
      };
    // Norman Withers
    case '08004':
    case '98007':
      return {
        token: 'elder_sign',
        type: 'counter',
        counter: {
          prompt: t`Resource cost of the top card on your deck`,
        },
      };
    // Bob Jenkins
    case '08016':
      return {
        token: 'elder_sign',
        type: 'counter',
        counter: {
          prompt: t`Number of [[Item]] assets you control`,
        },
      };
    default:
      if (card.real_text) {
        const match = card.real_text.match(ELDER_SIGN_REGEX);
        if (match) {
          return {
            token: 'elder_sign',
            value: {
              modifier: parseInt(match[1], 10),
            },
          };
        }
      }
      return {
        token: 'elder_sign',
        value: {
          modifier: 0,
        },
      };
  }
}

export function elderSign(
  card: Card
): SingleChaosTokenValue {
  const effect = basicElderSignValue(card);
  const elderSignLine = card.text && flatMap(card.text.split('\n'), line => {
    const match = line.match(ELDER_SIGN_TEXT_REGEX);
    if (match) {
      return [match[1]];
    }
    return [];
  }).join('\n');
  if (elderSignLine) {
    return {
      ...effect,
      text: elderSignLine,
    };
  }
  return effect;
}
