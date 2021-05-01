import React from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface ArkhamCardsAuthContextType {
  user?: FirebaseAuthTypes.User;
  loading: boolean;

  arkhamDbUser: number | undefined;
}

export const ArkhamCardsAuthContext = React.createContext<ArkhamCardsAuthContextType>({ loading: true, arkhamDbUser: undefined });

export default ArkhamCardsAuthContext;
