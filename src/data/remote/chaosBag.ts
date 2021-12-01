import { SealedToken, UploadedCampaignId } from '@actions/types'
import { useApolloClient } from '@apollo/client';
import { ChaosTokenType } from '@app_constants';
import { Chaos_Bag_Tarot_Mode_Enum, FullChaosBagResultFragment, FullChaosBagResultFragmentDoc, useChaosBagClearTokensMutation, useChaosBagDecBlessMutation, useChaosBagDecCurseMutation, useChaosBagDrawTokenMutation, useChaosBagIncBlessMutation, useChaosBagIncCurseMutation, useChaosBagReleaseAllSealedMutation, useChaosBagResetBlessCurseMutation, useChaosBagSealTokensMutation, useChaosBagSetTarotMutation } from '@generated/graphql/apollo-schema'
import { useCallback } from 'react';

export interface ChaosBagActions {
  clearTokens: (campaignId: UploadedCampaignId, bless: number, curse: number) => Promise<void>;
  drawToken: (campaignId: UploadedCampaignId, drawn: ChaosTokenType[]) => Promise<void>;
  resetBlessCurse: (campaignId: UploadedCampaignId, drawn: ChaosTokenType[], sealed: SealedToken[]) => Promise<void>;
  sealTokens: (campaignId: UploadedCampaignId, sealed: SealedToken[]) => Promise<void>;
  releaseAllSealed: (campaignId: UploadedCampaignId) => Promise<void>;
  adjustBlessCurse: (campaignId: UploadedCampaignId, type: 'bless' | 'curse', direction: 'inc' | 'dec') => Promise<void>;
  setTarot: (campaignId: UploadedCampaignId, tarot: Chaos_Bag_Tarot_Mode_Enum | undefined) => Promise<void>;
}

export function useChaosBagActions(): ChaosBagActions {
  const client = useApolloClient();

  const [clearTokensReq] = useChaosBagClearTokensMutation();
  const [incBless] = useChaosBagIncBlessMutation();
  const [decBless] = useChaosBagDecBlessMutation();
  const [incCurse] = useChaosBagIncCurseMutation();
  const [decCurse] = useChaosBagDecCurseMutation();
  const [setTarotReq] = useChaosBagSetTarotMutation();

  const [drawTokenReq] = useChaosBagDrawTokenMutation();
  const [sealTokensReq] = useChaosBagSealTokensMutation();
  const [resetBlessCurseReq] = useChaosBagResetBlessCurseMutation();
  const [releaseAllSealedReq] = useChaosBagReleaseAllSealedMutation();
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
      },
    });
  }, [clearTokensReq]);

  const adjustBlessCurse = useCallback(async(campaignId: UploadedCampaignId, type: 'bless' | 'curse', direction: 'inc' | 'dec') => {
    const id = cache.identify({ __typename: 'chaos_bag_result', id: campaignId.serverId });
    const existingCacheData = cache.readFragment<FullChaosBagResultFragment>({
      fragment: FullChaosBagResultFragmentDoc,
      fragmentName: 'FullChaosBagResult',
      id,
    }, true);
    if (type === 'bless') {
      if (direction === 'inc') {
        await incBless({
          optimisticResponse: {
            __typename: 'mutation_root',
            update_chaos_bag_result: {
              __typename: 'chaos_bag_result_mutation_response',
              returning: [
                {
                  __typename: 'chaos_bag_result',
                  id: campaignId.serverId,
                  bless: Math.min((existingCacheData?.bless || 0) + 1, 10),
                },
              ],
            },
          },
          variables: {
            campaign_id: campaignId.serverId,
          },
          context: {
            serializationKey: campaignId.serverId,
          },
        });
      } else {
        await decBless({
          optimisticResponse: {
            __typename: 'mutation_root',
            update_chaos_bag_result: {
              __typename: 'chaos_bag_result_mutation_response',
              returning: [
                {
                  __typename: 'chaos_bag_result',
                  id: campaignId.serverId,
                  bless: Math.max((existingCacheData?.bless || 0) - 1, 0),
                },
              ],
            },
          },
          variables: {
            campaign_id: campaignId.serverId,
          },
          context: {
            serializationKey: campaignId.serverId,
          },
        });
      }
    } else {
      if (direction === 'inc') {
        await incCurse({
          optimisticResponse: {
            __typename: 'mutation_root',
            update_chaos_bag_result: {
              __typename: 'chaos_bag_result_mutation_response',
              returning: [
                {
                  __typename: 'chaos_bag_result',
                  id: campaignId.serverId,
                  curse: Math.min((existingCacheData?.curse || 0) + 1, 10),
                },
              ],
            },
          },
          variables: {
            campaign_id: campaignId.serverId,
          },
          context: {
            serializationKey: campaignId.serverId,
          },
        });
      } else {
        await decCurse({
          optimisticResponse: {
            __typename: 'mutation_root',
            update_chaos_bag_result: {
              __typename: 'chaos_bag_result_mutation_response',
              returning: [
                {
                  __typename: 'chaos_bag_result',
                  id: campaignId.serverId,
                  curse: Math.max((existingCacheData?.curse || 0) - 1, 0),
                },
              ],
            },
          },
          variables: {
            campaign_id: campaignId.serverId,
          },
          context: {
            serializationKey: campaignId.serverId,
          },
        });
      }
    }
  }, [incBless, decBless, incCurse, decCurse, cache]);

  const setTarot = useCallback(async(campaignId: UploadedCampaignId, tarot: Chaos_Bag_Tarot_Mode_Enum | undefined) => {
    await setTarotReq({
      optimisticResponse: {
        __typename: 'mutation_root',
        update_chaos_bag_result: {
          __typename: 'chaos_bag_result_mutation_response',
          returning: [
            {
              __typename: 'chaos_bag_result',
              id: campaignId.serverId,
              tarot: tarot || null,
            },
          ],
        },
      },
      variables: {
        campaign_id: campaignId.serverId,
        tarot,
      },
      context: {
        serializationKey: campaignId.serverId,
      },
    })
  }, [setTarotReq]);

  const drawToken = useCallback(async(campaignId: UploadedCampaignId, drawn: ChaosTokenType[]) => {
    const id = cache.identify({ __typename: 'chaos_bag_result', id: campaignId.serverId });
    const existingCacheData = cache.readFragment<FullChaosBagResultFragment>({
      fragment: FullChaosBagResultFragmentDoc,
      fragmentName: 'FullChaosBagResult',
      id,
    }, true);
    await drawTokenReq({
      optimisticResponse: {
        __typename: 'mutation_root',
        update_chaos_bag_result_by_pk: {
          __typename: 'chaos_bag_result',
          id: campaignId.serverId,
          drawn,
          totalDrawn: (existingCacheData?.totalDrawn || 0) + 1,
        },
      },
      variables: {
        campaign_id: campaignId.serverId,
        drawn,
      },
      context: {
        serializationKey: campaignId.serverId,
      },
    });
  }, [drawTokenReq, cache]);

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
      },
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
      },
    });
  }, [resetBlessCurseReq]);

  const releaseAllSealed = useCallback(async(campaignId: UploadedCampaignId) => {
    await releaseAllSealedReq({
      optimisticResponse: {
        __typename: 'mutation_root',
        update_chaos_bag_result_by_pk: {
          __typename: 'chaos_bag_result',
          id: campaignId.serverId,
          sealed: [],
        },
      },
      variables: {
        campaign_id: campaignId.serverId,
      },
      context: {
        serializationKey: campaignId.serverId,
      },
    });
  }, [releaseAllSealedReq]);
  return {
    clearTokens,
    adjustBlessCurse,
    drawToken,
    sealTokens,
    resetBlessCurse,
    releaseAllSealed,
    setTarot,
  };
}