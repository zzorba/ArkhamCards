import React, { useEffect, useMemo, useState } from 'react';
import { DeviceEventEmitter, Platform } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import LanguageContext from './LanguageContext';
import { getSystemLanguage } from '@lib/i18n';
import { useSelector } from 'react-redux';
import { getLangChoice } from '@reducers';

interface Props {
  children: React.ReactNode;
}

let eventListenerInitialized: boolean = false;
let currentSystemLang: string | undefined = undefined;

const LOCALIZED_CARD_TRAITS = new Set(['fr', 'ru', 'de', 'zh']);

function getListSeperator(lang: string): string {
  switch (lang) {
    case 'zh': return '、';
    default: return ', ';
  }
}

export default function LanguageProvider({ children }: Props) {
  const [systemLang, setSystemLang] = useState<string>(currentSystemLang || getSystemLanguage());
  useEffect(() => {
    if (!eventListenerInitialized) {
      // We only want to listen to this once, hence the singleton pattern.
      const callback = () => {
        currentSystemLang = getSystemLanguage();
        DeviceEventEmitter.emit('langChange', currentSystemLang);
      };
      RNLocalize.addEventListener('change', callback);
      eventListenerInitialized = true;
    }
    if (!currentSystemLang) {
      currentSystemLang = getSystemLanguage();
    }
    const callback = (systemLang: string) => setSystemLang(systemLang);
    const sub = DeviceEventEmitter.addListener('langChange', callback);
    return () => {
      sub.remove();
    };
  }, []);
  const langChoice = useSelector(getLangChoice);
  const lang = langChoice === 'system' ? systemLang : langChoice;
  const context = useMemo(() => {
    const majorVersionIOS = Platform.OS === 'ios' ? parseInt(Platform.Version, 10) : 0;
    return {
      lang,
      useCardTraits: !LOCALIZED_CARD_TRAITS.has(lang),
      listSeperator: getListSeperator(lang),
      usePingFang: (lang === 'zh' && Platform.OS === 'ios' && majorVersionIOS >= 13),
    };
  }, [lang]);
  return (
    <LanguageContext.Provider value={context}>
      { children }
    </LanguageContext.Provider>
  );
}
