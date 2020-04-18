import { Effect } from './types';

export function getSpecialEffectChoiceList(
  id: string,
  effect: Effect
): string | undefined {
  switch (effect.type) {
    case 'add_card':
      if (effect.investigator === 'lead_investigator' && effect.optional) {
        return `${id}_investigator`;
      }
      // Intentional fall-through
      /* eslint-disable no-fallthrough */
    case 'remove_card':
      if (
        effect.investigator === 'choice' ||
        effect.investigator === 'any'
      ) {
        return `${id}_investigator`;
      }
      return undefined;
    case 'trauma':
      if (effect.mental_or_physical) {
        return `${id}_trauma`;
      }
      return undefined;
    case 'add_weakness':
      return `${id}_weakness`;
    default:
      return undefined;
  }
}
