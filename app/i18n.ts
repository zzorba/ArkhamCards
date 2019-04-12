import { addLocale, useLocale } from 'ttag';

function getTranslationObj(locale: string) {
  switch (locale) {
    case 'es': return require('../assets/es.po.json');
    case 'de': return require('../assets/de.po.json');
    case 'fr': return require('../assets/fr.po.json');
    case 'it': return require('../assets/it.po.json');
    case 'en':
    default:
      return require('../assets/en.po.json');
  }
}

export function changeLocale(locale: string) {
  const translationObj = getTranslationObj(locale);
  addLocale(locale, translationObj);
  useLocale(locale);
}
