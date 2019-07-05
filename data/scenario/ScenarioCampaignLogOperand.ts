import Realm from 'realm';

export default class ScenarioCampaignLogOperand {
  public static schema: Realm.ObjectSchema = {
    name: 'ScenarioCampaignLogOperand',
    properties: {
      section: 'string',
      id: 'string?',
    },
  };
  public section!: string;
  public id!: string | null;
}
