import { find, flatMap, forEach, omit, sortBy } from 'lodash';

import { CampaignCycleCode, CampaignId, GuideInput, NumberChoices, StandaloneId, Trauma } from '@actions/types';
import { FullCampaign, Effect, Errata, Scenario, ChoiceIcon, ChaosToken, ChaosTokens, ScenarioChaosTokens, BorderColor, TabooSets } from './types';
import CampaignGuide, { CampaignLog, CampaignLogSection } from './CampaignGuide';
import ScenarioGuide from './ScenarioGuide';
import ScenarioStep from './ScenarioStep';
import GuidedCampaignLog from './GuidedCampaignLog';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import Card from '@data/types/Card';
import { useContext, useMemo } from 'react';
import LanguageContext from '@lib/i18n/LanguageContext';
import { Gender_Enum } from '@generated/graphql/apollo-schema';

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

export interface PlayedScenario extends BasicScenario {
  type: 'started' | 'completed';
  location?: string;
  canUndo: boolean;
  closeOnUndo: boolean;
  steps: ScenarioStep[];
  inputs: GuideInput[];
}

interface UnplayedScenario extends BasicScenario {
  type: 'locked' | 'playable' | 'skipped' | 'placeholder';
  canUndo: false;
  closeOnUndo: false;
  steps: ScenarioStep[];
}

export interface StepId {
  id: string;
  scenario?: string;
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
  border_color?: BorderColor;
  large?: boolean;
  text?: string;
  tokens?: ChaosToken[];
  selected_text?: string;
  selected_feminine_text?: string;
  selected_nonbinary_text?: string;
  icon?: ChoiceIcon | string;
  masculine_text?: string;
  feminine_text?: string;
  nonbinary_text?: string;
  description?: string;
  steps?: string[] | null;
  effects?: Effect[] | null;
  pre_border_effects?: Effect[] | null;
  trauma?: Trauma;
  resolute?: boolean;
  card?: Card;
  image?: string;
  imageOffset?: 'right' | 'left';
  hidden?: boolean;
}

export function selectedDisplayChoiceText(choice: DisplayChoice, gender?: Gender_Enum) {
  switch (gender) {
    case Gender_Enum.F: {
      return choice.selected_feminine_text || choice.feminine_text || choice.selected_text || choice.text;
    }
    case Gender_Enum.Nb: {
      return choice.selected_nonbinary_text || choice.nonbinary_text || choice.selected_text || choice.text;
    }
    case Gender_Enum.M:
    default:
      return choice.selected_text || choice.text;
  }
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

function loadAllChaosTokens(lang: string): ChaosTokens {
  switch (lang) {
    case 'es':
      return require('../../../assets/generated/chaosOdds_es.json')
    case 'ru':
      return require('../../../assets/generated/chaosOdds_ru.json');
    case 'fr':
      return require('../../../assets/generated/chaosOdds_fr.json');
    case 'de':
      return require('../../../assets/generated/chaosOdds_de.json');
    case 'it':
      return require('../../../assets/generated/chaosOdds_it.json');
    case 'pt':
      return require('../../../assets/generated/chaosOdds_pt.json');
    case 'pl':
      return require('../../../assets/generated/chaosOdds_pl.json');
    case 'zh':
      return require('../../../assets/generated/chaosOdds_zh.json');
    case 'ko':
      return require('../../../assets/generated/chaosOdds_ko.json');
    default:
    case 'vi':
    case 'en':
      return require('../../../assets/generated/chaosOdds.json');
  }
}

export function loadChaosTokens(lang: string, code?: string, scenario?: string): ScenarioChaosTokens | undefined {
  if (!code && !scenario) {
    return undefined;
  }
  const allTokens = loadAllChaosTokens(lang);
  return find(allTokens, t => !!(scenario && t.scenario === scenario)) || find(allTokens, t => !!(code && t.code === code));
}

export function loadTaboos(lang: string): TabooSets | undefined {
  switch (lang) {
    case 'es': return require('../../../assets/generated/taboos_es.json');
    case 'de': return require('../../../assets/generated/taboos_de.json');
    case 'ru': return require('../../../assets/generated/taboos_ru.json');
    case 'fr': return require('../../../assets/generated/taboos_fr.json');
    case 'it': return require('../../../assets/generated/taboos_it.json');
    case 'zh': return require('../../../assets/generated/taboos_zh.json');
    case 'ko': return require('../../../assets/generated/taboos_ko.json');
    case 'pt': return require('../../../assets/generated/taboos_pt.json');
    case 'pl': return require('../../../assets/generated/taboos_pl.json');
    case 'vi':
    case 'en':
    default:
      return undefined;
  }
}


function getScenarioNames(lang: string): { id: string; name: string}[] {
  switch (lang) {
    case 'es': return require('../../../assets/generated/scenarioNames_es.json');
    case 'de': return require('../../../assets/generated/scenarioNames_de.json');
    case 'ru': return require('../../../assets/generated/scenarioNames_ru.json');
    case 'fr': return require('../../../assets/generated/scenarioNames_fr.json');
    case 'it': return require('../../../assets/generated/scenarioNames_it.json');
    case 'zh': return require('../../../assets/generated/scenarioNames_zh.json');
    case 'ko': return require('../../../assets/generated/scenarioNames_ko.json');
    case 'pt': return require('../../../assets/generated/scenarioNames_pt.json');
    case 'pl': return require('../../../assets/generated/scenarioNames_pl.json');
    case 'vi': return require('../../../assets/generated/scenarioNames_vi.json');
    case 'en': return require('../../../assets/generated/scenarioNames.json');
    default:
      return [];
  }
}

export function useScenarioNames(): { [id: string]: string | undefined } {
  const { lang } = useContext(LanguageContext);
  return useMemo(() => {
    const list = getScenarioNames(lang);
    const result: { [id: string]: string | undefined } = {};
    forEach(list, ({ id, name }) => {
      result[id] = name;
    });
    return result;
  }, [lang]);
}


function loadAll(lang: string): {
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
        allLogEntries: require('../../../assets/generated/campaignLogs_es.json'),
        allCampaigns: require('../../../assets/generated/allCampaigns_es.json'),
        encounterSets: require('../../../assets/generated/encounterSets_es.json'),
        errata: require('../../../assets/generated/campaignErrata_es.json'),
      };
    case 'ru':
      return {
        allLogEntries: require('../../../assets/generated/campaignLogs_ru.json'),
        allCampaigns: require('../../../assets/generated/allCampaigns_ru.json'),
        encounterSets: require('../../../assets/generated/encounterSets_ru.json'),
        errata: require('../../../assets/generated/campaignErrata_ru.json'),
      };
    case 'fr':
      return {
        allLogEntries: require('../../../assets/generated/campaignLogs_fr.json'),
        allCampaigns: require('../../../assets/generated/allCampaigns_fr.json'),
        encounterSets: require('../../../assets/generated/encounterSets_fr.json'),
        errata: require('../../../assets/generated/campaignErrata_fr.json'),
      };
    case 'de':
      return {
        allLogEntries: require('../../../assets/generated/campaignLogs_de.json'),
        allCampaigns: require('../../../assets/generated/allCampaigns_de.json'),
        encounterSets: require('../../../assets/generated/encounterSets_de.json'),
        errata: require('../../../assets/generated/campaignErrata_de.json'),
      };
    case 'it':
      return {
        allLogEntries: require('../../../assets/generated/campaignLogs_it.json'),
        allCampaigns: require('../../../assets/generated/allCampaigns_it.json'),
        encounterSets: require('../../../assets/generated/encounterSets_it.json'),
        errata: require('../../../assets/generated/campaignErrata_it.json'),
      };
    case 'pt':
      return {
        allLogEntries: require('../../../assets/generated/campaignLogs_pt.json'),
        allCampaigns: require('../../../assets/generated/allCampaigns_pt.json'),
        encounterSets: require('../../../assets/generated/encounterSets_pt.json'),
        errata: require('../../../assets/generated/campaignErrata_pt.json'),
      };
    case 'zh':
      return {
        allLogEntries: require('../../../assets/generated/campaignLogs_zh.json'),
        allCampaigns: require('../../../assets/generated/allCampaigns_zh.json'),
        encounterSets: require('../../../assets/generated/encounterSets_zh.json'),
        errata: require('../../../assets/generated/campaignErrata_zh.json'),
      };
    case 'pl':
      return {
        allLogEntries: require('../../../assets/generated/campaignLogs_pl.json'),
        allCampaigns: require('../../../assets/generated/allCampaigns_pl.json'),
        encounterSets: require('../../../assets/generated/encounterSets_pl.json'),
        errata: require('../../../assets/generated/campaignErrata_pl.json'),
      };
    case 'ko':
      return {
        allLogEntries: require('../../../assets/generated/campaignLogs_ko.json'),
        allCampaigns: require('../../../assets/generated/allCampaigns_ko.json'),
        encounterSets: require('../../../assets/generated/encounterSets_ko.json'),
        errata: require('../../../assets/generated/campaignErrata_ko.json'),
      };
    case 'vi':
      return {
        allLogEntries: require('../../../assets/generated/campaignLogs_vi.json'),
        allCampaigns: require('../../../assets/generated/allCampaigns_vi.json'),
        encounterSets: require('../../../assets/generated/encounterSets_vi.json'),
        errata: require('../../../assets/generated/campaignErrata_vi.json'),
      };
    default:
    case 'en':
      return {
        allLogEntries: require('../../../assets/generated/campaignLogs.json'),
        allCampaigns: require('../../../assets/generated/allCampaigns.json'),
        encounterSets: require('../../../assets/generated/encounterSets.json'),
        errata: require('../../../assets/generated/campaignErrata.json'),
      };
  }
}


function load(lang: string, id: string): {
  allLogEntries: CampaignLog[];
  campaign: FullCampaign | undefined;
  sideCampaign: FullCampaign | undefined;
  encounterSets: {
    [code: string]: string;
  };
  errata: Errata;
} {
  const result = loadAll(lang);

  return {
    allLogEntries: result.allLogEntries,
    encounterSets: result.encounterSets,
    errata: result.errata,
    campaign: find(result.allCampaigns, campaign => campaign.campaign.id === id),
    sideCampaign: find(result.allCampaigns, campaign => campaign.campaign.id === 'side'),
  };
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
    campaign,
    sideCampaign,
    encounterSets,
    errata,
  } = load(lang, id);

  const logEntries = find(allLogEntries, log => log.campaignId === id);
  const sideLogEntries = find(allLogEntries, log => log.campaignId === 'side');

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

export interface StandaloneScenarioInfo {
  type: 'standalone';
  id: StandaloneId;
  name: string;
  code: string;
  campaign: string;
  campaignPosition: number;
}
export interface StandaloneCampaignInfo {
  type: 'campaign';
  id: CampaignCycleCode;
  name: string;
  code: string;
  campaign: string;
  campaignPosition: number;
}

export type StandaloneInfo = StandaloneCampaignInfo | StandaloneScenarioInfo;

interface StandaloneScenarioId extends StandaloneId {
  type: 'scenario';
}

interface StandaloneCampaignId {
  type: 'campaign';
  campaignId: string;
}


function findStandaloneScenario(id: StandaloneScenarioId, allCampaigns: FullCampaign[], allLogEntries: CampaignLog[]): undefined | {
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

function findStandaloneCampaign(id: StandaloneCampaignId, allCampaigns: FullCampaign[], allLogEntries: CampaignLog[]): undefined | {
  logEntries: CampaignLog;
  campaign: FullCampaign;
} {
  const campaign = find(allCampaigns, campaign => campaign.campaign.id === id.campaignId);
  const logEntries = find(allLogEntries, log => log.campaignId === id.campaignId);
  if (!campaign || !logEntries) {
    return undefined;
  }
  return {
    campaign,
    logEntries,
  };
}

export function getStandaloneScenarios(
  lang: string
): StandaloneInfo[] {
  const {
    allLogEntries,
    allCampaigns,
  } = loadAll(lang);
  const standalones = require('../../../assets/generated/standaloneScenarios.json');
  return sortBy(flatMap(standalones, (id: StandaloneScenarioId | StandaloneCampaignId) => {
    switch (id.type) {
      case 'scenario': {
        const data = findStandaloneScenario(id, allCampaigns, allLogEntries);
        if (!data) {
          console.log(`Could not find ${JSON.stringify(id)}`);
          return [];
        }
        return {
          type: 'standalone',
          id: { campaignId: id.campaignId, scenarioId: id.scenarioId },
          name: data.scenario.scenario_name,
          code: data.scenario.id,
          campaign: data.campaign.campaign.id,
          campaignPosition: data.campaign.campaign.position,
        };
      }
      case 'campaign': {
        const data = findStandaloneCampaign(id, allCampaigns, allLogEntries);
        if (!data) {
          console.log(`Could not find ${JSON.stringify(id)}`);
          return [];
        }
        return {
          type: 'campaign',
          id: (id.campaignId as CampaignCycleCode),
          name: data.campaign.campaign.name,
          code: data.campaign.campaign.id,
          campaign: 'side',
          campaignPosition: 0,
        };
      }
    }
  }), scenario => scenario.name);
}

export default {
  getCampaignGuide,
};
