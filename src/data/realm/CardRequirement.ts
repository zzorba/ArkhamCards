import Realm from 'realm';

export default class CardRequirement {
  public static schema: Realm.ObjectSchema = {
    name: 'CardRequirement',
    properties: {
      'code': 'string',
      'alternates': 'string[]',
    },
  };
  public code!: string;
  public alternates?: string[];
}
