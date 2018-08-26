import I18n from 'react-native-i18n';

const translations = require('./translations.json');
I18n.fallbacks = true;

I18n.translations = translations;

export default function(value, variables = {}) {
  return I18n.t(value, Object.assign({ defaultValue: value }, variables));
}

export function changeLocale(locale) {
  I18n.locale = locale;
}
