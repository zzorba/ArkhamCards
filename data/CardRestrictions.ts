import Realm from 'realm';

export default class CardRestrictions {
  public static schema: Realm.ObjectSchema = {
    name: 'CardRestrictions',
    properties: {
      'investigators': 'string[]',
      'investigator': 'string',
    },
  };

  public investigators?: string[];
  public investigator!: string;
}
