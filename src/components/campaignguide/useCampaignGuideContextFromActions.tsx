import { useDispatch } from 'react-redux';
import { useCallback, useContext, useMemo } from 'react';
import { flatMap, forEach, concat, keys, uniq } from 'lodash';
import deepEqual from 'deep-equal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

import { SingleCampaignGuideData } from './contextHelper';
import campaignActions, { updateCampaignChaosBag, updateCampaignDifficulty, updateCampaignGuideVersion, updateCampaignInvestigatorData, updateCampaignScenarioResults } from '@components/campaign/actions';
import guideActions from '@components/campaignguide/actions';
import {
  NumberChoices,
  StringChoices,
  SupplyCounts,
  GuideStartSideScenarioInput,
  GuideStartCustomSideScenarioInput,
  InvestigatorTraumaData,
  DeckId,
  CampaignId,
  DelayedDeckEdits,
} from '@actions/types';
import Card from '@data/types/Card';
import useChooseDeck from './useChooseDeck';
import { useInvestigatorCards, usePlayerCards } from '@components/core/hooks';
import CampaignStateHelper from '@data/scenario/CampaignStateHelper';
import { CampaignGuideContextType } from './CampaignGuideContext';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { UpdateCampaignActions, useGuideActions } from '@data/remote/campaigns';
import { DeckActions } from '@data/remote/decks';
import { ProcessedCampaign } from '@data/scenario';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import { AppState } from '@reducers';

const EMPTY_SPENT_XP = {};
type AsyncDispatch = ThunkDispatch<AppState, unknown, Action>;

export default function useCampaignGuideContextFromActions(
  campaignId: CampaignId,
  createDeckActions: DeckActions,
  updateCampaignActions: UpdateCampaignActions,
  campaignData?: SingleCampaignGuideData
): CampaignGuideContextType | undefined {
  const { userId } = useContext(ArkhamCardsAuthContext);
  const campaignInvestigators = campaignData?.campaignInvestigators;
  const dispatch: AsyncDispatch = useDispatch();
  const investigators = useInvestigatorCards();
  const cards = usePlayerCards();
  const campaignChooseDeck = useChooseDeck(createDeckActions, updateCampaignActions);
  const showChooseDeck = useCallback((singleInvestigator?: Card, callback?: (code: string) => Promise<void>) => {
    if (campaignInvestigators !== undefined) {
      campaignChooseDeck(campaignId, campaignInvestigators, singleInvestigator, callback);
    }
  }, [campaignId, campaignChooseDeck, campaignInvestigators]);
  const remoteGuideActions = useGuideActions();
  const setBinaryAchievement = useCallback((achievementId: string, value: boolean) => {
    dispatch(guideActions.setBinaryAchievement(userId, remoteGuideActions, campaignId, achievementId, value));
  }, [dispatch, userId, remoteGuideActions, campaignId]);

  const incCountAchievement = useCallback((achievementId: string, max?: number) => {
    dispatch(guideActions.incCountAchievement(userId, remoteGuideActions, campaignId, achievementId, max));
  }, [dispatch, userId, remoteGuideActions, campaignId]);

  const decCountAchievement = useCallback((achievementId: string) => {
    dispatch(guideActions.decCountAchievement(userId, remoteGuideActions, campaignId, achievementId));
  }, [dispatch, userId, remoteGuideActions, campaignId]);

  const removeDeck = useCallback((
    deckId: DeckId,
    investigator: string
  ) => {
    dispatch(campaignActions.removeInvestigator(userId, updateCampaignActions, campaignId, investigator, deckId));
  }, [dispatch, campaignId, userId, updateCampaignActions]);

  const removeInvestigator = useCallback((investigator: Card) => {
    dispatch(campaignActions.removeInvestigator(userId, updateCampaignActions, campaignId, investigator.code));
  }, [dispatch, campaignId, userId, updateCampaignActions]);

  const startScenario = useCallback((scenarioId: string) => {
    dispatch(guideActions.startScenario(userId, remoteGuideActions, campaignId, scenarioId));
  }, [dispatch, campaignId, remoteGuideActions, userId]);

  const startSideScenario = useCallback((scenario: GuideStartSideScenarioInput | GuideStartCustomSideScenarioInput) => {
    dispatch(guideActions.startSideScenario(userId, remoteGuideActions, campaignId, scenario));
  }, [dispatch, campaignId, remoteGuideActions, userId]);

  const setDecision = useCallback((stepId: string, value: boolean, scenarioId?: string) => {
    dispatch(guideActions.setScenarioDecision(
      userId,
      remoteGuideActions,
      campaignId,
      stepId,
      value,
      scenarioId
    ));
  }, [dispatch, campaignId, remoteGuideActions, userId]);

  const setCount = useCallback((stepId: string, value: number, scenarioId?: string) => {
    dispatch(guideActions.setScenarioCount(
      userId,
      remoteGuideActions,
      campaignId,
      stepId,
      value,
      scenarioId
    ));
  }, [dispatch, campaignId, remoteGuideActions, userId]);

  const setText = useCallback((stepId: string, value: string, scenarioId?: string) => {
    dispatch(guideActions.setScenarioText(
      userId,
      remoteGuideActions,
      campaignId,
      stepId,
      value,
      scenarioId
    ));
  }, [dispatch, campaignId, remoteGuideActions, userId]);

  const setSupplies = useCallback((stepId: string, supplyCounts: SupplyCounts, scenarioId?: string) => {
    dispatch(guideActions.setScenarioSupplies(
      userId,
      remoteGuideActions,
      campaignId,
      stepId,
      supplyCounts,
      scenarioId
    ));
  }, [dispatch, campaignId, remoteGuideActions, userId]);

  const setStringChoices = useCallback((stepId: string, choices: StringChoices, scenarioId?: string) => {
    dispatch(guideActions.setScenarioStringChoices(
      userId,
      remoteGuideActions,
      campaignId,
      stepId,
      choices,
      scenarioId
    ));
  }, [dispatch, campaignId, remoteGuideActions, userId]);

  const setCampaignLink = useCallback((stepId: string, value: string, scenarioId?: string) => {
    dispatch(guideActions.setCampaignLink(
      userId,
      remoteGuideActions,
      campaignId,
      stepId,
      value,
      scenarioId
    ));
  }, [dispatch, campaignId, remoteGuideActions, userId]);

  const setNumberChoices = useCallback(async(stepId: string, choices: NumberChoices, deckId?: DeckId, deckEdits?: DelayedDeckEdits, scenarioId?: string): Promise<void> => {
    return dispatch(guideActions.setScenarioNumberChoices(
      userId,
      remoteGuideActions,
      campaignId,
      stepId,
      choices,
      deckId,
      deckEdits,
      scenarioId
    ));
  }, [dispatch, campaignId, remoteGuideActions, userId]);

  const setChoice = useCallback((stepId: string, choice: number, scenarioId?: string) => {
    dispatch(guideActions.setScenarioChoice(
      userId,
      remoteGuideActions,
      campaignId,
      stepId,
      choice,
      scenarioId
    ));
  }, [dispatch, campaignId, remoteGuideActions, userId]);

  const setInterScenarioData = useCallback((investigatorData: InvestigatorTraumaData, scenarioId: undefined | string, campaignLogEntries?: string[]) => {
    dispatch(guideActions.setInterScenarioData(
      userId,
      remoteGuideActions,
      campaignId,
      investigatorData,
      scenarioId,
      campaignLogEntries,
    ));
  }, [dispatch, campaignId, remoteGuideActions, userId]);

  const campaignState = campaignData?.campaignState;
  const undo = useCallback((scenarioId: string) => {
    if (campaignState) {
      dispatch(guideActions.undo(
        userId,
        remoteGuideActions,
        campaignId,
        scenarioId,
        campaignState
      ));
    }
  }, [dispatch, campaignId, campaignState, userId, remoteGuideActions]);

  const resetScenario = useCallback((scenarioId: string) => {
    dispatch(guideActions.resetScenario(userId, campaignId, scenarioId));
  }, [dispatch, userId, campaignId]);
  const latestDecks = campaignData?.campaign?.latestDecks();
  const decksByInvestigator = useMemo(() => {
    const decksByInvestigator: {
      [code: string]: LatestDeckT | undefined;
    } = {};
    forEach(latestDecks, deck => {
      if (deck && deck.investigator) {
        decksByInvestigator[deck.investigator] = deck;
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
      dispatch(updateCampaignGuideVersion(updateCampaignActions, campaignId, campaignGuide.campaignVersion()));
    }
    // tslint:disable-next-line: strict-comparisons
    if (campaign.difficulty !== campaignLog.campaignData.difficulty) {
      dispatch(updateCampaignDifficulty(updateCampaignActions, campaignId, campaignLog.campaignData.difficulty));
    }
    forEach(
      uniq(concat(keys(campaign.investigatorData), keys(campaignLog.campaignData.investigatorData))),
      investigator => {
        const oldData = campaign.investigatorData[investigator] || {};
        const newData = campaignLog.campaignData.investigatorData[investigator] || {};
        const hasChanges =
          (!!oldData.killed !== !!newData.killed) ||
          (!!oldData.insane !== !!newData.insane) ||
          (oldData.mental || 0) !== (newData.mental || 0) ||
          (oldData.physical || 0) !== (newData.physical || 0) ||
          (oldData.availableXp || 0) !== (newData.availableXp || 0) ||
          !deepEqual(oldData.addedCards || [], newData.addedCards || []) ||
          !deepEqual(oldData.removedCards || [], newData.removedCards || []) ||
          !deepEqual(oldData.storyAssets || [], newData.storyAssets || []) ||
          !deepEqual(oldData.specialXp || {}, newData.specialXp || {}) ||
          !deepEqual(oldData.cardCounts || {}, newData.cardCounts || {}) ||
          !deepEqual(oldData.ignoreStoryAssets || [], newData.ignoreStoryAssets || []);
        if (hasChanges) {
          dispatch(updateCampaignInvestigatorData(userId, updateCampaignActions, campaignId, investigator, {
            killed: !!newData.killed,
            insane: !!newData.insane,
            mental: newData.mental || 0,
            physical: newData.physical || 0,
            availableXp: newData.availableXp || 0,
            addedCards: newData.addedCards || [],
            removedCards: newData.removedCards || [],
            storyAssets: newData.storyAssets || [],
            ignoreStoryAssets: newData.ignoreStoryAssets || [],
            cardCounts: newData.cardCounts || {},
            specialXp: newData.specialXp || {},
          }));
        }
      }
    )

    if (!deepEqual(campaign.chaosBag, campaignLog.chaosBag)) {
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
    if (!deepEqual(campaign.scenarioResults, scenarioResults)) {
      dispatch(updateCampaignScenarioResults(updateCampaignActions, campaignId, scenarioResults));
    }
  }, [userId, campaign, campaignGuide, campaignId, dispatch, updateCampaignActions]);
  return useMemo(() => {
    // console.log(`useCampaignGuideContextFromActions campaignId: ${JSON.stringify(campaignId)} campaign: ${!!campaign}, campaignGuide: ${!!campaignGuide}, campaignStateHelper: ${!!campaignStateHelper}, campaignInvestigators: ${!!campaignInvestigators}, cards: ${!!cards}`);
    if (!campaign || !campaignGuide || !campaignStateHelper || !cards || !campaignInvestigators) {
      return undefined;
    }
    return {
      campaignId,
      campaign,
      campaignGuideVersion: campaign.guideVersion,
      campaignGuide: campaignGuide,
      campaignState: campaignStateHelper,
      campaignInvestigators,
      spentXp,
      latestDecks: decksByInvestigator,
      weaknessSet: campaign.weaknessSet,
      playerCards: cards,
      syncCampaignChanges,
    };
  }, [campaignId, syncCampaignChanges,
    spentXp, campaign, campaignGuide, campaignStateHelper, campaignInvestigators, decksByInvestigator, cards]);
}