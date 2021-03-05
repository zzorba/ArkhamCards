import { CampaignId, CampaignNotes, Deck, InvestigatorData, ScenarioResult, TraumaAndCardData, WeaknessSet } from '@actions/types';
import { ChaosBag } from '@app_constants';
import MiniCampaignT from './MiniCampaignT';

export default interface SingleCampaignT extends MiniCampaignT {
  showInterludes: () => boolean;
  latestDecks: () => Deck[];
  guideVersion: () => number | undefined;
  investigatorSpentXp: (code: string) => number;

  investigatorData: () => InvestigatorData;

  getInvestigatorData: (investigator: string) => TraumaAndCardData;

  chaosBag: () => ChaosBag;
  weaknessSet: () => WeaknessSet;
  campaignNotes: () => CampaignNotes;
  scenarioResults: () => ScenarioResult[];

  linkedCampaignId: () => CampaignId | undefined;
}
