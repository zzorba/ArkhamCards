import React from 'react';

interface LanguageContextType {
  lang: string;

}

export const LanguageContext = React.createContext<LanguageContextType>({ lang: 'en' });

export default LanguageContext;
