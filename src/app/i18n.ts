import { addLocale, useLocale } from 'ttag';

function getTranslationObj(locale: string) {
  switch (locale) {
    case 'es': return require('../../assets/i18n/es.po.json');
    case 'de': return require('../../assets/i18n/de.po.json');
    case 'fr': return require('../../assets/i18n/fr.po.json');
    case 'it': return require('../../assets/i18n/it.po.json');
    case 'ko': return require('../../assets/i18n/ko.po.json');
    case 'uk': return require('../../assets/i18n/uk.po.json');
    case 'pl': return require('../../assets/i18n/pl.po.json');
    case 'en':
    default:
      return require('../../assets/i18n/en.po.json');
  }
}

export function changeLocale(locale: string) {
  console.log(locale);
  const translationObj = getTranslationObj(locale);
  addLocale(locale, translationObj);
  useLocale(locale);
}
