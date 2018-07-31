import { findIndex } from 'lodash';

export function searchMatchesText(searchTerm, parts) {
  if (!searchTerm) {
    return true;
  }
  const terms = searchTerm.toLowerCase().split(' ');
  return findIndex(terms, term => {
    return findIndex(parts, part => part.toLowerCase().indexOf(term) !== -1) === -1;
  }) === -1;
}

export default {
  searchMatchesText,
};
