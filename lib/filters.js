import { findIndex, forEach, map } from 'lodash';

import { SKILLS } from '../constants';

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

function applySkillIconFilter(filters, query) {
  const parts = [];
  const doubleIcons = filters.doubleIcons;
  const matchAll = doubleIcons &&
    (findIndex(SKILLS, skill => filters[skill]) === -1);

  forEach(SKILLS, skill => {
    if (matchAll || filters[skill]) {
      parts.push(`skill_${skill} > ${doubleIcons ? 1 : 0}`);
    }
  });

  if (parts.length) {
    // Kick out investigators because they re-use the same field
    // and by definition cannot have skill icons.
    query.push(`(type_code != 'investigator')`);
    query.push(`(${parts.join(' or ')})`);
  }
}

function applyMiscFilter(filters, query) {
  const {
    nonElite,
    victory,
    // vengeance,
  } = filters;
  if (nonElite) {
    query.push(`type_code == 'enemy'`);
    query.push(`!(traits_normalized CONTAINS[c] 'elite')`);
  }
  if (victory) {
    query.push('victory > 0');
  }
  // if (vengeance) {
  //   query.push('vengeance > 0');
  // }
}

function applyXpFilter(filters, query) {
  const {
    xpLevels,
  } = filters;
  if (xpLevels.length) {
    query.push(`(${map(xpLevels, xp => `xp == '${xp}'`).join(' or ')})`);
  }
}

function applyFilter(values, field, query) {
  if (values.length) {
    query.push(`(${map(values, value => `${field} == '${value}'`).join(' or ')})`);
  }
}

export function applyFilters(filters) {
  const query = [];
  applyFilter(filters.factions, 'faction_code', query);
  applyFilter(filters.cycleNames, 'cycle_name', query);
  applyFilter(filters.types, 'type_name', query);
  applyFilter(filters.uses, 'uses', query);
  applyFilter(filters.subTypes, 'subtype_name', query);
  applyFilter(filters.slots, 'slot', query);
  applyFilter(filters.packs, 'pack_name', query);
  applyFilter(filters.encounters, 'encounter_name', query);
  applyFilter(filters.illustrators, 'illustrator', query);
  applySkillIconFilter(filters.skillIcons, query);
  applyMiscFilter(filters, query);
  applyXpFilter(filters, query);
  applyTraitFilter(filters, query);
  return query;
}

export default {
  applyFilters,
};
