import React, { useEffect, useMemo, useState } from 'react';
import { DeviceEventEmitter, Platform } from 'react-native';
import { find } from 'lodash';
import * as RNLocalize from 'react-native-localize';
import { useSelector } from 'react-redux';

import LanguageContext from './LanguageContext';
import { getSystemLanguage } from '@lib/i18n';
import { getLangChoice, hasDissonantVoices } from '@reducers';
import { useMyProfile } from '@data/remote/hooks';
import { User_Flag_Type_Enum } from '@generated/graphql/apollo-schema';

interface Props {
  children: React.ReactNode;
}

let eventListenerInitialized: boolean = false;
let currentSystemLang: string | undefined = undefined;

const LOCALIZED_CARD_TRAITS = new Set(['fr', 'ru', 'de', 'zh', 'ko']);

function getListSeperator(lang: string): string {
  switch (lang) {
    case 'zh': return '、';
    default: return ', ';
  }
}

function getColon(lang: string): string {
  switch (lang) {
    case 'fr': return ' : ';
    default: return ': ';
  }
}

function getArkhamDbDomain(lang: string): string {
  switch (lang) {
    case 'pt':
    case 'en':
      return 'https://arkhamdb.com';
    default:
      return `https://${lang}.arkhamdb.com`;
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

  const hasDV = useSelector(hasDissonantVoices);
  const [profile] = useMyProfile(true);
  const audioLang = useMemo(() => {
    if (hasDV) {
      // DV sign in controls everything here.
      return 'dv';
    }
    switch (lang) {
      case 'ru':
        // RU is free.
        return 'ru';
      case 'es':
        if (find(profile?.flags, f => f === User_Flag_Type_Enum.EsDv)) {
          // ES requires special ArkhamCards access
          return 'es';
        }
        return undefined;
      default:
        return undefined;
    }
  }, [hasDV, profile, lang]);

  const context = useMemo(() => {
    const majorVersionIOS = Platform.OS === 'ios' ? parseInt(Platform.Version, 10) : 0;
    return {
      lang,
      useCardTraits: !LOCALIZED_CARD_TRAITS.has(lang),
      listSeperator: getListSeperator(lang),
      colon: getColon(lang),
      arkhamDbDomain: getArkhamDbDomain(lang),
      usePingFang: (lang === 'zh' && Platform.OS === 'ios' && majorVersionIOS >= 13),
      audioLang,
    };
  }, [lang, audioLang]);
  return (
    <LanguageContext.Provider value={context}>
      { children }
    </LanguageContext.Provider>
  );
}
