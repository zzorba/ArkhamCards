import React from 'react';
import Parse from 'parse/react-native';

export type ArkhamCardsUser = Parse.User<Parse.Attributes>;
interface ArkhamCardsAuthContextType {
  user?: ArkhamCardsUser;
  loading: boolean;
  setUser: (user: ArkhamCardsUser | null) => void;
}

function dummySetUser() {
  console.log('dummySetUser used');
}
export const ArkhamCardsAuthContext = React.createContext<ArkhamCardsAuthContextType>({ loading: true, setUser: dummySetUser });

export default ArkhamCardsAuthContext;
