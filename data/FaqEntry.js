export default class FaqEntry {
  static fromJson(json) {
    return {
      fetched: new Date(),
      code: json.code,
      text: json.text,
      updated: json.updated.date,
    };
  }

  static empty(code) {
    return {
      fetched: new Date(),
      code: code,
      text: '',
      updated: '',
    };
  }
}

FaqEntry.schema = {
  name: 'FaqEntry',
  primaryKey: 'code',
  properties: {
    'code': 'string',
    'text': 'string?',
    'updated': 'string?',
    'fetched': 'date',
  },
};
