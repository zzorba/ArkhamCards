import { CampaignInvestigator } from '@data/scenario/GuidedCampaignLog';
import { Gender_Enum } from '@generated/graphql/apollo-schema';

export default interface ListItem {
  code: string;
  investigator?: CampaignInvestigator;
  name: string;
  description?: string;
  color?: string;
  gender?: Gender_Enum;
  component?: React.ReactNode;
}
