const { extractFromFiles, findMissing } = require('i18n-extract');

const translations = require('../app/translations.json');

const keys = extractFromFiles([
  'app/*.js',
  'components/**/*.js',
  'data/*.js',
  'constants/*.js',
], {
  marker: 'L',
});

const locales = ['en', 'de', 'es', 'it', 'fr'];
console.log('{\n');
locales.forEach(locale => {
  const currentTranslations = translations[locale];
  const missing = findMissing(currentTranslations, keys);
  const newTranslations = Object.assign({}, currentTranslations);
  missing.forEach(key => {
    newTranslations[key.key] = key.key;
  });
  console.log(`  "${locale}": ${JSON.stringify(newTranslations, null, 4)}${locales.indexOf(locale) === locales.length - 1 ? '' : ','}`);
});

console.log('}\n');
