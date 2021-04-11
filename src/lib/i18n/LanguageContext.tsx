import React from 'react';

interface LanguageContextType {
  lang: string;
  useCardTraits: boolean;
}

export const LanguageContext = React.createContext<LanguageContextType>({ lang: 'en', useCardTraits: true });

export default LanguageContext;
