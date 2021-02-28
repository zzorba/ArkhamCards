import { useCallback, useContext, useMemo } from 'react';
import { filter } from 'lodash';
import { FetchResult, MutationFunctionOptions } from '@apollo/client';

import { UploadedCampaignId } from '@actions/types';
import { useModifyUserCache } from '@data/apollo/cache';
import {
  UploadNewCampaignMutation, UploadNewCampaignMutationVariables, useUploadNewCampaignMutation,
  useDeleteInvestigatorDecksMutation,
} from '@generated/graphql/apollo-schema';
import { CreateDeckActions, useCreateDeckActions } from './decks';
import { useFunction, ErrorResponse } from './api';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';


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

export function useRemoveInvestigatorDecks() {
  const { user } = useContext(ArkhamCardsAuthContext);
  const [deleteInvestigatorDecks] = useDeleteInvestigatorDecksMutation();

  return useCallback(async(campaignId: UploadedCampaignId, investigator: string) => {
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
}