import { Column } from 'typeorm';
import { keys, min } from 'lodash';

export default class CardRestriction {
  @Column('simple-array')
  public investigators?: string[];

  @Column('text')
  public investigator?: string;

  static parse(json: any): CardRestriction {
    const result = new CardRestriction();
    result.investigators = keys(json.investigator);
    const mainInvestigator = min(result.investigators);
    if (mainInvestigator) {
      result.investigator = mainInvestigator;
    }
    return result;
  }
}
