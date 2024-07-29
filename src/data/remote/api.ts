import { useCallback, useContext, useReducer } from "react";
import { filter } from "lodash";
import functions from "@react-native-firebase/functions";

import { SimpleUser } from "@data/remote/hooks";
import { useModifyUserCache } from "@data/apollo/cache";

import LanguageContext from "@lib/i18n/LanguageContext";
import { getAppleRefreshToken, setAppleRefreshToken } from "@lib/auth";
import {
  FriendRequestAction,
  useSearchUsersLazyQuery,
  useUpdateFriendRequestMutation,
} from "@generated/graphql/apollo-schema";

export interface ErrorResponse {
  error?: string;
}

export interface EmptyRequest {}

export function useFunction<RequestT = EmptyRequest, ResponseT = ErrorResponse>(
  functionName: string
) {
  const { lang } = useContext(LanguageContext);
  return useCallback(
    async (request: RequestT): Promise<ResponseT> => {
      const response = await functions().httpsCallable(functionName)({
        ...request,
        locale: lang,
      });
      return response.data as ResponseT;
    },
    [lang, functionName]
  );
}

interface DeleteAccountRequest {}

export function useDeleteAccount() {
  const apiCall = useFunction<DeleteAccountRequest>("social-deleteAccount");
  return useCallback(async () => {
    const appleToken = await getAppleRefreshToken();
    if (appleToken) {
      try {
        await fetch(
          `https://us-central1-arkhamblob.cloudfunctions.net/apple-revokeToken?refresh_token=${encodeURIComponent(
            appleToken
          )}`
        );
      } catch (e) {
        console.log(e.message);
        await setAppleRefreshToken("");
      }
    }
    const data = await apiCall({});
    if (data.error) {
      return data.error;
    }
  }, [apiCall]);
}

export const enum FriendStatus {
  NONE = "none",
  RECEIVED = "received",
  SENT = "sent",
  FRIEND = "friend",
}

export function useUpdateFriendRequest(setError: (error: string) => void) {
  const [updateCache, client] = useModifyUserCache();
  const [apiCall] = useUpdateFriendRequestMutation();
  return useCallback(
    async (userId: string, action: FriendRequestAction) => {
      try {
        const data = await apiCall({ variables: { userId, action } });
        if (data.errors?.length) {
          setError(data.errors[0].message);
        } else {
          const targetId = client.cache.identify({
            __typename: "users",
            id: userId,
          });
          if (targetId) {
            updateCache({
              fields: {
                friends(current) {
                  if (action === "revoke") {
                    return filter(current, (f) => f.user?.__ref !== targetId);
                  }
                  return current;
                },
                sent_requests(current) {
                  if (action === "revoke") {
                    return filter(current, (f) => f.user?.__ref !== targetId);
                  }
                  return current;
                },
                received_requests(current) {
                  if (action === "revoke") {
                    return filter(current, (f) => f.user?.__ref !== targetId);
                  }
                },
              },
            });
          }
        }
      } catch (e) {
        setError(e.message);
      }
    },
    [apiCall, setError, client.cache, updateCache]
  );
}

interface StartSearchAction {
  type: "start";
  term: string;
}

interface ErrorSearchAction {
  type: "error";
  term: string;
  error: string;
}

interface FinishSearchAction {
  type: "finish";
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
    case "start":
      return {
        term: action.term,
        loading: true,
      };
    case "error": {
      if (state.term === action.term) {
        return {
          term: action.term,
          loading: false,
          error: action.error,
        };
      }
      return state;
    }
    case "finish":
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

interface SearchUsers {
  search: (term: string) => void;
  searchResults: SearchResults;
}
export function useSearchUsers(): SearchUsers {
  const [apiCall] = useSearchUsersLazyQuery();
  const [searchResults, updateSearchResults] = useReducer(
    searchResultsReducer,
    { loading: false }
  );
  const doSearch = useCallback(
    async (search: string) => {
      updateSearchResults({ type: "start", term: search });
      if (!search) {
        updateSearchResults({ type: "finish", term: search, results: [] });
      } else {
        const data = await apiCall({ variables: { search } });
        if (data.error?.graphQLErrors.length) {
          updateSearchResults({
            type: "error",
            term: search,
            error: data.error.graphQLErrors[0].message,
          });
        } else {
          updateSearchResults({
            type: "finish",
            term: search,
            results: data.data?.results?.users ?? [],
          });
        }
      }
    },
    [apiCall, updateSearchResults]
  );
  return {
    search: doSearch,
    searchResults,
  };
}
