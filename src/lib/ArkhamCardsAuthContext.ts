import React from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface ArkhamCardsAuthContextType {
  user?: FirebaseAuthTypes.User;
  loading: boolean;
}

export const ArkhamCardsAuthContext = React.createContext<ArkhamCardsAuthContextType>({ loading: true });

export default ArkhamCardsAuthContext;
