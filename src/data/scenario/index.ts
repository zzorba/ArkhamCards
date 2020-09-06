import { find } from 'lodash';

import { Deck, NumberChoices } from '@actions/types';
import { FullCampaign, Effect, Errata } from './types';
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
  encounterSets: {
    [code: string]: string;
  };
  errata: Errata;
} {
  switch (lang) {
    case 'es':
      return {
        allLogEntries: require('../../../assets/campaignLogs_es.json'),
        allCampaigns: require('../../../assets/allCampaigns_es.json'),
        encounterSets: require('../../../assets/encounterSets_es.json'),
        errata: require('../../../assets/campaignErrata_es.json'),
      };
    case 'ru':
      return {
        allLogEntries: require('../../../assets/campaignLogs_ru.json'),
        allCampaigns: require('../../../assets/allCampaigns_ru.json'),
        encounterSets: require('../../../assets/encounterSets_ru.json'),
        errata: require('../../../assets/campaignErrata_ru.json'),
      };

    case 'de':
      return {
        allLogEntries: require('../../../assets/campaignLogs_de.json'),
        allCampaigns: require('../../../assets/allCampaigns_de.json'),
        encounterSets: require('../../../assets/encounterSets_de.json'),
        errata: require('../../../assets/campaignErrata_de.json'),
      };
    default:
    case 'en':
      return {
        allLogEntries: require('../../../assets/campaignLogs.json'),
        allCampaigns: require('../../../assets/allCampaigns.json'),
        encounterSets: require('../../../assets/encounterSets.json'),
        errata: require('../../../assets/campaignErrata.json'),
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
    encounterSets,
    errata,
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
      encounterSets,
      sideCampaign,
      errata,
    );
}

export default {
  getCampaignGuide,
};
