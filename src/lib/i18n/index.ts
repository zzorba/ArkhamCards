import { findBestLanguageTag } from 'react-native-localize';

export const ALL_LANGUAGES = [
  'es',
  'ru',
  'en',
  'de',
  'fr',
  'pl',
  'ko',
  'zh',
  'zh-cn',
  'it',
  'pt',
  'vi',
  'uk',
  'cs',
];

export const AUDIO_LANGUAGES = ['en', 'ru', 'de', 'pl', 'es'];

export function getSystemLanguage() {
  const systemLang = findBestLanguageTag(ALL_LANGUAGES);
  if (systemLang) {
    return systemLang.languageTag;
  }
  return 'en';
}

export function localizedName(lang: string) {
  switch (lang) {
    case 'en':
      return 'English';
    case 'es':
      return 'Español';
    case 'de':
      return 'Deutsch';
    case 'it':
      return 'Italiano';
    case 'fr':
      return 'Français';
    case 'ko':
      return '한국어';
    case 'uk':
      return 'Українська';
    case 'pl':
      return 'Polski';
    case 'ru':
      return 'Pусский';
    case 'pt':
      return 'Português';
    case 'zh':
      return '中文';
    case 'zh-cn':
      return '简体中文';
    case 'vi':
      return 'tiếng Việt';
    case 'cs':
      return 'Čeština';
    default:
      return 'Unknown';
  }
}
