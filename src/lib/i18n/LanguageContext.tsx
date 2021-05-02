import React from 'react';

interface LanguageContextType {
  lang: string;
  useCardTraits: boolean;
  listSeperator: string;
}

export const LanguageContext = React.createContext<LanguageContextType>({ lang: 'en', useCardTraits: true, listSeperator: ', ' });

export default LanguageContext;
