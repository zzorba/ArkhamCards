import { useDispatch } from 'react-redux';

import { CampaignGuideReduxData } from './contextHelper';
import campaignActions from '@components/campaign/actions';
import guideActions from '@components/campaignguide/actions';
import {
  Deck,
  NumberChoices,
  StringChoices,
  SupplyCounts,
  GuideStartSideScenarioInput,
  GuideStartCustomSideScenarioInput,
  InvestigatorTraumaData,
  InvestigatorData,
  getDeckId,
  DeckId,
  CampaignId,
  WeaknessSet,
} from '@actions/types';
import Card from '@data/types/Card';
import { useCallback, useContext, useMemo } from 'react';
import { forEach } from 'lodash';

import useChooseDeck from './useChooseDeck';
import { useInvestigatorCards, usePlayerCards } from '@components/core/hooks';
import CampaignStateHelper from '@data/scenario/CampaignStateHelper';
import { CampaignGuideContextType } from './CampaignGuideContext';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useRemoveInvestigatorDecks } from '@data/remote/campaigns';

const EMPTY_INVESTIGATOR_DATA: InvestigatorData = {};
const EMPTY_WEAKNESS_SET: WeaknessSet = { packCodes: [], assignedCards: {} };
export default function useCampaignGuideContext(campaignId: CampaignId, campaignData?: CampaignGuideReduxData): CampaignGuideContextType | undefined {
  const { user } = useContext(ArkhamCardsAuthContext);
  const campaignInvestigators = campaignData?.campaignInvestigators;
  const dispatch = useDispatch();
  const investigators = useInvestigatorCards();
  const cards = usePlayerCards();
  const campaignChooseDeck = useChooseDeck();
  const showChooseDeck = useCallback((singleInvestigator?: Card, callback?: (code: string) => void) => {
    if (campaignInvestigators !== undefined) {
      campaignChooseDeck(campaignId, campaignInvestigators, singleInvestigator, callback);
    }
  }, [campaignId, campaignChooseDeck, campaignInvestigators]);

  const setBinaryAchievement = useCallback((achievementId: string, value: boolean) => {
    dispatch(guideActions.setBinaryAchievement(user, campaignId, achievementId, value));
  }, [dispatch, user, campaignId]);

  const incCountAchievement = useCallback((achievementId: string, max?: number) => {
    dispatch(guideActions.incCountAchievement(user, campaignId, achievementId, max));
  }, [dispatch, user, campaignId]);

  const decCountAchievement = useCallback((achievementId: string) => {
    dispatch(guideActions.decCountAchievement(user, campaignId, achievementId));
  }, [dispatch, user, campaignId]);

  const removeInvestigatorDecks = useRemoveInvestigatorDecks();
  const removeDeck = useCallback((
    deck: Deck
  ) => {
    dispatch(campaignActions.removeInvestigator(user, removeInvestigatorDecks, campaignId, deck.investigator_code, getDeckId(deck)));
  }, [dispatch, campaignId, user, removeInvestigatorDecks]);

  const removeInvestigator = useCallback((investigator: Card) => {
    dispatch(campaignActions.removeInvestigator(user, removeInvestigatorDecks, campaignId, investigator.code));
  }, [dispatch, campaignId, user, removeInvestigatorDecks]);

  const startScenario = useCallback((scenarioId: string) => {
    dispatch(guideActions.startScenario(user, campaignId, scenarioId));
  }, [dispatch, campaignId, user]);

  const startSideScenario = useCallback((scenario: GuideStartSideScenarioInput | GuideStartCustomSideScenarioInput) => {
    dispatch(guideActions.startSideScenario(user, campaignId, scenario));
  }, [dispatch, campaignId, user]);

  const setDecision = useCallback((stepId: string, value: boolean, scenarioId?: string) => {
    dispatch(guideActions.setScenarioDecision(
      user,
      campaignId,
      stepId,
      value,
      scenarioId
    ));
  }, [dispatch, campaignId, user]);

  const setCount = useCallback((stepId: string, value: number, scenarioId?: string) => {
    dispatch(guideActions.setScenarioCount(
      user,
      campaignId,
      stepId,
      value,
      scenarioId
    ));
  }, [dispatch, campaignId, user]);

  const setText = useCallback((stepId: string, value: string, scenarioId?: string) => {
    dispatch(guideActions.setScenarioText(
      user,
      campaignId,
      stepId,
      value,
      scenarioId
    ));
  }, [dispatch, campaignId, user]);

  const setSupplies = useCallback((stepId: string, supplyCounts: SupplyCounts, scenarioId?: string) => {
    dispatch(guideActions.setScenarioSupplies(
      user,
      campaignId,
      stepId,
      supplyCounts,
      scenarioId
    ));
  }, [dispatch, campaignId, user]);

  const setStringChoices = useCallback((stepId: string, choices: StringChoices, scenarioId?: string) => {
    dispatch(guideActions.setScenarioStringChoices(
      user,
      campaignId,
      stepId,
      choices,
      scenarioId
    ));
  }, [dispatch, campaignId, user]);

  const setCampaignLink = useCallback((stepId: string, value: string, scenarioId?: string) => {
    dispatch(guideActions.setCampaignLink(
      user,
      campaignId,
      stepId,
      value,
      scenarioId
    ));
  }, [dispatch, campaignId, user]);

  const setNumberChoices = useCallback((stepId: string, choices: NumberChoices, deckId?: DeckId, scenarioId?: string) => {
    dispatch(guideActions.setScenarioNumberChoices(
      user,
      campaignId,
      stepId,
      choices,
      deckId,
      scenarioId
    ));
  }, [dispatch, campaignId, user]);

  const setChoice = useCallback((stepId: string, choice: number, scenarioId?: string) => {
    dispatch(guideActions.setScenarioChoice(
      user,
      campaignId,
      stepId,
      choice,
      scenarioId
    ));
  }, [dispatch, campaignId, user]);

  const setInterScenarioData = useCallback((investigatorData: InvestigatorTraumaData, scenarioId?: string) => {
    dispatch(guideActions.setInterScenarioData(
      user,
      campaignId,
      investigatorData,
      scenarioId
    ));
  }, [dispatch, campaignId, user]);

  const undo = useCallback((scenarioId: string) => {
    dispatch(guideActions.undo(user, campaignId, scenarioId));
  }, [dispatch, campaignId, user]);

  const resetScenario = useCallback((scenarioId: string) => {
    dispatch(guideActions.resetScenario(user, campaignId, scenarioId));
  }, [dispatch, user, campaignId]);

  const decksByInvestigator = useMemo(() => {
    const decksByInvestigator: {
      [code: string]: Deck | undefined;
    } = {};
    forEach(campaignData?.latestDecks || [], deck => {
      if (deck && deck.investigator_code) {
        decksByInvestigator[deck.investigator_code] = deck;
      }
    });
    return decksByInvestigator;
  }, [campaignData?.latestDecks]);

  const actions = useMemo(() => {
    return {
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
      setBinaryAchievement,
      incCountAchievement,
      decCountAchievement,
    };
  }, [showChooseDeck, removeDeck, removeInvestigator, startScenario, startSideScenario, setCount, setDecision, setSupplies,
    setNumberChoices, setStringChoices, setChoice, setCampaignLink, setText, resetScenario, setInterScenarioData, undo,
    setBinaryAchievement, incCountAchievement, decCountAchievement]);
  const campaignStateHelper = useMemo(() => investigators && campaignData ? new CampaignStateHelper(
    campaignData.campaignState,
    investigators,
    actions,
    campaignData.campaign.guideVersion === undefined ? -1 : campaignData.campaign.guideVersion,
    campaignData.linkedCampaignState
  ) : undefined, [campaignData, investigators, actions]);
  const lastUpdated = useMemo(() => {
    if (!campaignData?.campaign) {
      return undefined;
    }
    return (typeof campaignData.campaign.lastUpdated === 'string') ? new Date(Date.parse(campaignData.campaign.lastUpdated)) : campaignData.campaign.lastUpdated;
  }, [campaignData?.campaign]);
  return useMemo(() => {
    if (!campaignData?.campaign || !campaignData?.campaignGuide || !campaignStateHelper || !cards || !campaignInvestigators || !lastUpdated) {
      return undefined;
    }
    return {
      campaignId,
      campaignName: campaignData.campaign.name,
      campaignGuideVersion: campaignData.campaign.guideVersion === undefined ? -1 : campaignData.campaign.guideVersion,
      campaignGuide: campaignData.campaignGuide,
      campaignState: campaignStateHelper,
      campaignInvestigators,
      latestDecks: decksByInvestigator,
      weaknessSet: campaignData.campaign.weaknessSet || EMPTY_WEAKNESS_SET,
      adjustedInvestigatorData: campaignData.campaign.adjustedInvestigatorData || EMPTY_INVESTIGATOR_DATA,
      playerCards: cards,
      lastUpdated,
    };
  }, [campaignId, campaignData?.campaign, campaignData?.campaignGuide, campaignStateHelper, campaignInvestigators, decksByInvestigator, cards, lastUpdated]);
}