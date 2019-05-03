import Card from './Card';
import BaseCard from './BaseCard';

export default class TabooCard extends BaseCard {
  public static schema: Realm.ObjectSchema = {
    name: 'TabooCard',
    primaryKey: 'id',
    properties: {
      id: 'string',
      taboo_id: 'string',
      text_change: 'string?',
      ...BaseCard.SCHEMA,
    },
  };

  public id!: string;
  public taboo_id!: string;
  public text_change!: string | null;

  static fromJson(
    tabooId: string,
    json: any,
    card: Card
  ): TabooCard {
    const code: string = json.code;
    const result: TabooCard = {
      id: `${tabooId}-${code}`,
      taboo_id: tabooId,
      ...card,
    } as TabooCard;

    if (json.xp) {
      result.extra_xp = json.xp;
    }
    if (json.text) {
      result.text_change = json.text;
    }
    if (json.exceptional) {
      result.exceptional = true;
    }
    return result;
  }
}
