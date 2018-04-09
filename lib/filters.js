
function applyFactionFilter(filters, query) {
  const {
    factions,
  } = filters;
  if (factions.length) {
    query.push([
      '(',
      factions.map(fc => `faction_code == '${fc}'`).join(' or '),
      ')',
    ].join(''));
  }
}

function applyTypeFilter(filters, query) {
  const {
    types,
  } = filters;
  if (types.length) {
    query.push([
      '(',
      types.map(tc => `type_code == '${tc}'`).join(' or '),
      ')',
    ].join(''));
  }
}

function applyTraitFilter(filters, query) {
  const {
    traits,
  } = filters;
  if (traits.length) {
    query.push([
      '(',
      traits.map(t => `traits_normalized CONTAINS[c] '${t}'`).join(' or '),
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
      xpLevels.map(xp => `xp == '${xp}'`).join(' or '),
      ')',
    ].join(''));
  }
}

export function applyFilters(filters) {
  const query = [];
  applyFactionFilter(filters, query);
  applyTypeFilter(filters, query);
  applyXpFilter(filters, query);
  applyTraitFilter(filters, query);
  return query;
}

export default {
  applyFilters,
};
