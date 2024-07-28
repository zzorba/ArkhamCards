
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloClient, ApolloProvider } from '@apollo/client';
import { Persistor } from "redux-persist/es/types";

import DatabaseProvider from '../data/sqlite/DatabaseProvider';
import StyleProvider from '../styles/StyleProvider';
import LanguageProvider from '../lib/i18n/LanguageProvider';
import ArkhamCardsAuthProvider from '../lib/ArkhamCardsAuthProvider';
import ApolloClientContext from '../data/apollo/ApolloClientContext';
import { PlayerCardProvider } from '@data/sqlite/PlayerCardProvider';

type Props = {
 store: {
    redux: any;
    persistor: Persistor;
    apollo: ApolloClient<any>;
    anonApollo: ApolloClient<any>;
  };
  children: React.ReactNode;
};

export default function MyProvider({ store: { redux, persistor, apollo, anonApollo }, children }: Props) {
  return (
    <Provider store={redux}>
      <PersistGate loading={null} persistor={persistor}>
        <ArkhamCardsAuthProvider>
          <ApolloProvider client={apollo}>
            <ApolloClientContext.Provider value={{ client: apollo, anonClient: anonApollo }}>
              <LanguageProvider>
                <DatabaseProvider>
                  <PlayerCardProvider>
                    <StyleProvider>
                      { children }
                    </StyleProvider>
                  </PlayerCardProvider>
                </DatabaseProvider>
              </LanguageProvider>
            </ApolloClientContext.Provider>
          </ApolloProvider>
        </ArkhamCardsAuthProvider>
      </PersistGate>
    </Provider>
  );
}