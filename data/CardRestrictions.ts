import Realm from 'realm';
import { keys, min } from 'lodash';

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

  static parse(json: any): CardRestrictions {
    const result = new CardRestrictions();
    result.investigators = keys(json.investigator);
    const mainInvestigator = min(result.investigators);
    if (mainInvestigator) {
      result.investigator = mainInvestigator;
    }
    return result;
  }
}
