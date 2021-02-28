import { useContext, useCallback } from 'react';
import { useApolloClient, Cache, ApolloClient } from '@apollo/client';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';

export function useModifyUserCache(): [(options: Cache.ModifyOptions) => void, ApolloClient<unknown>] {
  const client = useApolloClient();
  const { user } = useContext(ArkhamCardsAuthContext);

  return [useCallback((options: Cache.ModifyOptions) => {
    if (!user) {
      return;
    }
    const targetId = client.cache.identify({ __typename: 'users', id: user.uid });
    client.cache.modify({
      ...options,
      id: targetId,
    });
  }, [client, user]), client];
}