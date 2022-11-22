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
      if (effect.investigator === '$fixed_investigator') {
        return '$fixed_investigator';
      }
      // Intentional fall-through
      /* eslint-disable no-fallthrough */
    case 'remove_card':
      switch (effect.investigator) {
        case 'choice':
        case 'any':
        case 'any_resigned':
          return `${id}_investigator`;
        case '$fixed_investigator':
          return '$fixed_investigator';
        default:
          return undefined;
      }
    case 'earn_xp':
      if (effect.investigator === '$fixed_investigator') {
        return '$fixed_investigator';
      }
      return undefined;
    case 'trauma':
      if (effect.mental_or_physical) {
        return `${id}_trauma`;
      }
      if (effect.investigator === '$fixed_investigator') {
        return '$fixed_investigator';
      }
      return undefined;
    case 'add_weakness':
      return `${id}_weakness`;
    default:
      return undefined;
  }
}
