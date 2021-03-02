import { CampaignCycleCode, ScenarioResult, StandaloneId, CampaignDifficulty, CampaignId, TraumaAndCardData } from '@actions/types';

export interface CampaignLink {
  campaignIdA: CampaignId;
  campaignIdB: CampaignId;
}

export default interface MiniCampaignT {
  id: () => CampaignId;
  uuid: () => string;
  guided: () => boolean;
  name: () => string;
  cycleCode: () => CampaignCycleCode;
  difficulty: () => CampaignDifficulty | undefined;
  standaloneId: () => StandaloneId | undefined;
  latestScenarioResult: () => ScenarioResult | undefined;
  investigators: () => string[];
  investigatorTrauma: (code: string) => TraumaAndCardData;
  updatedAt: () => Date;
  linked: () => undefined | CampaignLink;
}