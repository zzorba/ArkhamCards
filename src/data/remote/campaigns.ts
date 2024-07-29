import { useCallback, useContext, useMemo, useEffect } from "react";
import { filter, forEach, map, omit, uniq, keys, concat } from "lodash";
import { useApolloClient } from "@apollo/client";
import { Navigation } from "react-native-navigation";

import {
  Campaign,
  CampaignDifficulty,
  CampaignGuideState,
  CampaignNotes,
  ChaosBagResults,
  GuideAchievement,
  GuideInput,
  ScenarioResult,
  TarotReading,
  Trauma,
  TraumaAndCardData,
  UploadedCampaignId,
  WeaknessSet,
} from "@actions/types";
import { deleteCampaignFromCache, uploadLocalDeck } from "@data/remote/apollo";
import { useModifyUserCache } from "@data/apollo/cache";
import {
  useAddGuideInputMutation,
  useAddCampaignInvestigatorMutation,
  useSetCountAchievementMutation,
  useDeleteInvestigatorDecksMutation,
  useRemoveCampaignInvestigatorMutation,
  useRemoveGuideInputsMutation,
  useSetBinaryAchievementMutation,
  useUpdateInvestigatorTraumaMutation,
  useUpdateWeaknessSetMutation,
  useUpdateCampaignNameMutation,
  useUpdateSpentXpMutation,
  useUpdateAvailableXpMutation,
  useUpdateChaosBagMutation,
  useUpdateCampaignNotesMutation,
  useUpdateCampaignShowInterludesMutation,
  useUpdateInvestigatorDataMutation,
  useUpdateCampaignScenarioResultsMutation,
  useUpdateCampaignDifficultyMutation,
  useUpdateCampaignGuideVersionMutation,
  useUploadNewCampaignMutation,
  useUpdateCampaignArchivedMutation,
  Guide_Input_Insert_Input,
  Guide_Achievement_Insert_Input,
  Investigator_Data_Insert_Input,
  Campaign_Investigator_Insert_Input,
  useUploadChaosBagResultsMutation,
  useUpdateTarotReadingMutation,
  useCreateCampaignMutation,
  useUploadLocalCampaignDeckMutation,
  useEditCampaignAccessMutation,
  EditAccessAction,
  useDeleteCampaignMutation,
} from "@generated/graphql/apollo-schema";
import ArkhamCardsAuthContext from "@lib/ArkhamCardsAuthContext";
import { ChaosBag } from "@app_constants";
import {
  handleUploadNewCampaign,
  handleUploadChaosBagResults,
  optimisticUpdates,
} from "./apollo";
import SingleCampaignT from "@data/interfaces/SingleCampaignT";
import { t } from "ttag";

interface CampaignLink {
  campaignIdA: string;
  campaignIdB: string;
}
export function useCampaignDeleted(
  componentId: string,
  campaign?: SingleCampaignT
) {
  const apollo = useApolloClient();
  const { userId } = useContext(ArkhamCardsAuthContext);
  useEffect(() => {
    if (campaign?.deleted && userId && campaign.id.serverId) {
      deleteCampaignFromCache(
        apollo.cache,
        userId,
        campaign.uuid,
        campaign.id.serverId
      );
      Navigation.popToRoot(componentId);
    }
  }, [campaign, componentId, apollo.cache, userId]);
}
function useCreateCampaignRequest(): (
  campaignId: string,
  guided: boolean
) => Promise<UploadedCampaignId> {
  const [createCampaign] = useCreateCampaignMutation();
  return useCallback(
    async (
      campaignId: string,
      guided: boolean
    ): Promise<UploadedCampaignId> => {
      try {
        const data = await createCampaign({ variables: { campaignId, guided } });
        if (data.errors?.length || !data.data?.createCampaign) {
          throw new Error(
            data.errors?.[0].message ?? t`Unable to create campaign`
          );
        }
        return {
          campaignId,
          serverId: data.data.createCampaign?.campaignId,
        };
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [createCampaign]
  );
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
  const [createCampaign] = useCreateCampaignMutation();
  return useCallback(
    async (
      campaignId: string,
      linked: CampaignLink,
      guided: boolean
    ): Promise<{
      campaignId: UploadedCampaignId;
      campaignIdA: UploadedCampaignId;
      campaignIdB: UploadedCampaignId;
    }> => {
      try {
        const data = await createCampaign({
          variables: { campaignId, guided, linked },
        });
        if (
          data.errors?.length ||
          !data.data?.createCampaign ||
          !data.data.createCampaign.campaignIdA ||
          !data.data.createCampaign.campaignIdB
        ) {
          throw new Error(
            data.errors?.[0].message ?? t`Unable to create campaign`
          );
        }
        return {
          campaignId: {
            campaignId,
            serverId: data.data.createCampaign.campaignId,
          },
          campaignIdA: {
            campaignId: linked.campaignIdA,
            serverId: data.data.createCampaign.campaignIdA,
          },
          campaignIdB: {
            campaignId: linked.campaignIdB,
            serverId: data.data.createCampaign.campaignIdB,
          },
        };
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [createCampaign]
  );
}

export function useUploadLocalDeckRequest(): (
  localDeckId: string,
  arkhamDbId: number
) => Promise<void> {
  const apollo = useApolloClient();
  const { userId } = useContext(ArkhamCardsAuthContext);
  const [uploadLocalDecks] = useUploadLocalCampaignDeckMutation();
  const cache = apollo.cache;
  return useCallback(
    async (localDeckId: string, arkhamDbId: number): Promise<void> => {
      if (userId) {
        try {
          const data = await uploadLocalDecks({
            variables: {
              localDeckId,
              arkhamDbId,
            },
          });
          if (data.errors?.length) {
            throw new Error(data.errors[0].message);
          }
          data.data?.uploadLocalCampaignDeck?.deckIds.forEach(
            ({ campaignId }) => {
              uploadLocalDeck(
                cache,
                campaignId,
                userId,
                localDeckId,
                arkhamDbId
              );
            }
          );
        } catch (e) {
          console.log(`Error with local deck upload: ${e.message}`);
          throw e;
        }
      }
    },
    [uploadLocalDeck, userId, cache]
  );
}

export function useEditCampaignAccessRequest(): (
  campaignId: UploadedCampaignId,
  users: string[],
  action: EditAccessAction
) => Promise<void> {
  const [apiCall] = useEditCampaignAccessMutation();
  return useCallback(
    async (
      campaignId: UploadedCampaignId,
      users: string[],
      action: EditAccessAction
    ): Promise<void> => {
      try {
        const data = await apiCall({
          variables: {
            campaignId: campaignId.campaignId,
            serverId: campaignId.serverId,
            users,
            action,
          },
        });
        if (data.errors?.length) {
          console.log(data.errors);
          throw new Error(data.errors[0].message);
        }
      } catch (e) {
        console.log(`Error with edit campaign access: ${e.message}`);
        throw e;
      }
    },
    [apiCall]
  );
}

function guideAchievementToInsert(
  a: GuideAchievement,
  serverId: number
): Guide_Achievement_Insert_Input {
  return {
    campaign_id: serverId,
    id: a.id,
    bool_value: a.type === "binary" ? a.value : null,
    value: a.type === "count" ? a.value : null,
    type: a.type,
  };
}
export type UploadNewCampaignFn = (
  campaignId: number,
  campaign: Campaign,
  chaosBagResults: ChaosBagResults,
  guide: CampaignGuideState | undefined
) => Promise<void>;

export function useUploadNewCampaign(): UploadNewCampaignFn {
  const [uploadNewCampaign] = useUploadNewCampaignMutation();
  const [uploadChaosBagResults] = useUploadChaosBagResultsMutation();

  return useCallback(
    async (
      campaignId: number,
      campaign: Campaign,
      chaosBagResults: ChaosBagResults,
      guide: CampaignGuideState | undefined
    ) => {
      const variables = {
        id: campaignId,
        bless: chaosBagResults.blessTokens || 0,
        curse: chaosBagResults.curseTokens || 0,
        drawn: chaosBagResults.drawnTokens,
        totalDrawn: chaosBagResults.totalDrawnTokens,
        sealed: chaosBagResults.sealedTokens,
        tarot: chaosBagResults.tarot || null,
        history: chaosBagResults.history,
      };
      await uploadChaosBagResults({
        optimisticResponse: {
          __typename: "mutation_root",
          update_chaos_bag_result_by_pk: {
            __typename: "chaos_bag_result",
            ...variables,
          },
        },
        variables,
        context: {
          serializationKey: campaignId,
        },
        update: handleUploadChaosBagResults,
      });
      let inputs: Guide_Input_Insert_Input[] = [];
      let achievements: Guide_Achievement_Insert_Input[] = [];
      if (campaign.guided) {
        inputs = map(guide?.inputs || [], (input, idx) =>
          guideInputToInsert(input, campaignId, idx)
        );
        achievements = map(guide?.achievements || [], (a) =>
          guideAchievementToInsert(a, campaignId)
        );
      }
      const investigator_data: Investigator_Data_Insert_Input[] = [];
      forEach(
        uniq(
          concat(
            keys(campaign.investigatorData),
            keys(campaign.adjustedInvestigatorData)
          )
        ),
        (investigator) => {
          const data = campaign.investigatorData?.[investigator] || {};
          const adjustedInvestigatorData = campaign.guided
            ? campaign.adjustedInvestigatorData?.[investigator] || {}
            : data;
          investigator_data.push({
            campaign_id: campaignId,
            investigator,
            addedCards: data.addedCards,
            removedCards: data.removedCards,
            storyAssets: data.storyAssets,
            ignoreStoryAssets: data.ignoreStoryAssets,
            insane: data.insane,
            killed: data.killed,
            mental: data.mental,
            physical: data.physical,
            specialXp: data.specialXp,
            cardCounts: data.cardCounts,
            availableXp: data.availableXp,
            spentXp: adjustedInvestigatorData.spentXp,
          });
        }
      );
      const investigators: Campaign_Investigator_Insert_Input[] = [];
      forEach(campaign.nonDeckInvestigators || [], (code) => {
        investigators.push({
          campaign_id: campaignId,
          investigator: code,
        });
      });
      await uploadNewCampaign({
        variables: {
          campaignId: campaignId,
          name: campaign.name,
          cycleCode: campaign.cycleCode,
          standaloneId: campaign.standaloneId,
          difficulty: campaign.difficulty,
          chaosBag: campaign.chaosBag,
          inputs,
          achievements,
          investigator_data,
          investigators,
          campaignNotes: campaign.campaignNotes,
          scenarioResults: campaign.scenarioResults,
          showInterludes: campaign.showInterludes,
          weaknessSet: campaign.weaknessSet,
          guideVersion: campaign.guideVersion,
        },
        context: {
          serializationKey: campaignId,
        },
        update: handleUploadNewCampaign,
      });
    },
    [uploadNewCampaign, uploadChaosBagResults]
  );
}

export interface CreateCampaignActions {
  createCampaign: (
    campaignId: string,
    guided: boolean
  ) => Promise<UploadedCampaignId>;
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
}

export function useCreateCampaignActions(): CreateCampaignActions {
  const createCampaign = useCreateCampaignRequest();
  const createLinkedCampaign = useCreateLinkedCampaignRequest();
  const uploadNewCampaign = useUploadNewCampaign();
  return useMemo(() => {
    return {
      createCampaign,
      createLinkedCampaign,
      uploadNewCampaign,
    };
  }, [createCampaign, createLinkedCampaign, uploadNewCampaign]);
}

export function useDeleteCampaignRequest() {
  const client = useApolloClient();
  const { userId } = useContext(ArkhamCardsAuthContext);
  const [apiCall] = useDeleteCampaignMutation();
  return useCallback(
    async ({ campaignId, serverId }: UploadedCampaignId): Promise<void> => {
      if (userId) {
        deleteCampaignFromCache(client.cache, userId, campaignId, serverId);
      }
      try {
        const data = await apiCall({ variables: { campaignId, serverId } });
        if (data.errors?.length) {
          throw new Error(data.errors[0].message);
        }
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [apiCall, client, userId]
  );
}

export function useLeaveCampaignRequest() {
  const [updateCache, client] = useModifyUserCache();
  const { userId } = useContext(ArkhamCardsAuthContext);
  const editCampaignAccess = useEditCampaignAccessRequest();
  return useCallback(
    async (campaignId: UploadedCampaignId): Promise<void> => {
      if (userId) {
        await editCampaignAccess(campaignId, [userId], EditAccessAction.Revoke);
        const targetCampaignId = client.cache.identify({
          __typename: "campaign",
          id: campaignId.serverId,
        });
        if (targetCampaignId) {
          updateCache({
            fields: {
              campaigns(current) {
                return filter(
                  current,
                  (c) => c.campaign?.__ref !== targetCampaignId
                );
              },
            },
          });
        }
      }
    },
    [editCampaignAccess, updateCache, client, userId]
  );
}

export type SetCampaignChaosBagAction = (
  campaignId: UploadedCampaignId,
  chaosBag: ChaosBag
) => Promise<void>;
export function useSetCampaignChaosBag(): SetCampaignChaosBagAction {
  const [updateChaosBag] = useUpdateChaosBagMutation();
  return useCallback(
    async (campaignId: UploadedCampaignId, chaosBag: ChaosBag) => {
      await updateChaosBag({
        optimisticResponse: {
          __typename: "mutation_root",
          update_campaign_by_pk: {
            __typename: "campaign",
            id: campaignId.serverId,
            uuid: campaignId.campaignId,
            chaosBag,
          },
        },
        variables: {
          campaign_id: campaignId.serverId,
          chaos_bag: chaosBag,
        },
        context: {
          serializationKey: campaignId.serverId,
        },
      });
    },
    [updateChaosBag]
  );
}

export type SetCampaignWeaknessSetAction = (
  campaignId: UploadedCampaignId,
  weaknessSet: WeaknessSet
) => Promise<void>;
export function useSetCampaignWeaknessSet(): SetCampaignWeaknessSetAction {
  const [updateWeaknessSet] = useUpdateWeaknessSetMutation();
  return useCallback(
    async (campaignId: UploadedCampaignId, weaknessSet: WeaknessSet) => {
      await updateWeaknessSet({
        optimisticResponse: {
          __typename: "mutation_root",
          update_campaign_by_pk: {
            __typename: "campaign",
            id: campaignId.serverId,
            uuid: campaignId.campaignId,
            weaknessSet,
          },
        },
        variables: {
          campaign_id: campaignId.serverId,
          weakness_set: weaknessSet,
        },
        context: {
          serializationKey: campaignId.serverId,
        },
      });
    },
    [updateWeaknessSet]
  );
}

export type SetCampaignTarotReadingAction = (
  campaignId: UploadedCampaignId,
  tarotReading: TarotReading | undefined
) => Promise<void>;
export function useSetCampaignTarotReading(): SetCampaignTarotReadingAction {
  const [updateTarotReading] = useUpdateTarotReadingMutation();
  return useCallback(
    async (
      campaignId: UploadedCampaignId,
      tarotReading: TarotReading | undefined
    ) => {
      await updateTarotReading({
        optimisticResponse: {
          __typename: "mutation_root",
          update_campaign_by_pk: {
            __typename: "campaign",
            id: campaignId.serverId,
            uuid: campaignId.campaignId,
            tarot_reading: tarotReading,
          },
        },
        variables: {
          campaign_id: campaignId.serverId,
          tarotReading,
        },
        context: {
          serializationKey: campaignId.serverId,
        },
      });
    },
    [updateTarotReading]
  );
}

export type SetCampaignNotesAction = (
  campaignId: UploadedCampaignId,
  campaignNotes: CampaignNotes
) => Promise<void>;
export function useSetCampaignNotes(): SetCampaignNotesAction {
  const [updateCampaignNotes] = useUpdateCampaignNotesMutation();
  return useCallback(
    async (campaignId: UploadedCampaignId, campaignNotes: CampaignNotes) => {
      await updateCampaignNotes({
        optimisticResponse: {
          __typename: "mutation_root",
          update_campaign_by_pk: {
            __typename: "campaign",
            id: campaignId.serverId,
            uuid: campaignId.campaignId,
            campaignNotes,
          },
        },
        variables: {
          campaign_id: campaignId.serverId,
          campaign_notes: campaignNotes,
        },
        context: {
          serializationKey: campaignId.serverId,
        },
      });
    },
    [updateCampaignNotes]
  );
}

export type SetCampaignShowInterludes = (
  campaignId: UploadedCampaignId,
  showInterludes: boolean
) => Promise<void>;
export function useSetCampaignShowInterludes(): SetCampaignShowInterludes {
  const [updateShowInterlude] = useUpdateCampaignShowInterludesMutation();
  return useCallback(
    async (campaignId: UploadedCampaignId, showInterludes: boolean) => {
      await updateShowInterlude({
        optimisticResponse: {
          __typename: "mutation_root",
          update_campaign_by_pk: {
            __typename: "campaign",
            id: campaignId.serverId,
            uuid: campaignId.campaignId,
            showInterludes,
          },
        },
        variables: {
          campaign_id: campaignId.serverId,
          show_interludes: showInterludes,
        },
        context: {
          serializationKey: campaignId.serverId,
        },
      });
    },
    [updateShowInterlude]
  );
}

export interface UpdateCampaignActions {
  setArchived: (
    campaignId: UploadedCampaignId,
    archived: boolean
  ) => Promise<void>;
  setScenarioResults: (
    campaignId: UploadedCampaignId,
    scenarioResults: ScenarioResult[]
  ) => Promise<void>;
  setGuideVersion: (
    campaignId: UploadedCampaignId,
    guideVersion: number
  ) => Promise<void>;
  setDifficulty: (
    campaignId: UploadedCampaignId,
    difficulty?: CampaignDifficulty
  ) => Promise<void>;
  setInvestigatorData: (
    campaignId: UploadedCampaignId,
    investigator: string,
    trauma: TraumaAndCardData
  ) => Promise<void>;
  setInvestigatorTrauma: (
    campaignId: UploadedCampaignId,
    investigator: string,
    trauma: Trauma
  ) => Promise<void>;
  setXp: (
    campaignId: UploadedCampaignId,
    investigator: string,
    type: "spentXp" | "availableXp",
    xp: number
  ) => Promise<void>;
  setCampaigName: (
    campaignId: UploadedCampaignId,
    name: string
  ) => Promise<void>;
  setWeaknessSet: SetCampaignWeaknessSetAction;
  setChaosBag: SetCampaignChaosBagAction;
  setCampaignNotes: SetCampaignNotesAction;
  addInvestigator: (
    campaignId: UploadedCampaignId,
    investigator: string
  ) => Promise<void>;
  removeInvestigator: (
    campaignId: UploadedCampaignId,
    investigator: string
  ) => Promise<void>;
  removeInvestigatorDeck: (
    campaignId: UploadedCampaignId,
    investigator: string
  ) => Promise<void>;
}

export function useUpdateCampaignActions(): UpdateCampaignActions {
  const [updateArchived] = useUpdateCampaignArchivedMutation();
  const [updateInvestigatorTrauma] = useUpdateInvestigatorTraumaMutation();
  const [updateInvestigatorData] = useUpdateInvestigatorDataMutation();
  const [updateCampaignName] = useUpdateCampaignNameMutation();
  const [updateSpentXp] = useUpdateSpentXpMutation();
  const [updateAvailableXp] = useUpdateAvailableXpMutation();
  const [updateScenarioResults] = useUpdateCampaignScenarioResultsMutation();
  const [updateDifficulty] = useUpdateCampaignDifficultyMutation();
  const [updateGuideVersion] = useUpdateCampaignGuideVersionMutation();

  const { userId } = useContext(ArkhamCardsAuthContext);
  const [insertInvestigator] = useAddCampaignInvestigatorMutation();
  const [deleteInvestigator] = useRemoveCampaignInvestigatorMutation();
  const [deleteInvestigatorDecks] = useDeleteInvestigatorDecksMutation();
  const setWeaknessSet = useSetCampaignWeaknessSet();
  const setChaosBag = useSetCampaignChaosBag();
  const setCampaignNotes = useSetCampaignNotes();

  const setArchived = useCallback(
    async (campaignId: UploadedCampaignId, archived: boolean) => {
      await updateArchived({
        optimisticResponse: {
          __typename: "mutation_root",
          update_campaign_by_pk: {
            __typename: "campaign",
            id: campaignId.serverId,
            uuid: campaignId.campaignId,
            archived,
          },
        },
        variables: {
          campaign_id: campaignId.serverId,
          archived,
        },
        context: {
          serializationKey: campaignId.serverId,
        },
      });
    },
    [updateArchived]
  );

  const setDifficulty = useCallback(
    async (campaignId: UploadedCampaignId, difficulty?: CampaignDifficulty) => {
      await updateDifficulty({
        optimisticResponse: {
          __typename: "mutation_root",
          update_campaign_by_pk: {
            __typename: "campaign",
            id: campaignId.serverId,
            uuid: campaignId.campaignId,
            difficulty,
          },
        },
        variables: {
          campaign_id: campaignId.serverId,
          difficulty,
        },
        context: {
          serializationKey: campaignId.serverId,
        },
      });
    },
    [updateDifficulty]
  );

  const setGuideVersion = useCallback(
    async (campaignId: UploadedCampaignId, guideVersion: number) => {
      await updateGuideVersion({
        optimisticResponse: {
          __typename: "mutation_root",
          update_campaign_by_pk: {
            __typename: "campaign",
            id: campaignId.serverId,
            uuid: campaignId.campaignId,
            guide_version: guideVersion,
          },
        },
        variables: {
          campaign_id: campaignId.serverId,
          guideVersion,
        },
        context: {
          serializationKey: campaignId.serverId,
        },
      });
    },
    [updateGuideVersion]
  );

  const setScenarioResults = useCallback(
    async (
      campaignId: UploadedCampaignId,
      scenarioResults: ScenarioResult[]
    ) => {
      await updateScenarioResults({
        optimisticResponse: {
          __typename: "mutation_root",
          update_campaign_by_pk: {
            __typename: "campaign",
            id: campaignId.serverId,
            uuid: campaignId.campaignId,
            scenarioResults,
          },
        },
        variables: {
          campaign_id: campaignId.serverId,
          scenarioResults,
        },
        context: {
          serializationKey: campaignId.serverId,
        },
      });
    },
    [updateScenarioResults]
  );

  const addInvestigator = useCallback(
    async (campaignId: UploadedCampaignId, investigator: string) => {
      await insertInvestigator({
        optimisticResponse: {
          __typename: "mutation_root",
          insert_campaign_investigator_one: {
            __typename: "campaign_investigator",
            campaign_id: campaignId.serverId,
            id: `${campaignId.serverId}-${investigator}`,
            investigator,
          },
        },
        variables: {
          campaign_id: campaignId.serverId,
          investigator,
        },
        context: {
          serializationKey: campaignId.serverId,
        },
        update: optimisticUpdates.addCampaignInvestigator.update,
      });
    },
    [insertInvestigator]
  );
  const removeInvestigator = useCallback(
    async (campaignId: UploadedCampaignId, investigator: string) => {
      await deleteInvestigator({
        optimisticResponse: {
          __typename: "mutation_root",
          delete_campaign_investigator: {
            __typename: "campaign_investigator_mutation_response",
            returning: [
              {
                __typename: "campaign_investigator",
                id: `${campaignId.serverId}-${investigator}`,
                campaign_id: campaignId.serverId,
                investigator,
              },
            ],
          },
        },
        variables: {
          campaign_id: campaignId.serverId,
          investigator,
        },
        context: {
          serializationKey: campaignId.serverId,
        },
        update: optimisticUpdates.removeCampaignInvestigator.update,
      });
    },
    [deleteInvestigator]
  );
  const removeInvestigatorDeck = useCallback(
    async (campaignId: UploadedCampaignId, investigator: string) => {
      if (!userId) {
        return;
      }
      await deleteInvestigatorDecks({
        optimisticResponse: {
          __typename: "mutation_root",
          delete_campaign_deck: {
            __typename: "campaign_deck_mutation_response",
            returning: [
              {
                id: -1,
                campaign_id: campaignId.serverId,
                arkhamdb_id: -1,
                local_uuid: "",
                investigator,
                owner_id: userId,
              },
            ],
          },
        },
        variables: {
          user_id: userId,
          investigator,
          campaign_id: campaignId.serverId,
        },
        context: {
          serializationKey: campaignId.serverId,
        },
        update: optimisticUpdates.deleteInvestigatorDecks.update,
      });
    },
    [deleteInvestigatorDecks, userId]
  );

  const setInvestigatorTrauma = useCallback(
    async (
      campaignId: UploadedCampaignId,
      investigator: string,
      trauma: Trauma
    ) => {
      const variables = {
        campaign_id: campaignId.serverId,
        investigator,
        killed: trauma.killed || null,
        insane: trauma.insane || null,
        physical: trauma.physical || null,
        mental: trauma.mental || null,
      };
      await updateInvestigatorTrauma({
        optimisticResponse: {
          __typename: "mutation_root",
          insert_investigator_data_one: {
            __typename: "investigator_data",
            id: `${campaignId.serverId} ${investigator}`,
            ...variables,
          },
        },
        variables,
        context: {
          serializationKey: `${campaignId.serverId}-${investigator}`,
        },
        update: optimisticUpdates.updateInvestigatorTrauma.update,
      });
    },
    [updateInvestigatorTrauma]
  );

  const setInvestigatorData = useCallback(
    async (
      campaignId: UploadedCampaignId,
      investigator: string,
      data: TraumaAndCardData
    ) => {
      const variables = {
        campaign_id: campaignId.serverId,
        investigator,
        mental: data.mental || null,
        physical: data.physical || null,
        insane: data.insane || null,
        killed: data.killed || null,
        storyAssets: data.storyAssets || [],
        addedCards: data.addedCards || [],
        removedCards: data.removedCards || [],
        ignoreStoryAssets: data.ignoreStoryAssets || [],
        availableXp: data.availableXp || 0,
        cardCounts: data.cardCounts || {},
        specialXp: data.specialXp || {},
      };
      await updateInvestigatorData({
        optimisticResponse: {
          __typename: "mutation_root",
          insert_investigator_data_one: {
            __typename: "investigator_data",
            id: `${campaignId.serverId} ${investigator}`,
            ...variables,
          },
        },
        variables,
        context: {
          serializationKey: `${campaignId.serverId}-${investigator}`,
        },
        update: optimisticUpdates.updateInvestigatorData.update,
      });
    },
    [updateInvestigatorData]
  );

  const setCampaigName = useCallback(
    async (campaignId: UploadedCampaignId, name: string) => {
      await updateCampaignName({
        optimisticResponse: {
          __typename: "mutation_root",
          update_campaign_by_pk: {
            __typename: "campaign",
            id: campaignId.serverId,
            uuid: campaignId.campaignId,
            name,
          },
        },
        variables: {
          campaign_id: campaignId.serverId,
          name,
        },
        context: {
          serializationKey: campaignId.serverId,
        },
      });
    },
    [updateCampaignName]
  );
  const setXp = useCallback(
    async (
      campaignId: UploadedCampaignId,
      investigator: string,
      type: "spentXp" | "availableXp",
      xp: number
    ) => {
      if (type === "spentXp") {
        await updateSpentXp({
          optimisticResponse: {
            __typename: "mutation_root",
            insert_investigator_data_one: {
              __typename: "investigator_data",
              id: `${campaignId.serverId} ${investigator}`,
              campaign_id: campaignId.serverId,
              investigator,
              spentXp: xp,
            },
          },
          variables: {
            campaign_id: campaignId.serverId,
            investigator,
            spent_xp: xp,
          },
          context: {
            serializationKey: `${campaignId.serverId}-${investigator}`,
          },
          update: optimisticUpdates.updateSpentXp.update,
        });
      } else {
        updateAvailableXp({
          optimisticResponse: {
            __typename: "mutation_root",
            insert_investigator_data_one: {
              __typename: "investigator_data",
              id: `${campaignId.serverId} ${investigator}`,
              campaign_id: campaignId.serverId,
              investigator,
              availableXp: xp,
            },
          },
          variables: {
            campaign_id: campaignId.serverId,
            investigator,
            available_xp: xp,
          },
          context: {
            serializationKey: `${campaignId.serverId}-${investigator}`,
          },
          update: optimisticUpdates.updateAvailableXp.update,
        });
      }
    },
    [updateSpentXp, updateAvailableXp]
  );
  return useMemo(() => {
    return {
      setArchived,
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
    setInvestigatorTrauma,
    setInvestigatorData,
    addInvestigator,
    removeInvestigatorDeck,
    removeInvestigator,
    setArchived,
    setChaosBag,
    setWeaknessSet,
    setCampaignNotes,
    setCampaigName,
    setXp,
    setScenarioResults,
    setDifficulty,
    setGuideVersion,
  ]);
}

export function guideInputToInsert(
  input: GuideInput,
  serverId: number,
  index?: number
) {
  return {
    id: `${serverId}(${input.type},${input.scenario || ""},${
      input.step || ""
    })`,
    type: input.type,
    campaign_id: serverId,
    scenario: input.scenario || null,
    step: input.step || null,
    payload: omit(input, ["scenario", "step", "type"]),
    inserted_idx: index !== undefined ? index : null,
  };
}
export interface GuideActions {
  setInput: (
    campaignId: UploadedCampaignId,
    input: GuideInput
  ) => Promise<void>;
  removeInputs: (
    campaignId: UploadedCampaignId,
    inputs: GuideInput[]
  ) => Promise<void>;
  setBinaryAchievement: (
    campaignId: UploadedCampaignId,
    achievementId: string,
    value: boolean
  ) => Promise<void>;
  setCountAchievement: (
    campaignId: UploadedCampaignId,
    achievementId: string,
    value: number
  ) => Promise<void>;
}
export function useGuideActions(): GuideActions {
  const [setCount] = useSetCountAchievementMutation();
  const [setBinary] = useSetBinaryAchievementMutation();

  const [removeGuideInputs] = useRemoveGuideInputsMutation();
  const [setGuideInput] = useAddGuideInputMutation();
  const setInput = useCallback(
    async (campaignId: UploadedCampaignId, input: GuideInput) => {
      const insert = guideInputToInsert(input, campaignId.serverId);
      await setGuideInput({
        optimisticResponse: {
          __typename: "mutation_root",
          insert_guide_input_one: {
            ...insert,
            __typename: "guide_input",
          },
        },
        variables: insert,
        context: {
          serializationKey: campaignId.serverId,
        },
        update: optimisticUpdates.addGuideInput.update,
      });
    },
    [setGuideInput]
  );
  const removeInputs = useCallback(
    async (campaignId: UploadedCampaignId, inputs: GuideInput[]) => {
      const ids = map(
        inputs,
        (input) => guideInputToInsert(input, campaignId.serverId).id
      );
      await removeGuideInputs({
        optimisticResponse: {
          __typename: "mutation_root",
          delete_guide_input: {
            __typename: "guide_input_mutation_response",
            affected_rows: ids.length,
            returning: map(ids, (id) => {
              return {
                id,
                campaign_id: campaignId.serverId,
              };
            }),
          },
        },
        variables: {
          campaign_id: campaignId.serverId,
          ids,
        },
        context: {
          serializationKey: campaignId.serverId,
        },
        update: optimisticUpdates.removeGuideInputs.update,
      });
    },
    [removeGuideInputs]
  );

  const setBinaryAchievement = useCallback(
    async (
      campaignId: UploadedCampaignId,
      achievementId: string,
      value: boolean
    ) => {
      await setBinary({
        optimisticResponse: {
          __typename: "mutation_root",
          insert_guide_achievement_one: {
            __typename: "guide_achievement",
            id: achievementId,
            campaign_id: campaignId.serverId,
            type: "binary",
            value: null,
            bool_value: value,
          },
        },
        variables: {
          campaign_id: campaignId.serverId,
          id: achievementId,
          value,
        },
        context: {
          serializationKey: campaignId.serverId,
        },
        update: optimisticUpdates.setBinaryAchievement.update,
      });
    },
    [setBinary]
  );
  const setCountAchievement = useCallback(
    async (
      campaignId: UploadedCampaignId,
      achievementId: string,
      value: number
    ) => {
      await setCount({
        optimisticResponse: {
          __typename: "mutation_root",
          insert_guide_achievement_one: {
            __typename: "guide_achievement",
            id: achievementId,
            campaign_id: campaignId.serverId,
            type: "count",
            value,
            bool_value: null,
          },
        },
        variables: {
          campaign_id: campaignId.serverId,
          id: achievementId,
          value,
        },
        context: {
          serializationKey: campaignId.serverId,
        },
        update: optimisticUpdates.setCountAchievement.update,
      });
    },
    [setCount]
  );
  return useMemo(() => {
    return {
      setBinaryAchievement,
      setCountAchievement,
      setInput,
      removeInputs,
    };
  }, [setBinaryAchievement, setCountAchievement, setInput, removeInputs]);
}
