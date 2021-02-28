import { useCallback, useMemo, useReducer } from 'react';
import { filter } from 'lodash';

import { UploadedCampaignId } from '@actions/types';
import { useFunction, ErrorResponse } from './hooks';
import { SimpleUser } from '@data/hooks';
import { FetchResult, MutationFunctionOptions, MutationResult } from '@apollo/client';

import { useModifyUserCache } from '@data/cache';
import { UploadNewCampaignMutation, UploadNewCampaignMutationVariables, useUploadNewCampaignMutation } from '@data/graphql/schema';

interface UpdateHandleRequest {
  handle: string;
}
export function useUpdateHandle() {
  const [updateCache] = useModifyUserCache();
  const apiCall = useFunction<UpdateHandleRequest>('social-updateHandle');
  return useCallback(async(handle: string) => {
    const data = await apiCall({ handle });
    if (data.error) {
      return data.error;
    }
    updateCache({
      fields: {
        handle() {
          return handle;
        },
      },
    });
  }, [apiCall, updateCache]);
}

interface UpdateFriendRequest {
  userId: string;
  action: 'request' | 'revoke';
}

export function useUpdateFriendRequest(setError: (error: string) => void) {
  const [updateCache, client] = useModifyUserCache();
  const apiCall = useFunction<UpdateFriendRequest>('social-updateFriendRequest');
  return useCallback(async(
    userId: string,
    action: 'request' | 'revoke'
  ) => {
    const data = await apiCall({ userId, action });
    if (data.error) {
      setError(data.error);
    } else {
      const targetId = client.cache.identify({ __typename: 'users', id: userId });
      if (targetId) {
        updateCache({
          fields: {
            friends(current) {
              if (action === 'revoke') {
                return filter(current, f => f.user?.__ref !== targetId);
              }
              return current;
            },
            sent_requests(current) {
              if (action === 'revoke') {
                return filter(current, f => f.user?.__ref !== targetId);
              }
              return current;
            },
            received_requests(current) {
              if (action === 'revoke') {
                return filter(current, f => f.user?.__ref !== targetId);
              }

            },
          },
        });
      }
    }
  }, [apiCall, setError, client.cache, updateCache]);
}

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

interface StartSearchAction {
  type: 'start';
  term: string;
}

interface ErrorSearchAction {
  type: 'error';
  term: string;
  error: string;
}

interface FinishSearchAction {
  type: 'finish';
  term: string;
  results: SimpleUser[];
}

type SearchAction = StartSearchAction | ErrorSearchAction | FinishSearchAction;

export interface SearchResults {
  term?: string;
  loading: boolean;
  results?: SimpleUser[];
  error?: string;
}

function searchResultsReducer(state: SearchResults, action: SearchAction) {
  switch (action.type) {
    case 'start':
      return {
        term: action.term,
        loading: true,
      };
    case 'error': {
      if (state.term === action.term) {
        return {
          term: action.term,
          loading: false,
          error: action.error,
        };
      }
      return state;
    }
    case 'finish':
      if (state.term === action.term) {
        return {
          term: action.term,
          loading: false,
          results: action.results,
        };
      }
      return state;
  }
}

interface SearchUsersRequest {
  search: string;
  continueToken?: string;
}

interface SearchUsersResponse {
  error?: string;
  users?: SimpleUser[];
}

interface SearchUsers {
  search: (term: string) => void;
  searchResults: SearchResults;
}
export function useSearchUsers(): SearchUsers {
  const apiCall = useFunction<SearchUsersRequest, SearchUsersResponse>('social-searchUsers');
  const [searchResults, updateSearchResults] = useReducer(searchResultsReducer, { loading: false });
  const doSearch = useCallback(async(search: string) => {
    updateSearchResults({ type: 'start', term: search });
    if (!search) {
      updateSearchResults({ type: 'finish', term: search, results: [] });
    } else {
      const data = await apiCall({ search });
      if (data.error) {
        updateSearchResults({ type: 'error', term: search, error: data.error });
      } else {
        updateSearchResults({ type: 'finish', term: search, results: data.users || [] });
      }
    }
  }, [apiCall, updateSearchResults]);
  return {
    search: doSearch,
    searchResults,
  };
}