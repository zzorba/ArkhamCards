import { map } from 'lodash';

function applyTraitFilter(filters, query) {
  const {
    traits,
  } = filters;
  if (traits.length) {
    query.push([
      '(',
      map(traits, t => `traits_normalized CONTAINS[c] '${t}'`).join(' or '),
      ')',
    ].join(''));
  }
}

function applyXpFilter(filters, query) {
  const {
    xpLevels,
  } = filters;
  if (xpLevels.length) {
    query.push([
      '(',
      map(xpLevels, xp => `xp == '${xp}'`).join(' or '),
      ')',
    ].join(''));
  }
}

function applyFilter(values, field, query) {
  if (values.length) {
    query.push([
      '(',
      map(values, value => `${field} == '${value}'`).join(' or '),
      ')',
    ].join(''));
  }
}

export function applyFilters(filters) {
  const query = [];
  applyFilter(filters.factions, 'faction_code', query);
  applyFilter(filters.types, 'type_name', query);
  applyFilter(filters.subTypes, 'subtype_name', query);
  applyFilter(filters.slots, 'slot', query);
  applyFilter(filters.packs, 'pack_name', query);
  applyFilter(filters.encounters, 'encounter_name', query);
  applyFilter(filters.illustrators, 'illustrator', query);
  applyXpFilter(filters, query);
  applyTraitFilter(filters, query);
  return query;
}

export default {
  applyFilters,
};
