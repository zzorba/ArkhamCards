import { useCallback, useContext, useReducer } from 'react';
import { filter } from 'lodash';

import { UploadedCampaignId } from '@actions/types';
import { useFunction, ErrorResponse } from './hooks';
import { SimpleUser } from '@data/hooks';
import { useApolloClient } from '@apollo/client';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { FriendStatus } from './types';

interface UpdateHandleRequest {
  handle: string;
}
export function useUpdateHandle() {
  const { user } = useContext(ArkhamCardsAuthContext);
  const client = useApolloClient();
  const apiCall = useFunction<UpdateHandleRequest>('social-updateHandle');
  return useCallback(async(handle: string) => {
    const data = await apiCall({ handle });
    if (data.error) {
      return data.error;
    }
    if (user?.uid) {
      const targetId = client.cache.identify({ __typename: 'users', id: user.uid });
      client.cache.modify({
        id: targetId,
        fields: {
          handle() {
            return handle;
          },
        },
      });
    }
  }, [apiCall, client, user]);
}

interface UpdateFriendRequest {
  userId: string;
  action: 'request' | 'revoke';
}

export function useUpdateFriendRequest(setError: (error: string) => void) {
  const { user } = useContext(ArkhamCardsAuthContext);
  const client = useApolloClient();
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
      if (user && targetId) {
        client.cache.modify({
          id: client.cache.identify({ __typename: 'users', id: user.uid }),
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
  }, [apiCall, setError, client.cache, user]);
}

interface CampaignRequest {
  campaignId: string;
}

interface CampaignResponse extends ErrorResponse {
  campaignId: number;
}
export function useCreateCampaignRequest(): (campaignId: string) => Promise<UploadedCampaignId> {
  const apiCall = useFunction<CampaignRequest, CampaignResponse>('campaign-create');
  return useCallback(async(campaignId: string): Promise<UploadedCampaignId> => {
    const data = await apiCall({ campaignId });
    if (data.error) {
      throw new Error(data.error);
    }
    return {
      campaignId,
      serverId: data.campaignId,
    };
  }, [apiCall]);
}


interface DeleteCampaignRequest extends ErrorResponse {
  campaignId: string;
  serverId: number;
}
export function useDeleteCampaignRequest() {
  const apiCall = useFunction<DeleteCampaignRequest, ErrorResponse>('campaign-delete');
  return useCallback(async({ campaignId, serverId }: UploadedCampaignId): Promise<void> => {
    const data = await apiCall({ campaignId, serverId });
    if (data.error) {
      throw new Error(data.error);
    }
  }, [apiCall]);
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