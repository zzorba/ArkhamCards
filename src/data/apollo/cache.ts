import { useContext, useCallback } from 'react';
import { useApolloClient, Cache, ApolloClient } from '@apollo/client';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';

export function useModifyUserCache(): [(options: Cache.ModifyOptions) => void, ApolloClient<unknown>] {
  const client = useApolloClient();
  const { userId } = useContext(ArkhamCardsAuthContext);

  return [useCallback((options: Cache.ModifyOptions) => {
    if (!userId) {
      return;
    }
    const targetId = client.cache.identify({ __typename: 'users', id: userId });
    client.cache.modify({
      ...options,
      id: targetId,
    });
  }, [client, userId]), client];
}
