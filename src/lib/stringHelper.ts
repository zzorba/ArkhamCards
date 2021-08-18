import { slice } from 'lodash';
import { t } from 'ttag';

export function stringList(things: string[], listSeperator: string): string {
  switch (things.length) {
    case 0: return '';
    case 1: return things[0];
    case 2: return t`${things[0]} and ${things[1]}`;
    default: {
      const listOfThings = slice(things, 0, things.length - 1).join(listSeperator);
      const lastThing = things[things.length - 1];
      return t`${listOfThings}, and ${lastThing}`;
    }
  }
}
