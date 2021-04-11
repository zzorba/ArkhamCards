import React, { useEffect, useMemo, useState } from 'react';
import { EventEmitter } from 'events';
import * as RNLocalize from 'react-native-localize';
import LanguageContext from './LanguageContext';
import { getSystemLanguage } from '@lib/i18n';
import { useSelector } from 'react-redux';
import { getLangChoice } from '@reducers';

interface Props {
  children: React.ReactNode;
}

let eventListener: EventEmitter | null = null;
let currentSystemLang: string | undefined = undefined;

export default function LanguageProvider({ children }: Props) {
  const [systemLang, setSystemLang] = useState<string>(currentSystemLang || getSystemLanguage());
  useEffect(() => {
    if (eventListener === null) {
      // We only want to listen to this once, hence the singleton pattern.
      eventListener = new EventEmitter();
      const callback = () => {
        currentSystemLang = getSystemLanguage();
        eventListener?.emit('langChange', currentSystemLang);
      };
      RNLocalize.addEventListener('change', callback);
    }
    if (!currentSystemLang) {
      currentSystemLang = getSystemLanguage();
    }
    const callback = (systemLang: string) => setSystemLang(systemLang);
    eventListener.addListener('langChange', callback);
    return () => {
      eventListener?.removeListener('langChange', callback);
    };
  }, []);
  const langChoice = useSelector(getLangChoice);
  const lang = langChoice === 'system' ? systemLang : langChoice;
  const context = useMemo(() => {
    return {
      lang,
      useCardTraits: lang !== 'ru',
    };
  }, [lang]);
  return (
    <LanguageContext.Provider value={context}>
      { children }
    </LanguageContext.Provider>
  );
}
