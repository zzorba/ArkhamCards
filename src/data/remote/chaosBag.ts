import { SealedToken, UploadedCampaignId } from '@actions/types'
import { useApolloClient } from '@apollo/client';
import { ChaosTokenType } from '@app_constants';
import {
  Chaos_Bag_Tarot_Mode_Enum,
  FullChaosBagResultFragment,
  FullChaosBagResultFragmentDoc,
  useChaosBagClearTokensMutation,
  useChaosBagDrawTokenMutation,
  useChaosBagResetBlessCurseMutation,
  useChaosBagSealTokensMutation,
  useChaosBagSetBlessCurseMutation,
  useChaosBagSetTarotMutation,
} from '@generated/graphql/apollo-schema'
import { optimisticUpdates } from './apollo';
import { useCallback } from 'react';

export interface ChaosBagActions {
  clearTokens: (campaignId: UploadedCampaignId, bless: number, curse: number) => Promise<void>;
  drawToken: (campaignId: UploadedCampaignId, drawn: ChaosTokenType[]) => Promise<void>;
  resetBlessCurse: (campaignId: UploadedCampaignId, drawn: ChaosTokenType[], sealed: SealedToken[]) => Promise<void>;
  sealTokens: (campaignId: UploadedCampaignId, sealed: SealedToken[]) => Promise<void>;
  releaseAllSealed: (campaignId: UploadedCampaignId) => Promise<void>;
  setBlessCurse: (campaignId: UploadedCampaignId, bless: number, curse: number) => Promise<void>;
  setTarot: (campaignId: UploadedCampaignId, tarot: Chaos_Bag_Tarot_Mode_Enum | undefined) => Promise<void>;
}

export function useChaosBagActions(): ChaosBagActions {
  const client = useApolloClient();

  const [clearTokensReq] = useChaosBagClearTokensMutation();
  const [setBlessCurseReq] = useChaosBagSetBlessCurseMutation();
  const [setTarotReq] = useChaosBagSetTarotMutation();

  const [drawTokenReq] = useChaosBagDrawTokenMutation();
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
        collapseKey: `${campaignId.serverId}-chaosBagDraw`,
      },
      update: optimisticUpdates.chaosBagDrawToken.update,
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
  };
}