import React from 'react';

export interface LanguageContextType {
  lang: string;
  useCardTraits: boolean;
  listSeperator: string;
  colon: string;
  usePingFang: boolean;
  audioLangs: string[];
  arkhamDbDomain: string;
}

export const LanguageContext = React.createContext<LanguageContextType>({ lang: 'en', useCardTraits: true, listSeperator: ', ', colon: ': ', usePingFang: false, arkhamDbDomain: 'https://arkhamdb.com', audioLangs: [] });

export default LanguageContext;
