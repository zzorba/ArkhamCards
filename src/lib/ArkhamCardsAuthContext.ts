import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React from 'react';

interface ArkhamCardsAuthContextType {
  user?: FirebaseAuthTypes.User;
  userId?: string;
  loading: boolean;

  arkhamDb: boolean;
  arkhamDbUser: number | undefined;
}

export const ArkhamCardsAuthContext = React.createContext<ArkhamCardsAuthContextType>({ loading: true, arkhamDb: false, arkhamDbUser: undefined });

export default ArkhamCardsAuthContext;
