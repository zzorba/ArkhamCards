import Realm from 'realm';
export default class FaqEntry {
  public static schema: Realm.ObjectSchema = {
    name: 'FaqEntry',
    primaryKey: 'code',
    properties: {
      'code': 'string',
      'text': 'string?',
      'updated': 'string?',
      'fetched': 'date',
      'lastModified': 'string?',
    },
  };

  public code!: string;
  public text?: string;
  public updated?: string;
  public fetched?: Date;
  public lastModified?: string;

  static fromJson(json: any, lastModified?: string) {
    return {
      fetched: new Date(),
      code: json.code,
      text: json.text,
      updated: json.updated.date,
      lastModified,
    };
  }

  static empty(code: string, lastModified?: string) {
    return {
      fetched: new Date(),
      code: code,
      text: '',
      updated: '',
      lastModified,
    };
  }
}
