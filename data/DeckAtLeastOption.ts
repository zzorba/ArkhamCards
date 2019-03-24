import Realm from 'realm';

export default class DeckAtLeastOption {
  public static schema: Realm.ObjectSchema = {
    name: 'DeckAtLeastOption',
    properties: {
      factions: 'int',
      min: 'int',
    },
  };
  public factions!: number;
  public min!: number;
}
