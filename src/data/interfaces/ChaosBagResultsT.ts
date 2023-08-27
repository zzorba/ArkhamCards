import { ChaosBagHistory, SealedToken } from '@actions/types';
import { ChaosTokenType } from '@app_constants';
import { Campaign_Difficulty_Enum, Chaos_Bag_Tarot_Mode_Enum } from '@generated/graphql/apollo-schema';

export default interface ChaosBagResultsT {
  drawnTokens: ChaosTokenType[];
  sealedTokens: SealedToken[];
  blessTokens: number;
  curseTokens: number;
  totalDrawnTokens: number;
  tarot?: Chaos_Bag_Tarot_Mode_Enum;
  difficulty?: Campaign_Difficulty_Enum;
  history: ChaosBagHistory[];
}