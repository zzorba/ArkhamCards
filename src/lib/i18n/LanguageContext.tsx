import React from 'react';

interface LanguageContextType {
  lang: string;
  useCardTraits: boolean;
  listSeperator: string;
  colon: string;
  usePingFang: boolean;
  audioLang?: string;
  arkhamDbDomain: string;
}

export const LanguageContext = React.createContext<LanguageContextType>({ lang: 'en', useCardTraits: true, listSeperator: ', ', colon: ': ', usePingFang: false, arkhamDbDomain: 'https://arkhamdb.com' });

export default LanguageContext;
