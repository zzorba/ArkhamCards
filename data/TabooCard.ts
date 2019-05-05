import { forEach } from 'lodash';

import Card from './Card';
import BaseCard from './BaseCard';

export default class TabooCard extends BaseCard {
  public static schema: Realm.ObjectSchema = {
    name: 'TabooCard',
    primaryKey: 'id',
    properties: {
      id: 'string',
      taboo_id: 'int',
      taboo_text_change: 'string?',
      extra_xp: 'int?',
      ...BaseCard.SCHEMA,
    },
  };

  public id!: string;
  public taboo_id!: number;
  public taboo_text_change!: string | null;

  static fromJson(
    tabooId: number,
    json: any,
    card: Card
  ): TabooCard {
    const code: string = json.code;
    const result: TabooCard = {
      id: `${tabooId}-${code}`,
      taboo_id: tabooId,
      code: card.code,
    } as TabooCard;
    forEach(BaseCard.SCHEMA, property => {
      // @ts-ignore TS7017
      result[property] = card[property];
    });

    if (json.xp) {
      result.extra_xp = json.xp;
    }
    if (json.text) {
      result.taboo_text_change = json.text;
    }
    if (json.exceptional) {
      result.exceptional = true;
    }
    return result;
  }
}
