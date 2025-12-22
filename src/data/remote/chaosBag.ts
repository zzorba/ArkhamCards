import { useCallback } from 'react';
import { slice } from 'lodash';

import { ChaosBagHistory, SealedToken, UploadedCampaignId } from '@actions/types'
import { useApolloClient } from '@apollo/client';
import { ChaosTokenType } from '@app_constants';
import {
  Campaign_Difficulty_Enum,
  Chaos_Bag_Tarot_Mode_Enum,
  FullChaosBagResultFragment,
  FullChaosBagResultFragmentDoc,
  useChaosBagClearTokensMutation,
  useChaosBagDrawTokenMutation,
  useReturnChaosBagTokensMutation,
  useReturnChaosBagTokensWithBlurseMutation,
  useChaosBagResetBlessCurseMutation,
  useChaosBagSealTokensMutation,
  useChaosBagSetBlessCurseMutation,
  useChaosBagSetDifficultyMutation,
  useChaosBagSetTarotMutation,
  useUpdateChaosBagDrawTokenMutation,
} from '@generated/graphql/apollo-schema'
import { optimisticUpdates } from './apollo';

export interface ChaosBagActions {
  clearTokens: (campaignId: UploadedCampaignId, bless: number, curse: number) => Promise<void>;
  drawToken: (
    campaignId: UploadedCampaignId,
    action: 'draw' | 'return',
    drawn: ChaosTokenType[],
    isFirst: boolean,
    blurse?: { bless: number; curse: number }
  ) => Promise<void>;
  resetBlessCurse: (campaignId: UploadedCampaignId, drawn: ChaosTokenType[], sealed: SealedToken[]) => Promise<void>;
  sealTokens: (campaignId: UploadedCampaignId, sealed: SealedToken[]) => Promise<void>;
  releaseAllSealed: (campaignId: UploadedCampaignId) => Promise<void>;
  setBlessCurse: (campaignId: UploadedCampaignId, bless: number, curse: number) => Promise<void>;
  setTarot: (campaignId: UploadedCampaignId, tarot: Chaos_Bag_Tarot_Mode_Enum | undefined) => Promise<void>;
  setDifficultyOverride: (campaignId: UploadedCampaignId, difficulty: Campaign_Difficulty_Enum | undefined) => Promise<void>;
}

export function useChaosBagActions(): ChaosBagActions {
  const client = useApolloClient();

  const [clearTokensReq] = useChaosBagClearTokensMutation();
  const [setBlessCurseReq] = useChaosBagSetBlessCurseMutation();
  const [setTarotReq] = useChaosBagSetTarotMutation();
  const [setDifficultyReq] = useChaosBagSetDifficultyMutation();
  const [drawTokenReq] = useChaosBagDrawTokenMutation();
  const [updateDrawTokensReq] = useUpdateChaosBagDrawTokenMutation();
  const [returnChaosBagTokensReq] = useReturnChaosBagTokensMutation();
  const [returnChaosBagTokensWithBlurseReq] = useReturnChaosBagTokensWithBlurseMutation();
  const [sealTokensReq] = useChaosBagSealTokensMutation();
  const [resetBlessCurseReq] = useChaosBagResetBlessCurseMutation();

  const cache = client.cache;
  const clearTokens = useCallback(async(campaignId: UploadedCampaignId, bless: number, curse: number) => {
    await clearTokensReq({
      optimisticResponse: {
        __typename: 'mutation_root',
        update_chaos_bag_result_by_pk: {
          __typename: 'chaos_bag_result',
          id: campaignId.serverId,
          bless,
          curse,
          drawn: [],
        },
      },
      variables: {
        campaign_id: campaignId.serverId,
        bless,
        curse,
      },
      context: {
        serializationKey: campaignId.serverId,
        collapseKey: `${campaignId.serverId}-chaosBagClear`,
      },
      update: optimisticUpdates.chaosBagClearTokens.update,
    });
  }, [clearTokensReq]);

  const setBlessCurse = useCallback(async(campaignId: UploadedCampaignId, bless: number, curse: number) => {
    await setBlessCurseReq({
      optimisticResponse: {
        __typename: 'mutation_root',
        update_chaos_bag_result_by_pk: {
          __typename: 'chaos_bag_result',
          id: campaignId.serverId,
          bless,
          curse,
        },
      },
      variables: {
        campaign_id: campaignId.serverId,
        bless,
        curse,
      },
      context: {
        serializationKey: campaignId.serverId,
        collapseKey: `${campaignId.serverId}-chaosBagSetBlessCurse`,
      },
      update: optimisticUpdates.chaosBagSetBlessCurse.update,
    });
  }, [setBlessCurseReq]);

  const setTarot = useCallback(async(campaignId: UploadedCampaignId, tarot: Chaos_Bag_Tarot_Mode_Enum | undefined) => {
    await setTarotReq({
      optimisticResponse: {
        __typename: 'mutation_root',
        update_chaos_bag_result_by_pk: {
          __typename: 'chaos_bag_result',
          id: campaignId.serverId,
          tarot: tarot || null,
        },
      },
      variables: {
        campaign_id: campaignId.serverId,
        tarot,
      },
      context: {
        serializationKey: campaignId.serverId,
        collapseKey: `${campaignId.serverId}-chaosBagTarot`,
      },
      update: optimisticUpdates.chaosBagSetTarot.update,
    })
  }, [setTarotReq]);


  const setDifficultyOverride = useCallback(async(campaignId: UploadedCampaignId, difficulty: Campaign_Difficulty_Enum | undefined) => {
    await setDifficultyReq({
      optimisticResponse: {
        __typename: 'mutation_root',
        update_chaos_bag_result_by_pk: {
          __typename: 'chaos_bag_result',
          id: campaignId.serverId,
          difficulty: difficulty || null,
        },
      },
      variables: {
        campaign_id: campaignId.serverId,
        difficulty,
      },
      context: {
        serializationKey: campaignId.serverId,
        collapseKey: `${campaignId.serverId}-chaosBagTarot`,
      },
      update: optimisticUpdates.chaosBagSetDifficulty.update,
    })
  }, [setDifficultyReq]);

  const drawToken = useCallback(async(
    campaignId: UploadedCampaignId,
    action: 'draw' | 'return',
    drawn: ChaosTokenType[],
    isFirst: boolean,
    blurse?: { bless: number; curse: number },
  ) => {
    const id = cache.identify({ __typename: 'chaos_bag_result', id: campaignId.serverId });
    const existingCacheData = cache.readFragment<FullChaosBagResultFragment>({
      fragment: FullChaosBagResultFragmentDoc,
      fragmentName: 'FullChaosBagResult',
      id,
    }, true);
    switch (action) {
      case 'return':
        if (blurse) {
          await returnChaosBagTokensWithBlurseReq({
            optimisticResponse: {
              __typename: 'mutation_root',
              update_chaos_bag_result_by_pk: {
                __typename: 'chaos_bag_result',
                id: campaignId.serverId,
                drawn,
                totalDrawn: (existingCacheData?.totalDrawn || 0),
                bless: blurse.bless,
                curse: blurse.curse,
              },
            },
            variables: {
              campaign_id: campaignId.serverId,
              drawn,
              bless: blurse.bless,
              curse: blurse.curse,
            },
            context: {
              serializationKey: campaignId.serverId,
              collapseKey: `${campaignId.serverId}-chaosBagDrawWithBlurse`,
            },
            update: optimisticUpdates.returnChaosBagTokensWithBlurse.update,
          });
        } else {
          await returnChaosBagTokensReq({
            optimisticResponse: {
              __typename: 'mutation_root',
              update_chaos_bag_result_by_pk: {
                __typename: 'chaos_bag_result',
                id: campaignId.serverId,
                drawn,
                totalDrawn: (existingCacheData?.totalDrawn || 0),
              },
            },
            variables: {
              campaign_id: campaignId.serverId,
              drawn,
            },
            context: {
              serializationKey: campaignId.serverId,
              collapseKey: `${campaignId.serverId}-chaosBagDraw`,
            },
            update: optimisticUpdates.returnChaosBagTokens.update,
          });
        }
        break;
      case 'draw': {
        const historyEntry: ChaosBagHistory = {
          type: 'draw',
          tokens: drawn,
        };
        if (isFirst) {
          await drawTokenReq({
            optimisticResponse: {
              __typename: 'mutation_root',
              remove_elem: {
                __typename: 'chaos_bag_result',
                id: campaignId.serverId,
              },
              update_chaos_bag_result_by_pk: {
                __typename: 'chaos_bag_result',
                id: campaignId.serverId,
                drawn,
                totalDrawn: (existingCacheData?.totalDrawn || 0) + 1,
                history: [historyEntry, ...slice(existingCacheData?.history ?? [], 0, 19)],
              },
            },
            variables: {
              campaign_id: campaignId.serverId,
              drawn,
              history: historyEntry,
            },
            context: {
              serializationKey: campaignId.serverId,
              collapseKey: `${campaignId.serverId}-chaosBagDraw`,
            },
            update: optimisticUpdates.chaosBagDrawToken.update,
          });
        } else {
          await updateDrawTokensReq({
            optimisticResponse: {
              __typename: 'mutation_root',
              remove_elem: {
                __typename: 'chaos_bag_result',
                id: campaignId.serverId,
              },
              update_chaos_bag_result_by_pk: {
                __typename: 'chaos_bag_result',
                id: campaignId.serverId,
                drawn,
                totalDrawn: (existingCacheData?.totalDrawn || 0) + 1,
                history: [historyEntry, ...slice(existingCacheData?.history ?? [], 1)],
              },
            },
            variables: {
              campaign_id: campaignId.serverId,
              drawn,
              history: historyEntry,
            },
            context: {
              serializationKey: campaignId.serverId,
              collapseKey: `${campaignId.serverId}-updateChaosBagDraw`,
            },
            update: optimisticUpdates.updateChaosBagDrawToken.update,
          });
        }
        break;
      }
    }
  }, [cache, drawTokenReq, updateDrawTokensReq, returnChaosBagTokensReq, returnChaosBagTokensWithBlurseReq]);

  const sealTokens = useCallback(async(campaignId: UploadedCampaignId, sealed: SealedToken[]) => {
    await sealTokensReq({
      optimisticResponse: {
        __typename: 'mutation_root',
        update_chaos_bag_result_by_pk: {
          __typename: 'chaos_bag_result',
          id: campaignId.serverId,
          sealed,
        },
      },
      variables: {
        campaign_id: campaignId.serverId,
        sealed,
      },
      context: {
        serializationKey: campaignId.serverId,
        collapseKey: `${campaignId.serverId}-chaosBagSealed`,
      },
      update: optimisticUpdates.chaosBagSealTokens.update,
    });
  }, [sealTokensReq]);

  const resetBlessCurse = useCallback(async(campaignId: UploadedCampaignId, drawn: ChaosTokenType[], sealed: SealedToken[]) => {
    await resetBlessCurseReq({
      optimisticResponse: {
        __typename: 'mutation_root',
        update_chaos_bag_result_by_pk: {
          __typename: 'chaos_bag_result',
          id: campaignId.serverId,
          sealed,
          drawn,
          bless: 0,
          curse: 0,
        },
      },
      variables: {
        campaign_id: campaignId.serverId,
        sealed,
        drawn,
      },
      context: {
        serializationKey: campaignId.serverId,
        collapseKey: `${campaignId.serverId}-chaosBagResetBlurse`,
      },
      update: optimisticUpdates.chaosBagResetBlessCurse.update,
    });
  }, [resetBlessCurseReq]);

  const releaseAllSealed = useCallback(async(campaignId: UploadedCampaignId) => {
    await sealTokens(campaignId, []);
  }, [sealTokens]);
  return {
    clearTokens,
    setBlessCurse,
    drawToken,
    sealTokens,
    resetBlessCurse,
    releaseAllSealed,
    setTarot,
    setDifficultyOverride,
  };
}