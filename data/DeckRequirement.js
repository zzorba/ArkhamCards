export default class DeckRequirement {

}

DeckRequirement.schema = {
  name: 'DeckRequirement',
  properties: {
    size: 'int',
    card: 'CardRequirement[]',
    random: 'RandomRequirement[]',
  },
};
