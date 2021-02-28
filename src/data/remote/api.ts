import { useCallback, useContext, useReducer } from 'react';
import { filter } from 'lodash';
import functions from '@react-native-firebase/functions';

import { SimpleUser } from '@data/remote/hooks';
import { useModifyUserCache } from '@data/apollo/cache';

import LanguageContext from '@lib/i18n/LanguageContext';

export interface ErrorResponse {
  error?: string;
}

export interface EmptyRequest {}

export function useFunction<RequestT=EmptyRequest, ResponseT=ErrorResponse>(functionName: string) {
  const { lang } = useContext(LanguageContext);
  return useCallback(async(request: RequestT): Promise<ResponseT> => {
    const response = await functions().httpsCallable(functionName)({ ...request, locale: lang });
    return response.data as ResponseT;
  }, [lang, functionName]);
}

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

export enum FriendStatus {
  NONE = 'none',
  RECEIVED = 'received',
  SENT = 'sent',
  FRIEND = 'friend',
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