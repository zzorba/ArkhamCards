import { map, partition } from 'lodash';

import Card from '../data/Card';

/**
 * Turn the given realm card into a realm-query string.
 */
export function queryForInvestigator(investigator: Card) {
  const [inverted, normal] = partition(
    investigator.deck_options,
    opt => opt.not);
  // We assume that there is always at least one normalClause.
  const invertedClause = inverted.length ?
    `${map(inverted, option => option.toQuery()).join(' AND')} AND ` :
    '';
  const normalClause = map(normal, option => option.toQuery()).join(' OR');

  // Combine the two clauses with an AND to satisfy the logic here.
  return `((${invertedClause}(${normalClause})) OR restrictions.investigator == '${investigator.code}')`;
}

export default {
  queryForInvestigator,
};
