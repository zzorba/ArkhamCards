import Realm from 'realm';

import CardRequirement from './CardRequirement';
import RandomRequirement from './RandomRequirement';

export default class DeckRequirement {
  public static schema: Realm.ObjectSchema = {
    name: 'DeckRequirement',
    properties: {
      size: 'int',
      card: 'CardRequirement[]',
      random: 'RandomRequirement[]',
    },
  };

  public size!: number;
  public card!: CardRequirement[];
  public random!: RandomRequirement[];
}
