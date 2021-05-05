import React from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface ArkhamCardsAuthContextType {
  user?: FirebaseAuthTypes.User;
  loading: boolean;

  arkhamDb: boolean;
  arkhamDbUser: number | undefined;
}

export const ArkhamCardsAuthContext = React.createContext<ArkhamCardsAuthContextType>({ loading: true, arkhamDb: false, arkhamDbUser: undefined });

export default ArkhamCardsAuthContext;
