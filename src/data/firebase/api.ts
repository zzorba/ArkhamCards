import { UploadedCampaignId } from '@actions/types';
import { useCallback, useReducer } from 'react';
import { FriendUser, useFunction, ErrorResponse } from './hooks';

interface UpdateHandleRequest {
  handle: string;
}
export function useUpdateHandle() {
  const apiCall = useFunction<UpdateHandleRequest>('social-updateHandle');
  return useCallback(async(handle: string) => {
    const data = await apiCall({ handle });
    return data.error || undefined;
  }, [apiCall]);
}

interface UpdateFriendRequest {
  userId: string;
  action: 'request' | 'revoke';
}

export function useUpdateFriendRequest(setError: (error: string) => void) {
  const apiCall = useFunction<UpdateFriendRequest>('social-updateFriendRequest');
  return useCallback(async(userId: string, action: 'request' | 'revoke') => {
    const data = await apiCall({ userId, action });
    if (data.error) {
      setError(data.error);
    }
  }, [apiCall, setError]);
}

interface CampaignRequest {
  campaignId: string;
}

interface CampaignResponse extends ErrorResponse {
  campaignId: string;
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
  serverId: string;
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
  results: FriendUser[];
}

type SearchAction = StartSearchAction | ErrorSearchAction | FinishSearchAction;

export interface SearchResults {
  term?: string;
  loading: boolean;
  results?: FriendUser[];
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
  users?: FriendUser[];
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