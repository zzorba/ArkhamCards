import { keys, map, sum, values } from 'lodash';

export function exileString(exiles, cards) {
  const numCards = keys(exiles).length;
  switch (numCards) {
    case 0: return 'None';
    case 1:
    case 2:
      return map(keys(exiles), code => {
        const count = exiles[code];
        const card = cards[code];
        if (count === 1) {
          return card.name;
        }
        return `${card.name}${count > 1 ? ` x${count}` : ''}`;
      }).join(', ');
    default:
      // No room to print more than one card name, so just sum it
      return `${sum(values(exiles))} cards`;
  }
}

export default {
  exileString,
};
