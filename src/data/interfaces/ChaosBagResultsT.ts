import { SealedToken } from '@actions/types';
import { ChaosTokenType } from '@app_constants';
import { Chaos_Bag_Tarot_Mode_Enum } from '@generated/graphql/apollo-schema';

export default interface ChaosBagResultsT {
  drawnTokens: ChaosTokenType[];
  sealedTokens: SealedToken[];
  blessTokens: number;
  curseTokens: number;
  totalDrawnTokens: number;
  tarot?: Chaos_Bag_Tarot_Mode_Enum;
}