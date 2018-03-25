export default class DeckOption {

}

DeckOption.schema = {
  name: 'DeckOption',
  properties: {
    faction: 'string[]',
    uses: 'string[]',
    trait: 'string[]',
    atleast: 'DeckAtLeastOption?',
    level: 'DeckOptionLevel?',
    limit: 'int?',
    error: 'string?',
    not: 'bool?',
  },
};
