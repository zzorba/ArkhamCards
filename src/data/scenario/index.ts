import { find } from 'lodash';

import { Deck, NumberChoices } from '@actions/types';
import { FullCampaign, Effect } from './types';
import CampaignGuide, { CampaignLog } from './CampaignGuide';
import ScenarioGuide from './ScenarioGuide';
import ScenarioStep from './ScenarioStep';
import GuidedCampaignLog from './GuidedCampaignLog';

export interface ScenarioId {
  scenarioId: string;
  replayAttempt?: number;
  encodedScenarioId: string;
}

interface BasicScenario {
  id: ScenarioId;
  scenarioGuide: ScenarioGuide;
  latestCampaignLog: GuidedCampaignLog;
}

interface PlayedScenario extends BasicScenario {
  type: 'started' | 'completed';
  canUndo: boolean;
  closeOnUndo: boolean;
  steps: ScenarioStep[];
}

interface UnplayedScenario extends BasicScenario {
  type: 'locked' | 'playable' | 'skipped';
  canUndo: false;
  closeOnUndo: false;
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


function load(lang: string): {
  allLogEntries: CampaignLog[];
  allCampaigns: FullCampaign[];
} {
  switch (lang) {
    case 'es':
      return {
        allLogEntries: require('../../../assets/campaignLogs_es.json'),
        allCampaigns: require('../../../assets/allCampaigns_es.json'),
      };
      default:
      case 'en':
      return {
        allLogEntries: require('../../../assets/campaignLogs.json'),
        allCampaigns: require('../../../assets/allCampaigns.json'),
      };
  }
}

export function getCampaignGuide(
  id: string,
  lang: string
): CampaignGuide | undefined {
  const {
    allLogEntries,
    allCampaigns,
  } = load(lang);

  const campaign = find(allCampaigns, campaign =>
    campaign.campaign.id === id
  );
  const logEntries = find(allLogEntries, log => log.campaignId === id);
  const sideCampaign = find(allCampaigns, campaign => campaign.campaign.id === 'side');

  return campaign && logEntries && sideCampaign &&
    new CampaignGuide(
      campaign,
      logEntries,
      sideCampaign
    );
}

export default {
  getCampaignGuide,
};
