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
} from '@actions/types';
import Card from '@data/Card';
import { useCallback, useMemo } from 'react';
import useChooseDeck from './useChooseDeck';
import { forEach } from 'lodash';
import { useInvestigatorCards, usePlayerCards } from '@components/core/hooks';
import CampaignStateHelper from '@data/scenario/CampaignStateHelper';
import { CampaignGuideContextType } from './CampaignGuideContext';

const EMPTY_INVESTIGATOR_DATA: InvestigatorData = {};

export default function useCampaignGuideContext(id: number, campaignData?: CampaignGuideReduxData): CampaignGuideContextType | undefined {
  const campaignInvestigators = campaignData?.campaignInvestigators;
  const dispatch = useDispatch();
  const investigators = useInvestigatorCards();
  const cards = usePlayerCards();
  const campaignChooseDeck = useChooseDeck();
  const serverId = campaignData?.campaign?.serverId;
  const campaignId = useMemo(() => {
    return {
      campaignId: id,
      serverId,
    };
  }, [id, serverId]);
  const showChooseDeck = useCallback((singleInvestigator?: Card, callback?: (code: string) => void) => {
    if (campaignInvestigators !== undefined) {
      campaignChooseDeck(campaignId, campaignInvestigators, singleInvestigator, callback);
    }
  }, [campaignId, campaignChooseDeck, campaignInvestigators]);

  const setBinaryAchievement = useCallback((achievementId: string, value: boolean) => {
    dispatch(guideActions.setBinaryAchievement(campaignId, achievementId, value));
  }, [dispatch, campaignId]);

  const incCountAchievement = useCallback((achievementId: string, max?: number) => {
    dispatch(guideActions.incCountAchievement(campaignId, achievementId, max));
  }, [dispatch, campaignId]);

  const decCountAchievement = useCallback((achievementId: string) => {
    dispatch(guideActions.decCountAchievement(campaignId, achievementId));
  }, [dispatch, campaignId]);

  const removeDeck = useCallback((
    deck: Deck
  ) => {
    dispatch(campaignActions.removeInvestigator(campaignId, deck.investigator_code, getDeckId(deck)));
  }, [dispatch, campaignId]);

  const removeInvestigator = useCallback((investigator: Card) => {
    dispatch(campaignActions.removeInvestigator(campaignId, investigator.code));
  }, [dispatch, campaignId]);

  const startScenario = useCallback((scenarioId: string) => {
    dispatch(guideActions.startScenario(campaignId, scenarioId));
  }, [dispatch, campaignId]);

  const startSideScenario = useCallback((scenario: GuideStartSideScenarioInput | GuideStartCustomSideScenarioInput) => {
    dispatch(guideActions.startSideScenario(campaignId, scenario));
  }, [dispatch, campaignId]);

  const setDecision = useCallback((stepId: string, value: boolean, scenarioId?: string) => {
    dispatch(guideActions.setScenarioDecision(
      campaignId,
      stepId,
      value,
      scenarioId
    ));
  }, [dispatch, campaignId]);

  const setCount = useCallback((stepId: string, value: number, scenarioId?: string) => {
    dispatch(guideActions.setScenarioCount(
      campaignId,
      stepId,
      value,
      scenarioId
    ));
  }, [dispatch, campaignId]);

  const setText = useCallback((stepId: string, value: string, scenarioId?: string) => {
    dispatch(guideActions.setScenarioText(
      campaignId,
      stepId,
      value,
      scenarioId
    ));
  }, [dispatch, campaignId]);

  const setSupplies = useCallback((stepId: string, supplyCounts: SupplyCounts, scenarioId?: string) => {
    dispatch(guideActions.setScenarioSupplies(
      campaignId,
      stepId,
      supplyCounts,
      scenarioId
    ));
  }, [dispatch, campaignId]);

  const setStringChoices = useCallback((stepId: string, choices: StringChoices, scenarioId?: string) => {
    dispatch(guideActions.setScenarioStringChoices(
      campaignId,
      stepId,
      choices,
      scenarioId
    ));
  }, [dispatch, campaignId]);

  const setCampaignLink = useCallback((stepId: string, value: string, scenarioId?: string) => {
    dispatch(guideActions.setCampaignLink(
      campaignId,
      stepId,
      value,
      scenarioId
    ));
  }, [dispatch, campaignId]);

  const setNumberChoices = useCallback((stepId: string, choices: NumberChoices, deckId?: DeckId, scenarioId?: string) => {
    dispatch(guideActions.setScenarioNumberChoices(
      campaignId,
      stepId,
      choices,
      deckId,
      scenarioId
    ));
  }, [dispatch, campaignId]);

  const setChoice = useCallback((stepId: string, choice: number, scenarioId?: string) => {
    dispatch(guideActions.setScenarioChoice(
      campaignId,
      stepId,
      choice,
      scenarioId
    ));
  }, [dispatch, campaignId]);

  const setInterScenarioData = useCallback((investigatorData: InvestigatorTraumaData, scenarioId?: string) => {
    dispatch(guideActions.setInterScenarioData(
      campaignId,
      investigatorData,
      scenarioId
    ));
  }, [dispatch, campaignId]);

  const undo = useCallback((scenarioId: string) => {
    dispatch(guideActions.undo(campaignId, scenarioId));
  }, [dispatch, campaignId]);

  const resetScenario = useCallback((scenarioId: string) => {
    dispatch(guideActions.resetScenario(campaignId, scenarioId));
  }, [dispatch, campaignId]);

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
      campaignId: campaignId,
      campaignName: campaignData.campaign.name,
      campaignGuideVersion: campaignData.campaign.guideVersion === undefined ? -1 : campaignData.campaign.guideVersion,
      campaignGuide: campaignData.campaignGuide,
      campaignState: campaignStateHelper,
      campaignInvestigators,
      latestDecks: decksByInvestigator,
      weaknessSet: campaignData.campaign.weaknessSet,
      adjustedInvestigatorData: campaignData.campaign.adjustedInvestigatorData || EMPTY_INVESTIGATOR_DATA,
      playerCards: cards,
      lastUpdated,
    };
  }, [campaignId, campaignData?.campaign, campaignData?.campaignGuide, campaignStateHelper, campaignInvestigators, decksByInvestigator, cards, lastUpdated]);
}