export const BASIC_WEAKNESS_QUERY = [
  'type_code != "scenario"',
  'subtype_code == "basicweakness"',
  'code != "01000"',
].join(' and ');
