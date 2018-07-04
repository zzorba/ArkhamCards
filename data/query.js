export const BASIC_WEAKNESS_QUERY = [
  '(type_code == "treachery" or type_code =="enemy")',
  'subtype_code == "basicweakness"',
  'code != "01000"',
].join(' and ');
