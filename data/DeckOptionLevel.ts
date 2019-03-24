import Realm from 'realm';

export default class DeckOptionLevel {
  public static schema: Realm.ObjectSchema = {
    name: 'DeckOptionLevel',
    properties: {
      min: 'int',
      max: 'int',
    },
  };

  public min!: number;
  public max!: number;
}
