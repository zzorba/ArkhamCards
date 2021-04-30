import { SealedToken } from '@actions/types';
import { ChaosTokenType } from '@app_constants';

export default interface ChaosBagResultsT {
  drawnTokens: ChaosTokenType[];
  sealedTokens: SealedToken[];
  blessTokens: number;
  curseTokens: number;
  totalDrawnTokens: number;
}