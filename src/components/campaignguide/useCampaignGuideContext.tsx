import { useDispatch } from 'react-redux';
import { useCallback, useContext, useMemo } from 'react';
import { flatMap, forEach, concat, keys, uniq, omit } from 'lodash';
import deepDiff from 'deep-diff';

import { CampaignGuideReduxData } from './contextHelper';
import campaignActions, { updateCampaignChaosBag, updateCampaignDifficulty, updateCampaignGuideVersion, updateCampaignInvestigatorData, updateCampaignScenarioResults } from '@components/campaign/actions';
import guideActions from '@components/campaignguide/actions';
import {
  Deck,
  NumberChoices,
  StringChoices,
  SupplyCounts,
  GuideStartSideScenarioInput,
  GuideStartCustomSideScenarioInput,
  InvestigatorTraumaData,
  getDeckId,
  DeckId,
  CampaignId,
} from '@actions/types';
import Card from '@data/types/Card';
import useChooseDeck from './useChooseDeck';
import { useInvestigatorCards, usePlayerCards } from '@components/core/hooks';
import CampaignStateHelper from '@data/scenario/CampaignStateHelper';
import { CampaignGuideContextType } from './CampaignGuideContext';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { UpdateCampaignActions, useGuideActions } from '@data/remote/campaigns';
import { CreateDeckActions } from '@data/remote/decks';
import { ProcessedCampaign } from '@data/scenario';

const EMPTY_SPENT_XP = {};
export default function useCampaignGuideContext(
  campaignId: CampaignId,
  createDeckActions: CreateDeckActions,
  updateCampaignActions: UpdateCampaignActions,
  campaignData?: CampaignGuideReduxData
): CampaignGuideContextType | undefined {
  const { user } = useContext(ArkhamCardsAuthContext);
  const campaignInvestigators = campaignData?.campaignInvestigators;
  const dispatch = useDispatch();
  const investigators = useInvestigatorCards();
  const cards = usePlayerCards();
  const campaignChooseDeck = useChooseDeck(createDeckActions, updateCampaignActions);
  const showChooseDeck = useCallback((singleInvestigator?: Card, callback?: (code: string) => void) => {
    if (campaignInvestigators !== undefined) {
      campaignChooseDeck(campaignId, campaignInvestigators, singleInvestigator, callback);
    }
  }, [campaignId, campaignChooseDeck, campaignInvestigators]);
  const remoteGuideActions = useGuideActions();
  const setBinaryAchievement = useCallback((achievementId: string, value: boolean) => {
    dispatch(guideActions.setBinaryAchievement(user, remoteGuideActions, campaignId, achievementId, value));
  }, [dispatch, user, remoteGuideActions, campaignId]);

  const incCountAchievement = useCallback((achievementId: string, max?: number) => {
    dispatch(guideActions.incCountAchievement(user, remoteGuideActions, campaignId, achievementId, max));
  }, [dispatch, user, remoteGuideActions, campaignId]);

  const decCountAchievement = useCallback((achievementId: string) => {
    dispatch(guideActions.decCountAchievement(user, remoteGuideActions, campaignId, achievementId));
  }, [dispatch, user, remoteGuideActions, campaignId]);

  const removeDeck = useCallback((
    deck: Deck
  ) => {
    dispatch(campaignActions.removeInvestigator(user, updateCampaignActions, campaignId, deck.investigator_code, getDeckId(deck)));
  }, [dispatch, campaignId, user, updateCampaignActions]);

  const removeInvestigator = useCallback((investigator: Card) => {
    dispatch(campaignActions.removeInvestigator(user, updateCampaignActions, campaignId, investigator.code));
  }, [dispatch, campaignId, user, updateCampaignActions]);

  const startScenario = useCallback((scenarioId: string) => {
    dispatch(guideActions.startScenario(user, remoteGuideActions, campaignId, scenarioId));
  }, [dispatch, campaignId, remoteGuideActions, user]);

  const startSideScenario = useCallback((scenario: GuideStartSideScenarioInput | GuideStartCustomSideScenarioInput) => {
    dispatch(guideActions.startSideScenario(user, remoteGuideActions, campaignId, scenario));
  }, [dispatch, campaignId, remoteGuideActions, user]);

  const setDecision = useCallback((stepId: string, value: boolean, scenarioId?: string) => {
    dispatch(guideActions.setScenarioDecision(
      user,
      remoteGuideActions,
      campaignId,
      stepId,
      value,
      scenarioId
    ));
  }, [dispatch, campaignId, remoteGuideActions, user]);

  const setCount = useCallback((stepId: string, value: number, scenarioId?: string) => {
    dispatch(guideActions.setScenarioCount(
      user,
      remoteGuideActions,
      campaignId,
      stepId,
      value,
      scenarioId
    ));
  }, [dispatch, campaignId, remoteGuideActions, user]);

  const setText = useCallback((stepId: string, value: string, scenarioId?: string) => {
    dispatch(guideActions.setScenarioText(
      user,
      remoteGuideActions,
      campaignId,
      stepId,
      value,
      scenarioId
    ));
  }, [dispatch, campaignId, remoteGuideActions, user]);

  const setSupplies = useCallback((stepId: string, supplyCounts: SupplyCounts, scenarioId?: string) => {
    dispatch(guideActions.setScenarioSupplies(
      user,
      remoteGuideActions,
      campaignId,
      stepId,
      supplyCounts,
      scenarioId
    ));
  }, [dispatch, campaignId, remoteGuideActions, user]);

  const setStringChoices = useCallback((stepId: string, choices: StringChoices, scenarioId?: string) => {
    dispatch(guideActions.setScenarioStringChoices(
      user,
      remoteGuideActions,
      campaignId,
      stepId,
      choices,
      scenarioId
    ));
  }, [dispatch, campaignId, remoteGuideActions, user]);

  const setCampaignLink = useCallback((stepId: string, value: string, scenarioId?: string) => {
    dispatch(guideActions.setCampaignLink(
      user,
      remoteGuideActions,
      campaignId,
      stepId,
      value,
      scenarioId
    ));
  }, [dispatch, campaignId, remoteGuideActions, user]);

  const setNumberChoices = useCallback((stepId: string, choices: NumberChoices, deckId?: DeckId, scenarioId?: string) => {
    dispatch(guideActions.setScenarioNumberChoices(
      user,
      remoteGuideActions,
      campaignId,
      stepId,
      choices,
      deckId,
      scenarioId
    ));
  }, [dispatch, campaignId, remoteGuideActions, user]);

  const setChoice = useCallback((stepId: string, choice: number, scenarioId?: string) => {
    dispatch(guideActions.setScenarioChoice(
      user,
      remoteGuideActions,
      campaignId,
      stepId,
      choice,
      scenarioId
    ));
  }, [dispatch, campaignId, remoteGuideActions, user]);

  const setInterScenarioData = useCallback((investigatorData: InvestigatorTraumaData, scenarioId?: string) => {
    dispatch(guideActions.setInterScenarioData(
      user,
      remoteGuideActions,
      campaignId,
      investigatorData,
      scenarioId
    ));
  }, [dispatch, campaignId, remoteGuideActions, user]);

  const undo = useCallback((scenarioId: string) => {
    dispatch(guideActions.undo(user, campaignId, scenarioId));
  }, [dispatch, campaignId, user]);

  const resetScenario = useCallback((scenarioId: string) => {
    dispatch(guideActions.resetScenario(user, campaignId, scenarioId));
  }, [dispatch, user, campaignId]);
  const latestDecks = campaignData?.campaign?.latestDecks();
  const decksByInvestigator = useMemo(() => {
    const decksByInvestigator: {
      [code: string]: Deck | undefined;
    } = {};
    forEach(latestDecks, deck => {
      if (deck && deck.investigator) {
        decksByInvestigator[deck.investigator] = deck.deck;
      }
    });
    return decksByInvestigator;
  }, [latestDecks]);

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
  const campaignStateHelper = useMemo(() => {
    if (!investigators || !campaignData) {
      return undefined;
    }
    const guideVersion = campaignData.campaign.guideVersion;
    return new CampaignStateHelper(
      campaignData.campaignState,
      investigators,
      actions,
      guideVersion === undefined ? -1 : guideVersion,
      campaignData.linkedCampaignState
    );
  }, [campaignData, investigators, actions]);
  const campaign = campaignData?.campaign;
  const campaignGuide = campaignData?.campaignGuide;
  const spentXp = useMemo(() => {
    if (!campaign) {
      return EMPTY_SPENT_XP;
    }
    const result: { [code: string]: number | undefined } = {};
    forEach(campaign.investigators, i => {
      result[i] = campaign.investigatorSpentXp(i);
    });
    return result;
  }, [campaign]);

  const syncCampaignChanges = useCallback(async({ campaignLog, scenarios }: ProcessedCampaign): Promise<void> => {
    if (!campaign || !campaignGuide) {
      return;
    }
    if (campaign.guideVersion === -1) {
      console.log('Updating guide version');
      dispatch(updateCampaignGuideVersion(updateCampaignActions, campaignId, campaignGuide.campaignVersion()));
    }
    // tslint:disable-next-line: strict-comparisons
    if (campaign.difficulty !== campaignLog.campaignData.difficulty) {
      console.log('Updating difficulty');
      dispatch(updateCampaignDifficulty(updateCampaignActions, campaignId, campaignLog.campaignData.difficulty));
    }
    forEach(
      uniq(concat(keys(campaign.investigatorData), keys(campaignLog.campaignData.investigatorData))),
      investigator => {
        const newData = campaignLog.campaignData.investigatorData[investigator] || {};
        if (deepDiff(omit(campaign.investigatorData[investigator] || {}, ['spentXp']), newData)?.length) {
          console.log(`Updating investigator(${investigator}) data.`);
          dispatch(updateCampaignInvestigatorData(user, updateCampaignActions, campaignId, investigator, newData));
        }
      }
    )

    if (deepDiff(campaign.chaosBag, campaignLog.chaosBag)?.length) {
      console.log('Updating chaos bag');
      dispatch(updateCampaignChaosBag(updateCampaignActions.setChaosBag, campaignId, campaignLog.chaosBag));
    }
    const scenarioResults = flatMap(scenarios, scenario => {
      if (scenario.type !== 'completed') {
        return [];
      }
      const scenarioType = scenario.scenarioGuide.scenarioType();
      return {
        scenario: scenario.scenarioGuide.scenarioName(),
        scenarioCode: scenario.scenarioGuide.scenarioId(),
        resolution: campaignLog.scenarioResolution(scenario.scenarioGuide.scenarioId()) || '',
        interlude: scenarioType === 'interlude' || scenarioType === 'epilogue',
      };
    });
    if (deepDiff(campaign.scenarioResults, scenarioResults)?.length) {
      console.log('Updating scenario results');
      dispatch(updateCampaignScenarioResults(updateCampaignActions, campaignId, scenarioResults));
    }
  }, [user, campaign, campaignGuide, campaignId, dispatch, updateCampaignActions]);
  return useMemo(() => {
    if (!campaign || !campaignGuide || !campaignStateHelper || !cards || !campaignInvestigators) {
      return undefined;
    }
    return {
      campaignId,
      campaignName: campaign.name,
      campaignGuideVersion: campaign.guideVersion,
      campaignGuide: campaignGuide,
      campaignState: campaignStateHelper,
      campaignInvestigators,
      spentXp,
      latestDecks: decksByInvestigator,
      weaknessSet: campaign.weaknessSet,
      playerCards: cards,
      lastUpdated: campaign.updatedAt,
      syncCampaignChanges,
    };
  }, [campaignId, syncCampaignChanges,
    spentXp, campaign, campaignGuide, campaignStateHelper, campaignInvestigators, decksByInvestigator, cards]);
}