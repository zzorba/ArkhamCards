import { find, flatMap, forEach, sortBy } from 'lodash';

import {
  CampaignCycleCode,
  GuideInput,
  NumberChoices,
  StandaloneId,
  Trauma,
} from '@actions/types';
import {
  FullCampaign,
  Effect,
  Errata,
  Scenario,
  ChoiceIcon,
  ChaosToken,
  ChaosTokens,
  ScenarioChaosTokens,
  BorderColor,
  TabooSets,
  BinaryConditionalChoice,
  CampaignRule,
} from './types';
import CampaignGuide, {
  CampaignLog,
  CampaignLogSection,
} from './CampaignGuide';
import ScenarioGuide from './ScenarioGuide';
import ScenarioStep from './ScenarioStep';
import GuidedCampaignLog from './GuidedCampaignLog';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import Card from '@data/types/Card';
import { useContext, useEffect, useMemo, useState } from 'react';
import LanguageContext from '@lib/i18n/LanguageContext';
import { Gender_Enum } from '@generated/graphql/apollo-schema';
import { loadAsset } from '@lib/assetLoader';
import { useAsset } from '@lib/useAsset';

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
  rules: CampaignRule[];
}

interface UnplayedScenario extends BasicScenario {
  type: 'locked' | 'playable' | 'skipped' | 'placeholder';
  location?: string;
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
  allow_duplicates?: boolean;

  conditionHidden?: boolean;
}

export function selectedDisplayChoiceText(
  choice: DisplayChoice,
  gender?: Gender_Enum
) {
  switch (gender) {
    case Gender_Enum.F: {
      return (
        choice.selected_feminine_text ||
        choice.feminine_text ||
        choice.selected_text ||
        choice.text
      );
    }
    case Gender_Enum.Nb: {
      return (
        choice.selected_nonbinary_text ||
        choice.nonbinary_text ||
        choice.selected_text ||
        choice.text
      );
    }
    case Gender_Enum.M:
    default:
      return choice.selected_text || choice.text;
  }
}

export interface DisplayChoiceWithId extends DisplayChoice {
  id: string;
}

export interface BinaryConditionalChoiceWithId extends BinaryConditionalChoice {
  id: string;
  conditionHidden?: boolean;
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

async function loadAllChaosTokens(lang: string): Promise<ChaosTokens> {
  const assetKey = lang === 'vi' || lang === 'en' ? 'chaos_odds' : `chaos_odds_${lang}`;
  return await loadAsset<ChaosTokens>(assetKey);
}

export async function loadChaosTokens(
  lang: string,
  code?: string,
  scenario?: string
): Promise<ScenarioChaosTokens | undefined> {
  if (!code && !scenario) {
    return undefined;
  }
  const allTokens = await loadAllChaosTokens(lang);
  return (
    find(allTokens, (t) => !!(scenario && t.scenario === scenario)) ||
    find(allTokens, (t) => !!(code && t.code === code))
  );
}

export async function loadTaboos(lang: string): Promise<TabooSets | undefined> {
  if (lang === 'vi' || lang === 'en' || lang === 'cs') {
    return undefined;
  }
  const assetKey = `taboos_${lang}`;
  return await loadAsset<TabooSets>(assetKey);
}

// async function getScenarioNames(lang: string): Promise<{ id: string; name: string }[]> {
//   const assetKey = (lang === 'en' || lang === 'cs') ? 'scenario_names' : `scenario_names_${lang}`;
//   return await loadAsset<{ id: string; name: string }[]>(assetKey);
// }

export function useScenarioNames(): { [id: string]: string | undefined } {
  const { lang } = useContext(LanguageContext);
  const assetKey = useMemo(() => (lang === 'en' || lang === 'cs') ? 'scenario_names' : `scenario_names_${lang}`, [lang]);
  const list = useAsset<{ id: string; name: string }[]>(assetKey);
  return useMemo(() => {
    if (!list) {
      return {};
    }
    const result: { [id: string]: string | undefined } = {};
    forEach(list, ({ id, name }) => {
      result[id] = name;
    });
    return result;
  }, [list]);
}

async function loadAll(lang: string): Promise<{
  allLogEntries: CampaignLog[];
  allCampaigns: FullCampaign[];
  encounterSets: {
    [code: string]: string;
  };
  errata: Errata;
}> {
  const suffix = lang === 'en' ? '' : `_${lang}`;
  const [allLogEntries, allCampaigns, encounterSets, errata] = await Promise.all([
    loadAsset<CampaignLog[]>(`campaign_logs${suffix}`),
    loadAsset<FullCampaign[]>(`all_campaigns${suffix}`),
    loadAsset<{ [code: string]: string }>(`encounter_sets${suffix}`),
    loadAsset<Errata>(`campaign_errata${suffix}`),
  ]);
  return {
    allLogEntries,
    allCampaigns,
    encounterSets,
    errata,
  };
}

async function load(
  lang: string,
  id: string
): Promise<{
  allLogEntries: CampaignLog[];
  campaign: FullCampaign | undefined;
  sideCampaign: FullCampaign | undefined;
  encounterSets: {
    [code: string]: string;
  };
  errata: Errata;
}> {
  const result = await loadAll(lang);

  return {
    allLogEntries: result.allLogEntries,
    encounterSets: result.encounterSets,
    errata: result.errata,
    campaign: find(
      result.allCampaigns,
      (campaign) => campaign.campaign.id === id
    ),
    sideCampaign: find(
      result.allCampaigns,
      (campaign) => campaign.campaign.id === 'side'
    ),
  };
}

function combineCampaignLog(
  campaignLog: CampaignLog,
  sideCampaign: CampaignLog
): CampaignLog {
  const sections: CampaignLogSection[] = [];
  const usedSideSections: string[] = [];
  campaignLog.sections.forEach((section) => {
    const sideSection = sideCampaign.sections.find(
      (side) => side.section === section.section
    );
    if (sideSection) {
      usedSideSections.push(section.section);
      sections.push({
        section: section.section,
        entries: [...section.entries, ...sideSection.entries],
      });
    } else {
      sections.push(section);
    }
  });
  const usedSideSectionsSet = new Set(usedSideSections);
  sideCampaign.sections.forEach((side) => {
    if (!usedSideSectionsSet.has(side.section)) {
      sections.push(side);
    }
  });
  return {
    ...campaignLog,
    sections,
  };
}

export async function getCampaignGuide(
  id: string,
  lang: string
): Promise<CampaignGuide | undefined> {
  const { allLogEntries, campaign, sideCampaign, encounterSets, errata } = await load(
    lang,
    id
  );

  const logEntries = find(allLogEntries, (log) => log.campaignId === id);
  const sideLogEntries = find(
    allLogEntries,
    (log) => log.campaignId === 'side'
  );

  if (!campaign || !logEntries || !sideCampaign || !sideLogEntries) {
    return undefined;
  }
  return new CampaignGuide(
    campaign,
    combineCampaignLog(logEntries, sideLogEntries),
    encounterSets,
    sideCampaign,
    errata
  );
}

export interface StandaloneScenarioInfo {
  type: 'standalone';
  id: StandaloneId;
  name: string;
  code: string;
  campaign: string;
  campaignPosition: number;
  specialGroup?: string;
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

function findStandaloneScenario(
  id: StandaloneScenarioId,
  allCampaigns: FullCampaign[],
  allLogEntries: CampaignLog[]
):
  | undefined
  | {
      logEntries: CampaignLog;
      campaign: FullCampaign;
      scenario: Scenario;
    } {
  const campaign = find(
    allCampaigns,
    (campaign) => campaign.campaign.id === id.campaignId
  );
  const logEntries = find(
    allLogEntries,
    (log) => log.campaignId === id.campaignId
  );
  const scenario =
    campaign &&
    find(campaign.scenarios, (scenario) => scenario.id === id.scenarioId);
  if (!campaign || !scenario || !logEntries) {
    return undefined;
  }
  return {
    campaign,
    scenario,
    logEntries,
  };
}

function findStandaloneCampaign(
  id: StandaloneCampaignId,
  allCampaigns: FullCampaign[],
  allLogEntries: CampaignLog[]
):
  | undefined
  | {
      logEntries: CampaignLog;
      campaign: FullCampaign;
    } {
  const campaign = find(
    allCampaigns,
    (campaign) => campaign.campaign.id === id.campaignId
  );
  const logEntries = find(
    allLogEntries,
    (log) => log.campaignId === id.campaignId
  );
  if (!campaign || !logEntries) {
    return undefined;
  }
  return {
    campaign,
    logEntries,
  };
}

export function useStandaloneScenarios(): StandaloneInfo[] | undefined {
  const { lang } = useContext(LanguageContext);
  const [scenarios, setScenarios] = useState<StandaloneInfo[]>();
  useEffect(() => {
    let canceled = false;
    (async() => {
      const scenarios = await getStandaloneScenarios(lang);
      if (!canceled) {
        setScenarios(scenarios);
      }
    })();
    return () => {
      canceled = true;
    };
  }, [lang, setScenarios]);
  return scenarios;
}

async function getStandaloneScenarios(lang: string): Promise<StandaloneInfo[]> {
  const { allLogEntries, allCampaigns } = await loadAll(lang);
  const standalones = await loadAsset('standalone_scenarios');
  return sortBy(
    flatMap(standalones, (id: StandaloneScenarioId | StandaloneCampaignId) => {
      switch (id.type) {
        case 'scenario': {
          const data = findStandaloneScenario(id, allCampaigns, allLogEntries);
          if (!data) {
            console.log(`Could not find ${JSON.stringify(id)}`);
            return [];
          }
          let specialGroup = undefined;
          if (data.campaign.campaign.id === 'side') {
            if (data.scenario.custom) {
              specialGroup = 'custom_side';
            } else if (data.scenario.challenge) {
              specialGroup = 'challenge';
            }
          }
          return {
            type: 'standalone',
            id: { campaignId: id.campaignId, scenarioId: id.scenarioId },
            name: data.scenario.scenario_name,
            code: data.scenario.id,
            campaign: data.campaign.campaign.id,
            campaignPosition: data.campaign.campaign.position,
            specialGroup,
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
            id: id.campaignId as CampaignCycleCode,
            name: data.campaign.campaign.name,
            code: data.campaign.campaign.id,
            campaign: 'side',
            campaignPosition: 0,
          };
        }
      }
    }),
    (scenario) => scenario.name
  );
}

export default {
  getCampaignGuide,
};
