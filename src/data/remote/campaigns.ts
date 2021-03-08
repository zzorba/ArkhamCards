import { useCallback, useContext, useMemo } from 'react';
import { filter, omit } from 'lodash';
import { FetchResult, MutationFunctionOptions } from '@apollo/client';

import { CampaignDifficulty, CampaignNotes, GuideInput, ScenarioResult, Trauma, TraumaAndCardData, UploadedCampaignId, WeaknessSet } from '@actions/types';
import { useModifyUserCache } from '@data/apollo/cache';
import {
  UploadNewCampaignMutation, UploadNewCampaignMutationVariables, useUploadNewCampaignMutation,
  useDeleteInvestigatorDecksMutation,
  useIncCountAchievementMaxMutation,
  useIncCountAchievementMutation,
  useDecCountAchievementMutation,
  useSetBinaryAchievementMutation,
  useAddGuideInputMutation,
  useUpdateInvestigatorTraumaMutation,
  useUpdateWeaknessSetMutation,
  useUpdateCampaignNameMutation,
  useUpdateSpentXpMutation,
  useUpdateAvailableXpMutation,
  useAddCampaignInvestigatorMutation,
  useRemoveCampaignInvestigatorMutation,
  useUpdateChaosBagMutation,
  useUpdateCampaignNotesMutation,
  useUpdateCampaignShowInterludesMutation,
  useUpdateInvestigatorDataMutation,
  useUpdateCampaignScenarioResultsMutation,
  useUpdateCampaignDifficultyMutation,
  useUpdateCampaignGuideVersionMutation,
} from '@generated/graphql/apollo-schema';
import { CreateDeckActions, useCreateDeckActions } from './decks';
import { useFunction, ErrorResponse } from './api';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { ChaosBag } from '@app_constants';


interface CampaignLink {
  campaignIdA: string;
  campaignIdB: string;
}
interface CreateCampaignRequestData {
  campaignId: string;
  linked?: CampaignLink;
  guided?: boolean;
}

interface CampaignResponse extends ErrorResponse {
  campaignId: number;
}
function useCreateCampaignRequest(): (campaignId: string, guided: boolean) => Promise<UploadedCampaignId> {
  const apiCall = useFunction<CreateCampaignRequestData, CampaignResponse>('campaign-create');
  return useCallback(async(
    campaignId: string,
    guided: boolean
  ): Promise<UploadedCampaignId> => {
    const data = await apiCall({ campaignId, guided });
    if (data.error) {
      throw new Error(data.error);
    }
    return {
      campaignId,
      serverId: data.campaignId,
    };
  }, [apiCall]);
}

interface LinkCampaignResponse extends ErrorResponse {
  campaignId: number;
  campaignIdA: number;
  campaignIdB: number;
}
function useCreateLinkedCampaignRequest(): (
  campaignId: string,
  linked: CampaignLink,
  guided: boolean
) => Promise<{
  campaignId: UploadedCampaignId;
  campaignIdA: UploadedCampaignId;
  campaignIdB: UploadedCampaignId;
}> {
  const apiCall = useFunction<CreateCampaignRequestData, LinkCampaignResponse>('campaign-create');
  return useCallback(async(
    campaignId: string,
    linked: CampaignLink,
    guided: boolean
  ): Promise<{
    campaignId: UploadedCampaignId;
    campaignIdA: UploadedCampaignId;
    campaignIdB: UploadedCampaignId;
  }> => {
    const data = await apiCall({ campaignId, guided, linked });
    if (data.error) {
      throw new Error(data.error);
    }
    return {
      campaignId: {
        campaignId,
        serverId: data.campaignId,
      },
      campaignIdA: {
        campaignId: linked.campaignIdA,
        serverId: data.campaignIdA,
      },
      campaignIdB: {
        campaignId: linked.campaignIdB,
        serverId: data.campaignIdB,
      },
    };
  }, [apiCall]);
}

export type UploadNewCampaignFn = (
  options?: MutationFunctionOptions<UploadNewCampaignMutation, UploadNewCampaignMutationVariables>
) => Promise<FetchResult<UploadNewCampaignMutation>>;

export function useUploadNewCampaign(): UploadNewCampaignFn {
  const [uploadNewCampaign] = useUploadNewCampaignMutation();
  return uploadNewCampaign;
}

export interface CreateCampaignActions {
  createCampaign: (campaignId: string, guided: boolean) => Promise<UploadedCampaignId>;
  createLinkedCampaign: (
    campaignId: string,
    link: { campaignIdA: string; campaignIdB: string },
    guided: boolean
  ) => Promise<{
    campaignId: UploadedCampaignId;
    campaignIdA: UploadedCampaignId;
    campaignIdB: UploadedCampaignId;
  }>;
  uploadNewCampaign: UploadNewCampaignFn;

  createDeckActions: CreateDeckActions;
}

export function useCreateCampaignActions(): CreateCampaignActions {
  const createCampaign = useCreateCampaignRequest();
  const createLinkedCampaign = useCreateLinkedCampaignRequest();
  const uploadNewCampaign = useUploadNewCampaign();
  const createDeckActions = useCreateDeckActions();
  return useMemo(() => {
    return {
      createCampaign,
      createLinkedCampaign,
      uploadNewCampaign,
      createDeckActions,
    };
  }, [createCampaign, createLinkedCampaign, uploadNewCampaign, createDeckActions]);
}

interface DeleteCampaignRequest extends ErrorResponse {
  campaignId: string;
  serverId: number;
}
export function useDeleteCampaignRequest() {
  const [updateCache, client] = useModifyUserCache();
  const apiCall = useFunction<DeleteCampaignRequest, ErrorResponse>('campaign-delete');
  return useCallback(async({ campaignId, serverId }: UploadedCampaignId): Promise<void> => {
    const data = await apiCall({ campaignId, serverId });
    if (data.error) {
      throw new Error(data.error);
    }
    const targetCampaignId = client.cache.identify({ __typename: 'campaign', id: serverId });
    if (targetCampaignId) {
      updateCache({
        fields: {
          campaigns(current) {
            return filter(current, c => c.campaign?.__ref !== targetCampaignId);
          },
        },
      });
    }
  }, [apiCall, updateCache, client]);
}

export type SetCampaignChaosBagAction = (campaignId: UploadedCampaignId, chaosBag: ChaosBag) => Promise<void>;
export function useSetCampaignChaosBag(): SetCampaignChaosBagAction {
  const [updateChaosBag] = useUpdateChaosBagMutation();
  return useCallback(async(campaignId: UploadedCampaignId, chaosBag: ChaosBag) => {
    await updateChaosBag({
      variables: {
        campaign_id: campaignId.serverId,
        chaos_bag: chaosBag,
      },
    });
  }, [updateChaosBag]);
}

export type SetCampaignWeaknessSetAction = (campaignId: UploadedCampaignId, weaknessSet: WeaknessSet) => Promise<void>;
export function useSetCampaignWeaknessSet(): SetCampaignWeaknessSetAction {
  const [updateWeaknessSet] = useUpdateWeaknessSetMutation();
  return useCallback(async(campaignId: UploadedCampaignId, weaknessSet: WeaknessSet) => {
    await updateWeaknessSet({
      variables: {
        campaign_id: campaignId.serverId,
        weakness_set: weaknessSet,
      },
    });
  }, [updateWeaknessSet]);
}


export type SetCampaignNotesAction = (campaignId: UploadedCampaignId, campaignNotes: CampaignNotes) => Promise<void>;
export function useSetCampaignNotes(): SetCampaignNotesAction {
  const [updateCampaignNotes] = useUpdateCampaignNotesMutation();
  return useCallback(async(campaignId: UploadedCampaignId, campaignNotes: CampaignNotes) => {
    await updateCampaignNotes({
      variables: {
        campaign_id: campaignId.serverId,
        campaign_notes: campaignNotes,
      },
    });
  }, [updateCampaignNotes]);
}

export type SetCampaignShowInterludes = (campaignId: UploadedCampaignId, showInterludes: boolean) => Promise<void>;
export function useSetCampaignShowInterludes(): SetCampaignShowInterludes {
  const [updateShowInterlude] = useUpdateCampaignShowInterludesMutation();
  return useCallback(async(campaignId: UploadedCampaignId, showInterludes: boolean) => {
    await updateShowInterlude({
      variables: {
        campaign_id: campaignId.serverId,
        show_interludes: showInterludes,
      },
    });
  }, [updateShowInterlude]);
}

export interface UpdateCampaignActions {
  setScenarioResults: (campaignId: UploadedCampaignId, scenarioResults: ScenarioResult[]) => Promise<void>;
  setGuideVersion: (campaignId: UploadedCampaignId, guideVersion: number) => Promise<void>;
  setDifficulty: (campaignId: UploadedCampaignId, difficulty?: CampaignDifficulty) => Promise<void>
  setInvestigatorData: (campaignId: UploadedCampaignId, investigator: string, trauma: TraumaAndCardData) => Promise<void>;
  setInvestigatorTrauma: (campaignId: UploadedCampaignId, investigator: string, trauma: Trauma) => Promise<void>;
  setXp: (campaignId: UploadedCampaignId, investigator: string, type: 'spentXp' | 'availableXp', xp: number) => Promise<void>;
  setCampaigName: (campaignId: UploadedCampaignId, name: string) => Promise<void>;
  setWeaknessSet: SetCampaignWeaknessSetAction;
  setChaosBag: SetCampaignChaosBagAction;
  setCampaignNotes: SetCampaignNotesAction;
  addInvestigator: (campaignId: UploadedCampaignId, investigator: string) => Promise<void>;
  removeInvestigator: (campaignId: UploadedCampaignId, investigator: string) => Promise<void>;
  removeInvestigatorDeck: (campaignId: UploadedCampaignId, investigator: string) => Promise<void>;
}

export function useUpdateCampaignActions(): UpdateCampaignActions {
  const [updateInvestigatorTrauma] = useUpdateInvestigatorTraumaMutation();
  const [updateInvestigatorData] = useUpdateInvestigatorDataMutation();
  const [updateCampaignName] = useUpdateCampaignNameMutation();
  const [updateSpentXp] = useUpdateSpentXpMutation();
  const [updateAvailableXp] = useUpdateAvailableXpMutation();
  const [updateScenarioResults] = useUpdateCampaignScenarioResultsMutation();
  const [updateDifficulty] = useUpdateCampaignDifficultyMutation();
  const [updateGuideVersion] = useUpdateCampaignGuideVersionMutation();

  const { user } = useContext(ArkhamCardsAuthContext);
  const [insertInvestigator] = useAddCampaignInvestigatorMutation();
  const [deleteInvestigator] = useRemoveCampaignInvestigatorMutation();
  const [deleteInvestigatorDecks] = useDeleteInvestigatorDecksMutation();
  const setWeaknessSet = useSetCampaignWeaknessSet();
  const setChaosBag = useSetCampaignChaosBag();
  const setCampaignNotes = useSetCampaignNotes();

  const setDifficulty = useCallback(async(campaignId: UploadedCampaignId, difficulty?: CampaignDifficulty) => {
    await updateDifficulty({
      variables: {
        campaign_id: campaignId.serverId,
        difficulty,
      },
    });
  }, [updateDifficulty]);

  const setGuideVersion = useCallback(async(campaignId: UploadedCampaignId, guideVersion: number) => {
    await updateGuideVersion({
      variables: {
        campaign_id: campaignId.serverId,
        guideVersion,
      },
    });
  }, [updateGuideVersion]);

  const setScenarioResults = useCallback(async(campaignId: UploadedCampaignId, scenarioResults: ScenarioResult[]) => {
    await updateScenarioResults({
      variables: {
        campaign_id: campaignId.serverId,
        scenarioResults,
      },
    });
  }, [updateScenarioResults]);

  const addInvestigator = useCallback(async(campaignId: UploadedCampaignId, investigator: string) => {
    await insertInvestigator({
      variables: {
        campaign_id: campaignId.serverId,
        investigator,
      },
    });
  }, [insertInvestigator]);
  const removeInvestigator = useCallback(async(campaignId: UploadedCampaignId, investigator: string) => {
    await deleteInvestigator({
      variables: {
        campaign_id: campaignId.serverId,
        investigator,
      },
    });
  }, [deleteInvestigator]);
  const removeInvestigatorDeck = useCallback(async(campaignId: UploadedCampaignId, investigator: string) => {
    if (!user) {
      return;
    }
    await deleteInvestigatorDecks({
      variables: {
        user_id: user.uid,
        investigator,
        campaign_id: campaignId.serverId,
      },
    });
  }, [deleteInvestigatorDecks, user]);

  const setInvestigatorTrauma = useCallback(async(campaignId: UploadedCampaignId, investigator: string, trauma: Trauma) => {
    await updateInvestigatorTrauma({
      variables: {
        campaign_id: campaignId.serverId,
        investigator,
        killed: trauma.killed,
        insane: trauma.insane,
        physical: trauma.physical,
        mental: trauma.mental,
      },
    });
  }, [updateInvestigatorTrauma]);

  const setInvestigatorData = useCallback(async(campaignId: UploadedCampaignId, investigator: string, data: TraumaAndCardData) => {
    await updateInvestigatorData({
      variables: {
        campaign_id: campaignId.serverId,
        investigator,
        killed: data.killed,
        insane: data.insane,
        physical: data.physical,
        mental: data.mental,
        added_cards: data.addedCards || [],
        removed_cards: data.removedCards || [],
        ignore_story_assets: data.ignoreStoryAssets || [],
        story_assets: data.storyAssets || [],
        available_xp: data.availableXp || 0,
      },
    });
  }, [updateInvestigatorData]);

  const setCampaigName = useCallback(async(campaignId: UploadedCampaignId, name: string) => {
    await updateCampaignName({
      variables: {
        campaign_id: campaignId.serverId,
        name,
      },
    });
  }, [updateCampaignName]);
  const setXp = useCallback(async(campaignId: UploadedCampaignId, investigator: string, type: 'spentXp' | 'availableXp', xp: number) => {
    if (type === 'spentXp') {
      await updateSpentXp({
        variables: {
          campaign_id: campaignId.serverId,
          investigator,
          spent_xp: xp,
        },
      });
    } else {
      updateAvailableXp({
        variables: {
          campaign_id: campaignId.serverId,
          investigator,
          available_xp: xp,
        },
      });
    }
  }, [updateSpentXp, updateAvailableXp]);
  return useMemo(() => {
    return {
      setInvestigatorTrauma,
      setInvestigatorData,
      setWeaknessSet,
      setChaosBag,
      setCampaigName,
      setCampaignNotes,
      setXp,
      addInvestigator,
      removeInvestigatorDeck,
      removeInvestigator,
      setScenarioResults,
      setDifficulty,
      setGuideVersion,
    };
  }, [
    setInvestigatorTrauma, setInvestigatorData, addInvestigator, removeInvestigatorDeck, removeInvestigator,
    setChaosBag, setWeaknessSet, setCampaignNotes, setCampaigName, setXp, setScenarioResults, setDifficulty, setGuideVersion]);
}

export interface GuideActions {
  setInput: (campaignId: UploadedCampaignId, input: GuideInput) => Promise<void>;
  setBinaryAchievement: (campaignId: UploadedCampaignId, achievementId: string, value: boolean) => Promise<void>;
  decAchievement: (campaignId: UploadedCampaignId, achievementId: string) => Promise<void>;
  incAchievement: (campaignId: UploadedCampaignId, achievementId: string, max?: number) => Promise<void>;
}
export function useGuideActions(): GuideActions {
  const [incCountMax] = useIncCountAchievementMaxMutation();
  const [incCount] = useIncCountAchievementMutation();
  const [decCount] = useDecCountAchievementMutation();
  const [setBinary] = useSetBinaryAchievementMutation();

  const [setGuideInput] = useAddGuideInputMutation();
  const setInput = useCallback(async(campaignId: UploadedCampaignId, input: GuideInput) => {
    await setGuideInput({
      variables: {
        campaign_id: campaignId.serverId,
        scenario: input.scenario,
        step: input.step,
        payload: omit(input, ['scenario', 'step']),
      },
    });
  }, [setGuideInput]);


  const setBinaryAchievement = useCallback(async(campaignId: UploadedCampaignId, achievementId: string, value: boolean) => {
    await setBinary({
      variables: {
        campaign_id: campaignId.serverId,
        achievement_id: achievementId,
        value,
      },
    });
  }, [setBinary]);
  const incAchievement = useCallback(async(campaignId: UploadedCampaignId, achievementId: string, max?: number) => {
    if (max) {
      await incCountMax({
        variables: {
          campaign_id: campaignId.serverId,
          achievement_id: achievementId,
          max,
        },
      });
    } else {
      await incCount({
        variables: {
          campaign_id: campaignId.serverId,
          achievement_id: achievementId,
        },
      });
    }
  }, [incCount, incCountMax]);
  const decAchievement = useCallback(async(campaignId: UploadedCampaignId, achievementId: string) => {
    await decCount({
      variables: {
        campaign_id: campaignId.serverId,
        achievement_id: achievementId,
      },
    });
  }, [decCount]);
  return useMemo(() => {
    return {
      setBinaryAchievement,
      incAchievement,
      decAchievement,
      setInput,
    };
  }, [setBinaryAchievement, incAchievement, decAchievement, setInput]);
}