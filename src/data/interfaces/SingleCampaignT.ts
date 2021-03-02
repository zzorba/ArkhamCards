import { CampaignId, CampaignNotes, Deck, ScenarioResult, WeaknessSet } from '@actions/types';
import { ChaosBag } from '@app_constants';
import MiniCampaignT from './MiniCampaignT';

export default interface SingleCampaignT extends MiniCampaignT {
  showInterludes: () => boolean;
  latestDecks: () => Deck[];
  guideVersion: () => number | undefined;
  investigatorSpentXp: (code: string) => number;

  chaosBag: () => ChaosBag;
  weaknessSet: () => WeaknessSet;
  campaignNotes: () => CampaignNotes;
  scenarioResults: () => ScenarioResult[];

  linkedCampaignId: () => CampaignId | undefined;
}
