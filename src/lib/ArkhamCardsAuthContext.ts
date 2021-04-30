import React from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface ArkhamCardsAuthContextType {
  user?: FirebaseAuthTypes.User;
  loading: boolean;

  arkhamDb: boolean;
}

export const ArkhamCardsAuthContext = React.createContext<ArkhamCardsAuthContextType>({ loading: true, arkhamDb: false });

export default ArkhamCardsAuthContext;
