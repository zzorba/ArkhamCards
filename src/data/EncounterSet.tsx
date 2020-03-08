import Card from './Card';

export default class EncounterSet {
  public static schema: Realm.ObjectSchema = {
    name: 'EncounterSet',
    primaryKey: 'code',
    properties: {
      code: 'string',
      name: 'string',
    },
  };

  code!: string;
  name!: string;

  static fromCard(card: Card): EncounterSet | undefined {
    if (!card.encounter_code || !card.encounter_name) {
      return undefined;
    }
    return {
      code: card.encounter_code,
      name: card.encounter_name,
    };
  }
}
