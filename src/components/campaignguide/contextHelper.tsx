import { flatMap, forEach } from 'lodash';
import {
  Deck,
  InvestigatorData,
  NumberChoices,
  StringChoices,
  SupplyCounts,
  SingleCampaign,
  CampaignGuideState,
  GuideStartSideScenarioInput,
  GuideStartCustomSideScenarioInput,
  InvestigatorTraumaData,
  DecksMap,
} from '@actions/types';
import { createSelector } from 'reselect';
import { UniversalCampaignProps } from './withUniversalCampaignData';
import { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';
import CampaignGuide from '@data/scenario/CampaignGuide';
import CampaignStateHelper from '@data/scenario/CampaignStateHelper';
import Card, { CardsMap } from '@data/Card';
import { getCampaignGuide } from '@data/scenario';
import {
  AppState,
  getCampaign,
  getCampaignGuideState,
  getLatestCampaignInvestigators,
  getAllDecks,
  getLatestCampaignDeckIds,
  getLangPreference,
} from '@reducers';
import { StyleContextType } from '@styles/StyleContext';

export interface CampaignGuideReduxData {
  campaign: SingleCampaign;
  campaignGuide: CampaignGuide;
  campaignState: CampaignGuideState;
  linkedCampaignState?: CampaignGuideState;
  campaignInvestigators: Card[];
  latestDecks: Deck[];
}

const EMPTY_INVESTIGATOR_DATA: InvestigatorData = {};

const campaignGuideCycleCode = (campaign: SingleCampaign, state: AppState) => campaign.cycleCode;
const campaignGuideLangPreference = (campaign: SingleCampaign, state: AppState) => getLangPreference(state);
const selectCampaignGuide = createSelector(campaignGuideCycleCode, campaignGuideLangPreference, getCampaignGuide);

const latestCampaignDecksDecks = (campaign: SingleCampaign, state: AppState) => getAllDecks(state);
const latestCampaignDecksDeckIds = (campaign: SingleCampaign, state: AppState) => getLatestCampaignDeckIds(state, campaign);
const selectLatestDecks = createSelector(
  latestCampaignDecksDecks,
  latestCampaignDecksDeckIds,
  (decks: DecksMap, latestDeckIds: number[]) => flatMap(latestDeckIds, deckId => decks[deckId])
);

const cgrdCampaign = (c: SingleCampaign, cg: CampaignGuide, cs: CampaignGuideState, lcs: CampaignGuideState | undefined, ld: Deck[], i: Card[]) => c;
const cgrdCampaignGuide = (c: SingleCampaign, cg: CampaignGuide, cs: CampaignGuideState, lcs: CampaignGuideState | undefined, ld: Deck[], i: Card[]) => cg;
const cgrdCampaignState = (c: SingleCampaign, cg: CampaignGuide, cs: CampaignGuideState, lcs: CampaignGuideState | undefined, ld: Deck[], i: Card[]) => cs;
const cgrdLinkedCampaignState = (c: SingleCampaign, cg: CampaignGuide, cs: CampaignGuideState, lcs: CampaignGuideState | undefined, ld: Deck[], i: Card[]) => lcs;
const cgrdLatestDecks = (c: SingleCampaign, cg: CampaignGuide, cs: CampaignGuideState, lcs: CampaignGuideState | undefined, ld: Deck[], i: Card[]) => ld;
const cgrdInvestigators = (c: SingleCampaign, cg: CampaignGuide, cs: CampaignGuideState, lcs: CampaignGuideState | undefined, ld: Deck[], i: Card[]) => i;

const selectCampaignGuideReduxData = createSelector(
  cgrdCampaign,
  cgrdCampaignGuide,
  cgrdCampaignState,
  cgrdLinkedCampaignState,
  cgrdLatestDecks,
  cgrdInvestigators,
  (campaign, campaignGuide, campaignState, linkedCampaignState, latestDecks, campaignInvestigators) => {
    return {
      campaign,
      campaignGuide,
      campaignState,
      linkedCampaignState,
      latestDecks,
      campaignInvestigators,
    };
  }
)

export function campaignGuideReduxData(
  campaignId: number,
  investigators: CardsMap,
  state: AppState
): CampaignGuideReduxData | undefined {
  const campaign = getCampaign(state, campaignId);
  if (!campaign) {
    return undefined;
  }
  const campaignGuide = selectCampaignGuide(campaign, state);
  if (!campaignGuide) {
    return undefined;
  }
  const campaignInvestigators = getLatestCampaignInvestigators(state, investigators, campaign);
  const campaignState = getCampaignGuideState(state, campaignId);
  const latestDecks = selectLatestDecks(campaign, state);
  const linkedCampaignState = campaign.linkedCampaignId ? getCampaignGuideState(state, campaign.linkedCampaignId) : undefined;

  return selectCampaignGuideReduxData(
    campaign,
    campaignGuide,
    campaignState,
    linkedCampaignState,
    latestDecks,
    campaignInvestigators
  );
}

const campaignGuideContextReduxData = (
  reduxData: CampaignGuideReduxData,
  universalData: UniversalCampaignProps,
  styleContext: StyleContextType
) => reduxData;
const campaignGuideContextUniversalData = (
  reduxData: CampaignGuideReduxData,
  universalData: UniversalCampaignProps,
  styleContext: StyleContextType
) => universalData;
const campaignGuideStyleContext = (
  reduxData: CampaignGuideReduxData,
  universalData: UniversalCampaignProps,
  styleContext: StyleContextType
) => styleContext;
export const constructCampaignGuideContext = createSelector(
  campaignGuideContextReduxData,
  campaignGuideContextUniversalData,
  campaignGuideStyleContext,
  ({
    campaign,
    campaignState,
    campaignGuide,
    campaignInvestigators,
    latestDecks,
    linkedCampaignState,
  }: CampaignGuideReduxData,
  universalData: UniversalCampaignProps,
  style: StyleContextType
) => {
  const showChooseDeck = (
    singleInvestigator?: Card,
    callback?: (code: string) => void
  ) => {
    universalData.showChooseDeck(
      campaign.id,
      campaignInvestigators,
      singleInvestigator,
      callback
    );
  };

  const removeDeck = (
    deck: Deck
  ) => {
    universalData.removeInvestigator(
      campaign.id,
      deck.investigator_code,
      deck.id
    );
  };

  const removeInvestigator = (
    investigator: Card
  ) => {
    universalData.removeInvestigator(campaign.id, investigator.code);
  };

  const startScenario = (
    scenarioId: string
  ) => {
    universalData.startScenario(campaign.id, scenarioId);
  };

  const startSideScenario = (
    scenario: GuideStartSideScenarioInput | GuideStartCustomSideScenarioInput
  ) => {
    universalData.startSideScenario(campaign.id, scenario);
  };

  const setDecision = (
    stepId: string,
    value: boolean,
    scenarioId?: string
  ) => {
    universalData.setScenarioDecision(
      campaign.id,
      stepId,
      value,
      scenarioId
    );
  };

  const setCount = (
    stepId: string,
    value: number,
    scenarioId?: string
  ) => {
    universalData.setScenarioCount(
      campaign.id,
      stepId,
      value,
      scenarioId
    );
  };

  const setText = (
    stepId: string,
    value: string,
    scenarioId?: string
  ) => {
    universalData.setScenarioText(
      campaign.id,
      stepId,
      value,
      scenarioId
    );
  };

  const setSupplies = (
    stepId: string,
    supplyCounts: SupplyCounts,
    scenarioId?: string
  ) => {
    universalData.setScenarioSupplies(
      campaign.id,
      stepId,
      supplyCounts,
      scenarioId
    );
  };

  const setStringChoices = (
    stepId: string,
    choices: StringChoices,
    scenarioId?: string
  ) => {
    universalData.setScenarioStringChoices(
      campaign.id,
      stepId,
      choices,
      scenarioId
    );
  };

  const setCampaignLink = (
    stepId: string,
    value: string,
    scenarioId?: string
  ) => {
    universalData.setCampaignLink(
      campaign.id,
      stepId,
      value,
      scenarioId
    );
  };

  const setNumberChoices = (
    stepId: string,
    choices: NumberChoices,
    scenarioId?: string
  ) => {
    universalData.setScenarioNumberChoices(
      campaign.id,
      stepId,
      choices,
      scenarioId
    );
  };

  const setChoice = (
    stepId: string,
    choice: number,
    scenarioId?: string
  ) => {
    universalData.setScenarioChoice(
      campaign.id,
      stepId,
      choice,
      scenarioId
    );
  };

  const setInterScenarioData = (
    investigatorData: InvestigatorTraumaData,
    scenarioId?: string,
  ) => {
    universalData.setInterScenarioData(
      campaign.id,
      investigatorData,
      scenarioId
    );
  };

  const undo = (scenarioId: string) => {
    universalData.undo(campaign.id, scenarioId);
  };

  const resetScenario = (scenarioId: string) => {
    universalData.resetScenario(campaign.id, scenarioId);
  };

  const decksByInvestigator: {
    [code: string]: Deck | undefined;
  } = {};
  forEach(latestDecks, deck => {
    if (deck && deck.investigator_code) {
      decksByInvestigator[deck.investigator_code] = deck;
    }
  });
  const campaignStateHelper = new CampaignStateHelper(
    campaignState,
    universalData.investigators,
    {
      showChooseDeck,
      removeDeck,
      removeInvestigator,
      startScenario,
      startSideScenario,
      setCount,
      setDecision,
      setSupplies,
      setNumberChoices,
      setStringChoices,
      setChoice,
      setCampaignLink,
      setText,
      resetScenario,
      setInterScenarioData,
      undo,
    },
    campaign.guideVersion === undefined ? -1 : campaign.guideVersion,
    linkedCampaignState
  );
  const lastUpdated = (typeof campaign.lastUpdated === 'string') ? new Date(Date.parse(campaign.lastUpdated)) : campaign.lastUpdated;
  const result: CampaignGuideContextType = {
    campaignId: campaign.id,
    campaignName: campaign.name,
    campaignGuideVersion: campaign.guideVersion === undefined ? -1 : campaign.guideVersion,
    campaignGuide,
    campaignState: campaignStateHelper,
    campaignInvestigators,
    latestDecks: decksByInvestigator,
    weaknessSet: campaign.weaknessSet,
    adjustedInvestigatorData: campaign.adjustedInvestigatorData || EMPTY_INVESTIGATOR_DATA,
    playerCards: universalData.cards,
    lastUpdated,
    style,
  };
  return result;
});
