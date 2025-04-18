import React, { useEffect, useMemo, useState } from 'react';
import { AppState, DeviceEventEmitter, Platform } from 'react-native';
import { find } from 'lodash';
import { useSelector } from 'react-redux';

import LanguageContext, { LanguageContextType } from './LanguageContext';
import { getSystemLanguage } from '@lib/i18n';
import { getAudioLangPreference, getLangChoice, hasDissonantVoices } from '@reducers';
import { useMyProfile } from '@data/remote/hooks';
import { User_Flag_Type_Enum } from '@generated/graphql/apollo-schema';

const NON_LOCALIZED_CARDS = new Set(['en', 'cs', 'vi']);
const NON_ARKHAMDB_CARDS: { [key: string]: string | undefined } = { 'zh-cn': 'zh' };

interface Props {
  children: React.ReactNode;
}

let eventListenerInitialized: boolean = false;
let currentSystemLang: string | undefined = undefined;

const LOCALIZED_CARD_TRAITS = new Set(['fr', 'ru', 'de', 'zh', 'zh-cn', 'ko', 'pl']);

function getListSeperator(lang: string): string {
  switch (lang) {
    case 'zh':
    case 'zh-cn':
      return '、';
    default: return ', ';
  }
}

function getColon(lang: string): string {
  switch (lang) {
    case 'fr': return ' : ';
    default: return ': ';
  }
}

export function getArkhamDbDomain(lang: string): string {
  if (NON_LOCALIZED_CARDS.has(lang)) {
    return 'https://arkhamdb.com';
  }
  const theLang = NON_ARKHAMDB_CARDS[lang] ?? lang;
  return `https://${theLang}.arkhamdb.com`;
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
      AppState.addEventListener('change', callback);
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
  const audioLangChoice = useSelector(getAudioLangPreference);

  const hasDV = useSelector(hasDissonantVoices);
  const [profile] = useMyProfile(true);
  const audioLangs = useMemo(() => {
    switch (audioLangChoice) {
      case 'en':
        if (hasDV) {
          return ['dv', 'en'];
        }
        return ['en'];
      case 'ru':
        return ['ru'];
      case 'pl':
        return ['pl'];
      case 'de':
        return ['de'];
      case 'it':
        return ['it'];
      // This requires access
      case 'es':
        if (find(profile?.flags, f => f === User_Flag_Type_Enum.EsDv)) {
          // ES requires special ArkhamCards access
          return ['es'];
        }
        return [];
      default:
        return [];
    }
  }, [hasDV, profile, audioLangChoice]);

  const context: LanguageContextType = useMemo(() => {
    const majorVersionIOS = Platform.OS === 'ios' ? parseInt(Platform.Version, 10) : 0;
    return {
      lang,
      useCardTraits: !LOCALIZED_CARD_TRAITS.has(lang),
      listSeperator: getListSeperator(lang),
      colon: getColon(lang),
      arkhamDbDomain: getArkhamDbDomain(lang),
      usePingFang: ((lang === 'zh' || lang === 'zh-cn') && Platform.OS === 'ios' && majorVersionIOS >= 13),
      audioLangs,
    };
  }, [lang, audioLangs]);
  return (
    <LanguageContext.Provider value={context}>
      { children }
    </LanguageContext.Provider>
  );
}
