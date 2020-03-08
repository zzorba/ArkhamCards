import Realm from 'realm';

export default class RandomRequirement {
  public static schema: Realm.ObjectSchema = {
    name: 'RandomRequirement',
    properties: {
      'target': 'string',
      'value': 'string',
    },
  };

  public target!: string;
  public value!: string;
}
