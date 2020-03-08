export default class TabooSet {
  public static schema: Realm.ObjectSchema = {
    name: 'TabooSet',
    primaryKey: 'id',
    properties: {
      id: 'int',
      code: 'string',
      name: 'string',
      cardCount: 'int',
      active: 'bool?',
      date_start: 'string',
      date_update: 'string?',
    },
  };

  id!: number;
  code!: string;
  name!: string;
  cardCount!: number;
  active!: boolean | null;
  date_start!: string;
  date_update!: string | null;

  static fromJson(json: any, cardCount: number): TabooSet {
    return {
      id: json.id,
      code: json.code,
      name: json.name,
      cardCount,
      active: json.active === 1,
      date_start: json.date_start,
      date_update: json.date_update,
    };
  }
}
