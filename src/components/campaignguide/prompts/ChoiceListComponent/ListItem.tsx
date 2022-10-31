import Card from '@data/types/Card';
import { Gender_Enum } from '@generated/graphql/apollo-schema';

export default interface ListItem {
  code: string;
  investigator?: Card;
  name: string;
  description?: string;
  color?: string;
  gender?: Gender_Enum;
  component?: React.ReactNode;
}
