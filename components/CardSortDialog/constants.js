export const SORT_BY_TYPE = 'Type';
export const SORT_BY_FACTION = 'Faction';
export const SORT_BY_COST = 'Cost';
export const SORT_BY_PACK = 'Pack';
export const SORT_BY_TITLE = 'Title';

export const TYPE_SORT_CONDITIONS = [
  {
    label: 'Investigator',
    conditions: { type_code: 'investigator' },
  },{
    label: 'Asset',
    subLabel: 'Hand',
    conditions: { type_code: 'asset', slot: 'Hand' },
  },{
    label: 'Asset',
    subLabel: 'Hand x2',
    conditions: { type_code: 'asset', slot: 'Hand x2' },
  },{
    label: 'Asset',
    subLabel: 'Arcane',
    conditions: { type_code: 'asset', slot: 'Arcane' },
  },{
    label: 'Asset',
    subLabel: 'Arcane x2',
    conditions: { type_code: 'asset', slot: 'Arcane x2' },
  },{
    label: 'Asset',
    subLabel: 'Accessory',
    conditions: { type_code: 'asset', slot: 'Accessory' },
  },{
    label: 'Asset',
    subLabel: 'Body',
    conditions: { type_code: 'asset', slot: 'Body' },
  },{
    label: 'Asset',
    subLabel: 'Ally',
    conditions: { type_code: 'asset', slot: 'Ally' },
  },{
    label: 'Asset',
    subLabel: 'Other',
    conditions: { type_code: 'asset' },
  },{
    label: 'Event',
    conditions: { type_code: 'event' },
  },{
    label: 'Skill',
    conditions: { type_code: 'skill' },
  },{
    label: 'Weakness',
    conditions: { subtype_code: 'weakness' },
  },
];
