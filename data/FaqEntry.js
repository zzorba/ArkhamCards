export default class FaqEntry {
  static fromJson(json, lastModified) {
    return {
      fetched: new Date(),
      code: json.code,
      text: json.text,
      updated: json.updated.date,
      lastModified,
    };
  }

  static empty(code, lastModified) {
    return {
      fetched: new Date(),
      code: code,
      text: '',
      updated: '',
      lastModified,
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
    'lastModified': 'string?',
  },
};
