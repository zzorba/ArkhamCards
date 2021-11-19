import { CampaignId, CampaignNotes, InvestigatorData, ScenarioResult, TraumaAndCardData, WeaknessSet } from '@actions/types';
import { ChaosBag } from '@app_constants';
import LatestDeckT from './LatestDeckT';
import MiniCampaignT from './MiniCampaignT';

export default interface SingleCampaignT extends MiniCampaignT {
  latestDecks: () => LatestDeckT[];
  investigatorSpentXp: (code: string) => number;
  getInvestigatorData: (investigator: string) => TraumaAndCardData;

  deleted: boolean;
  showInterludes: boolean;
  chaosBag: ChaosBag;
  investigatorData: InvestigatorData;
  weaknessSet: WeaknessSet;
  campaignNotes: CampaignNotes;
  scenarioResults: ScenarioResult[];
  linkedCampaignId: CampaignId | undefined;
  guideVersion: number;
}
