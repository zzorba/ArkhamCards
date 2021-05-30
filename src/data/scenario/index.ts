import { find, flatMap, sortBy } from 'lodash';

import { NumberChoices, StandaloneId } from '@actions/types';
import { FullCampaign, Effect, Errata, Scenario } from './types';
import CampaignGuide, { CampaignLog, CampaignLogSection } from './CampaignGuide';
import ScenarioGuide from './ScenarioGuide';
import ScenarioStep from './ScenarioStep';
import GuidedCampaignLog from './GuidedCampaignLog';
import LatestDeckT from '@data/interfaces/LatestDeckT';

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
  type: 'locked' | 'playable' | 'skipped' | 'placeholder';
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
  [code: string]: LatestDeckT | undefined;
}

export interface DisplayChoice {
  border?: boolean;
  large?: boolean;
  text?: string;
  masculine_text?: string;
  feminine_text?: string;
  description?: string;
  steps?: string[] | null;
  effects?: Effect[] | null;
  pre_border_effects?: Effect[] | null;
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
    case 'fr':
      return {
        allLogEntries: require('../../../assets/campaignLogs_fr.json'),
        allCampaigns: require('../../../assets/allCampaigns_fr.json'),
        encounterSets: require('../../../assets/encounterSets_fr.json'),
        errata: require('../../../assets/campaignErrata_fr.json'),
      };
    case 'de':
      return {
        allLogEntries: require('../../../assets/campaignLogs_de.json'),
        allCampaigns: require('../../../assets/allCampaigns_de.json'),
        encounterSets: require('../../../assets/encounterSets_de.json'),
        errata: require('../../../assets/campaignErrata_de.json'),
      };
    case 'it':
      return {
        allLogEntries: require('../../../assets/campaignLogs_it.json'),
        allCampaigns: require('../../../assets/allCampaigns_it.json'),
        encounterSets: require('../../../assets/encounterSets_it.json'),
        errata: require('../../../assets/campaignErrata_it.json'),
      };
    case 'pt':
      return {
        allLogEntries: require('../../../assets/campaignLogs_pt.json'),
        allCampaigns: require('../../../assets/allCampaigns_pt.json'),
        encounterSets: require('../../../assets/encounterSets_pt.json'),
        errata: require('../../../assets/campaignErrata_pt.json'),
      };
    case 'zh':
      return {
        allLogEntries: require('../../../assets/campaignLogs_zh.json'),
        allCampaigns: require('../../../assets/allCampaigns_zh.json'),
        encounterSets: require('../../../assets/encounterSets_zh.json'),
        errata: require('../../../assets/campaignErrata_zh.json'),
      };
    case 'ko':
      return {
        allLogEntries: require('../../../assets/campaignLogs_ko.json'),
        allCampaigns: require('../../../assets/allCampaigns_ko.json'),
        encounterSets: require('../../../assets/encounterSets_ko.json'),
        errata: require('../../../assets/campaignErrata_ko.json'),
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

function combineCampaignLog(
  campaignLog: CampaignLog,
  sideCampaign: CampaignLog
): CampaignLog {
  const sections: CampaignLogSection[] = [];
  const usedSideSections: string[] = [];
  campaignLog.sections.forEach(section => {
    const sideSection = sideCampaign.sections.find(side => side.section === section.section);
    if (sideSection) {
      usedSideSections.push(section.section);
      sections.push({
        section: section.section,
        entries: [
          ...section.entries,
          ...sideSection.entries,
        ],
      });
    } else {
      sections.push(section);
    }
  });
  const usedSideSectionsSet = new Set(usedSideSections);
  sideCampaign.sections.forEach(side => {
    if (!usedSideSectionsSet.has(side.section)) {
      sections.push(side);
    }
  });
  return {
    ...campaignLog,
    sections,
  };
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
  const sideLogEntries = find(allLogEntries, log => log.campaignId === 'side');
  const sideCampaign = find(allCampaigns, campaign => campaign.campaign.id === 'side');

  if (!campaign || !logEntries || !sideCampaign || !sideLogEntries) {
    return undefined;
  }
  return new CampaignGuide(
    campaign,
    combineCampaignLog(logEntries, sideLogEntries),
    encounterSets,
    sideCampaign,
    errata,
  );
}

function findStandaloneScenario(id: StandaloneId, allCampaigns: FullCampaign[], allLogEntries: CampaignLog[]): undefined | {
  logEntries: CampaignLog;
  campaign: FullCampaign;
  scenario: Scenario;
} {
  const campaign = find(allCampaigns, campaign => campaign.campaign.id === id.campaignId);
  const logEntries = find(allLogEntries, log => log.campaignId === id.campaignId);
  const scenario = campaign && find(campaign.scenarios, scenario => scenario.id === id.scenarioId);
  if (!campaign || !scenario || !logEntries) {
    return undefined;
  }
  return {
    campaign,
    scenario,
    logEntries,
  };
}

export interface StandaloneScenarioInfo {
  id: StandaloneId;
  name: string;
  code: string;
  campaign: string;
  campaignPosition: number;
}

export function getStandaloneScenarios(
  lang: string
): StandaloneScenarioInfo[] {
  const {
    allLogEntries,
    allCampaigns,
  } = load(lang);
  const standalones = require('../../../assets/standaloneScenarios.json');
  return sortBy(flatMap(standalones, (id: StandaloneId) => {
    const data = findStandaloneScenario(id, allCampaigns, allLogEntries);
    if (!data) {
      console.log(`Could not find ${JSON.stringify(id)}`);
      return [];
    }
    return {
      id,
      name: data.scenario.scenario_name,
      code: data.scenario.id,
      campaign: data.campaign.campaign.id,
      campaignPosition: data.campaign.campaign.position,
    };
  }), scenario => scenario.name);
}

export default {
  getCampaignGuide,
};
