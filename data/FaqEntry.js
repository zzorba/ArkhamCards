export default class FaqEntry {
  static fromJson(json) {
    return {
      code: json.code,
      text: json.text,
      updated: json.updated.date,
    };
  }
}

FaqEntry.schema = {
  name: 'FaqEntry',
  primaryKey: 'code',
  properties: {
    'code': 'string', // primary key
    'text': 'string?',
    'updated': 'string?',
  },
};
