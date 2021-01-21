import { forEach, map, omit } from 'lodash';
import { ThunkAction } from 'redux-thunk';

import {
  NEW_CAMPAIGN,
  NEW_LINKED_CAMPAIGN,
  DELETE_CAMPAIGN,
  UPDATE_CAMPAIGN,
  UPDATE_CHAOS_BAG_RESULTS,
  ADD_CAMPAIGN_SCENARIO_RESULT,
  EDIT_CAMPAIGN_SCENARIO_RESULT,
  CAMPAIGN_ADD_INVESTIGATOR,
  CAMPAIGN_REMOVE_INVESTIGATOR,
  UPDATE_CAMPAIGN_SPENT_XP,
  CLEAN_BROKEN_CAMPAIGNS,
  RESTORE_COMPLEX_BACKUP,
  CleanBrokenCampaignsAction,
  CampaignAddInvestigatorAction,
  CampaignRemoveInvestigatorAction,
  Campaign,
  Deck,
  CampaignNotes,
  CampaignGuideState,
  CampaignCycleCode,
  CampaignDifficulty,
  ChaosBagResults,
  CustomCampaignLog,
  ScenarioResult,
  WeaknessSet,
  AddCampaignScenarioResultAction,
  EditCampaignScenarioResultAction,
  RestoreComplexBackupAction,
  NewCampaignAction,
  NewLinkedCampaignAction,
  UpdateCampaignAction,
  UpdateCampaignSpentXpAction,
  UpdateChaosBagResultsAction,
  DeleteCampaignAction,
  AdjustBlessCurseAction,
  ADJUST_BLESS_CURSE,
  StandaloneId,
  NewStandaloneCampaignAction,
  NEW_STANDALONE,
  CampaignId,
  DeckId,
  getDeckId,
  RemoveUploadDeckAction,
  REMOVE_UPLOAD_DECK,
} from '@actions/types';
import { ChaosBag } from '@app_constants';
import { AppState, makeCampaignSelector, getDeck, makeDeckSelector } from '@reducers';

function getBaseDeckIds(
  state: AppState,
  deckIds: DeckId[]
): DeckId[] {
  const decks = state.decks.all || {};
  return map(deckIds, deckId => {
    let deck = getDeck(decks, deckId);
    while (deck && deck.previousDeckId) {
      const previousDeck = getDeck(decks, deck.previousDeckId);
      if (!previousDeck) {
        break;
      }
      deck = previousDeck;
    }
    return deck ? getDeckId(deck) : deckId;
  });
}

export function restoreComplexBackup(
  campaigns: Campaign[],
  guides: CampaignGuideState[],
  decks: Deck[],
): RestoreComplexBackupAction {
  return {
    type: RESTORE_COMPLEX_BACKUP,
    campaigns,
    guides,
    decks,
  };
}

export function cleanBrokenCampaigns(): CleanBrokenCampaignsAction {
  return {
    type: CLEAN_BROKEN_CAMPAIGNS,
  };
}

export function addInvestigator(
  { campaignId, serverId }: CampaignId,
  investigator: string,
  deckId?: DeckId
): ThunkAction<void, AppState, null, CampaignAddInvestigatorAction> {
  return (dispatch, getState: () => AppState) => {
    const baseDeckId = deckId ?
      getBaseDeckIds(getState(), [deckId])[0] :
      undefined;
    const action: CampaignAddInvestigatorAction = {
      type: CAMPAIGN_ADD_INVESTIGATOR,
      id: campaignId,
      investigator,
      deckId: baseDeckId,
      now: new Date(),
    };
    dispatch(action);
  };
}

export function removeInvestigator(
  { campaignId, serverId }: CampaignId,
  investigator: string,
  deckId?: DeckId
): ThunkAction<void, AppState, null, CampaignRemoveInvestigatorAction> {
  return (dispatch, getState: () => AppState) => {
    const baseDeckId = deckId ?
      getBaseDeckIds(getState(), [deckId])[0] :
      undefined;
    const action: CampaignRemoveInvestigatorAction = {
      type: CAMPAIGN_REMOVE_INVESTIGATOR,
      id: campaignId,
      investigator,
      removeDeckId: baseDeckId,
      now: new Date(),
    };
    dispatch(action);
  };
}

export function newLinkedCampaign(
  name: string,
  cycleCode: CampaignCycleCode,
  cycleCodeA: CampaignCycleCode,
  cycleCodeB: CampaignCycleCode,
  weaknessSet: WeaknessSet
): NewLinkedCampaignAction {
  return {
    type: NEW_LINKED_CAMPAIGN,
    name,
    cycleCode,
    cycleCodeA,
    cycleCodeB,
    weaknessSet,
    guided: true,
    now: new Date(),
  };
}

export function newStandalone(
  name: string,
  standaloneId: StandaloneId,
  deckIds: DeckId[],
  investigatorIds: string[],
  weaknessSet: WeaknessSet
): ThunkAction<void, AppState, null, NewStandaloneCampaignAction> {
  return (dispatch, getState: () => AppState) => {
    const action: NewStandaloneCampaignAction = {
      type: NEW_STANDALONE,
      name: name,
      standaloneId,
      weaknessSet,
      deckIds: getBaseDeckIds(getState(), deckIds),
      investigatorIds,
      now: new Date(),
    };
    dispatch(action);
  };
}

export function newCampaign(
  name: string,
  pack_code: CampaignCycleCode,
  difficulty: CampaignDifficulty | undefined,
  deckIds: DeckId[],
  investigatorIds: string[],
  chaosBag: ChaosBag,
  campaignLog: CustomCampaignLog,
  weaknessSet: WeaknessSet,
  guided: boolean
): ThunkAction<void, AppState, null, NewCampaignAction> {
  return (dispatch, getState: () => AppState) => {
    const action: NewCampaignAction = {
      type: NEW_CAMPAIGN,
      name: name,
      cycleCode: pack_code,
      difficulty,
      chaosBag,
      campaignLog,
      weaknessSet,
      deckIds: getBaseDeckIds(getState(), deckIds),
      investigatorIds,
      guided,
      now: new Date(),
    };
    dispatch(action);
  };
}

export function updateCampaignSpentXp(
  id: string,
  investigator: string,
  operation: 'inc' | 'dec'
): UpdateCampaignSpentXpAction {
  return {
    type: UPDATE_CAMPAIGN_SPENT_XP,
    id,
    investigator,
    operation,
    now: new Date(),
  };
}

/**
 * Pass only the fields that you want to update.
 * {
 *   chaosBag,
 *   campaignNotes,
 *   investigatorData,
 *   latestDeckIds,
 *   weaknessSet,
 * }
 */
export function updateCampaign(
  { campaignId, serverId }: CampaignId,
  sparseCampaign: Partial<Campaign & {
    latestDeckIds?: DeckId[];
  }>,
  now?: Date
): ThunkAction<void, AppState, null, UpdateCampaignAction> {
  return (dispatch, getState: () => AppState) => {
    const campaign: Partial<Campaign> = omit(sparseCampaign, 'latestDeckIds');
    if (sparseCampaign.latestDeckIds) {
      campaign.deckIds = getBaseDeckIds(getState(), sparseCampaign.latestDeckIds);
    }
    dispatch({
      type: UPDATE_CAMPAIGN,
      id: campaignId,
      campaign,
      now: (now || new Date()),
    });
  };
}

export function updateChaosBagResults(
  id: string,
  chaosBagResults: ChaosBagResults
): ThunkAction<void, AppState, null, UpdateChaosBagResultsAction> {
  return (dispatch) => {
    dispatch({
      type: UPDATE_CHAOS_BAG_RESULTS,
      id,
      chaosBagResults,
      now: new Date(),
    });
  };
}

export function adjustBlessCurseChaosBagResults(
  id: string,
  type: 'bless' | 'curse',
  direction: 'inc' | 'dec'
): ThunkAction<void, AppState, null, AdjustBlessCurseAction> {
  return (dispatch) => {
    dispatch({
      type: ADJUST_BLESS_CURSE,
      id,
      bless: type === 'bless',
      direction,
      now: new Date(),
    });
  };
}

export function removeLocalCampaign(campaign: Campaign): ThunkAction<void, AppState, null, DeleteCampaignAction | RemoveUploadDeckAction> {
  return (dispatch, getState) => {
    if (campaign.serverId) {
      // Delink all of the decks.
      const state = getState();
      const getDeck = makeDeckSelector();
      forEach(campaign.deckIds || [], deckId => {
        let deck = getDeck(state, deckId);
        while (deck) {
          dispatch({
            type: REMOVE_UPLOAD_DECK,
            deckId: getDeckId(deck),
            campaignId: {
              campaignId: campaign.uuid,
              serverId: campaign.serverId,
            },
          });
          if (!deck.nextDeckId) {
            break;
          }
          deck = getDeck(state, deck.nextDeckId);
        }
      });
    }
    dispatch({
      type: DELETE_CAMPAIGN,
      id: campaign.uuid,
    });
  };
}

export function deleteCampaign(
  { campaignId, serverId }: CampaignId
): ThunkAction<void, AppState, null, DeleteCampaignAction | RemoveUploadDeckAction> {
  return (dispatch, getState: () => AppState) => {
    const state = getState();
    const getCampaign = makeCampaignSelector();
    const campaign = getCampaign(getState(), campaignId);
    if (campaign) {
      if (campaign.linkUuid) {
        const campaignA = getCampaign(state, campaign.linkUuid.campaignIdA);
        if (campaignA) {
          dispatch(removeLocalCampaign(campaignA));
        }
        const campaignB = getCampaign(state, campaign.linkUuid.campaignIdB);
        if (campaignB) {
          dispatch(removeLocalCampaign(campaignB));
        }
      }
      dispatch(removeLocalCampaign(campaign));
    }
  };
}

export function addScenarioResult(
  id: string,
  scenarioResult: ScenarioResult,
  campaignNotes?: CampaignNotes
): AddCampaignScenarioResultAction {
  return {
    type: ADD_CAMPAIGN_SCENARIO_RESULT,
    id,
    scenarioResult,
    campaignNotes,
    now: new Date(),
  };
}

export function editScenarioResult(
  id: string,
  index: number,
  scenarioResult: ScenarioResult
): EditCampaignScenarioResultAction {
  return {
    type: EDIT_CAMPAIGN_SCENARIO_RESULT,
    id,
    index,
    scenarioResult,
    now: new Date(),
  };
}

export default {
  newCampaign,
  updateCampaign,
  deleteCampaign,
  addScenarioResult,
  addInvestigator,
  removeInvestigator,
};
