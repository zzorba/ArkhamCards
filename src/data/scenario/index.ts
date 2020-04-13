import { find } from 'lodash';

import { Deck, NumberChoices } from 'actions/types';
import { FullCampaign, Effect } from './types';
import CampaignGuide, { CampaignLog } from './CampaignGuide';
import ScenarioGuide from './ScenarioGuide';
import ScenarioStep from './ScenarioStep';
import GuidedCampaignLog from './GuidedCampaignLog';

interface BasicScenario {
  scenarioGuide: ScenarioGuide;
  latestCampaignLog: GuidedCampaignLog;
  attempt: number;
}

interface PlayedScenario extends BasicScenario {
  type: 'started' | 'completed';
  canUndo: boolean;
  steps: ScenarioStep[];
}

interface UnplayedScenario extends BasicScenario {
  type: 'locked' | 'playable' | 'skipped';
  canUndo: false;
  steps: ScenarioStep[];
}

export type ProcessedScenario = PlayedScenario | UnplayedScenario;

export interface ProcessedCampaign {
  scenarios: ProcessedScenario[];
  campaignLog: GuidedCampaignLog;
}

export interface LatestDecks {
  [code: string]: Deck | undefined;
}

export interface DisplayChoice {
  border?: boolean;
  text?: string;
  description?: string;
  steps?: string[] | null;
  effects?: Effect[] | null;
}

export interface DisplayChoiceWithId extends DisplayChoice {
  id: string;
}

export interface UniversalChoices {
  type: 'universal';
  choices: DisplayChoiceWithId[];
}

export interface PersonalizedChoices {
  type: 'personalized';
  choices: DisplayChoiceWithId[];
  perCode: NumberChoices;
}

export type Choices = PersonalizedChoices | UniversalChoices;

export function getCampaignGuide(
  id: string
): CampaignGuide | undefined {
  const allLogEntries: CampaignLog[] = require('../../../assets/campaignLogs.json');
  const allCampaigns: FullCampaign[] = require('../../../assets/allCampaigns.json');

  const campaign = find(allCampaigns, campaign =>
    campaign.campaign.id === id
  );
  const logEntries = find(allLogEntries, log => log.campaignId === id);
  return campaign && logEntries && new CampaignGuide(campaign, logEntries);
}

export default {
  getCampaignGuide,
};
