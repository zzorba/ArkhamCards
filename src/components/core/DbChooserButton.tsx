import React, { useCallback, useContext, useMemo, useState } from 'react';

import { Brackets } from 'typeorm/browser';
import { forEach, map, uniq } from 'lodash';
import stable from 'stable';
import { t } from 'ttag';

import NavButton from './NavButton';
import DatabaseContext from '@data/sqlite/DatabaseContext';
import LanguageContext from '@lib/i18n/LanguageContext';
import { useNavigation } from '@react-navigation/native';

interface Props {
  title: string;
  all: string;
  field: string;
  query?: Brackets;
  tabooSetId?: number;
  onChange: (selection: string[]) => void;
  selection?: string[];
  indent?: boolean;
  processValue?: (value: string) => string[];
  capitalize?: boolean;
  fixedTranslations?: {
    [key: string]: string | undefined;
  };
  includeNone?: boolean;
}
export default function DbChooserButton({ title, all, field, includeNone, onChange, fixedTranslations, selection, indent, query, tabooSetId, processValue, capitalize }: Props) {
  const { db } = useContext(DatabaseContext);
  const navigation = useNavigation();
  const { lang, listSeperator, colon } = useContext(LanguageContext);
  const [pressed, setPressed] = useState(false);

  const onSelectionChange = useCallback((selection: string[]) => {
    if (fixedTranslations) {
      const reversed: { [key: string]: string | undefined} = {};
      forEach(fixedTranslations, (value, key) => {
        if (value) {
          reversed[value] = key;
        }
      });
      onChange(map(selection, item => reversed[item] || item));
    } else {
      onChange(selection);
    }
  }, [onChange, fixedTranslations]);

  const onPress = useCallback(() => {
    setPressed(true);
    db.getDistinctFields(field, query, tabooSetId, processValue).then(values => {

      // This code will export all traits in the english database.
      // console.log('const localized_traits = {')
      // forEach(values, value => {
      //  const escaped = value.replace(`'`, `\\'`);
      //  console.log(`  '${escaped}': c('trait').t\`${value}\`,`)
      // });
      // console.log('};')

      const actualValues = fixedTranslations ? map(values, item => fixedTranslations[item] || item) : values;
      const noneString = includeNone && fixedTranslations ? fixedTranslations.none : undefined;

      const actualSelection = uniq(fixedTranslations ? map(selection || [], item => fixedTranslations[item] || item) : selection);
      navigation.navigate('SearchFilters.Chooser', {
        placeholder: t`Search ${title}`,
        values: uniq([
          ...(noneString ? [noneString] : []),
          ...(fixedTranslations ? stable(actualValues.slice(), (a, b) => a.localeCompare(b, lang)) : actualValues),
        ]),
        onChange: onSelectionChange,
        selection: actualSelection,
        capitalize,
        title,
      });
      setPressed(false);
    });
  }, [navigation, capitalize, includeNone, db, field, title, fixedTranslations, lang, setPressed, onSelectionChange, selection, processValue, query, tabooSetId]);

  const selectedDescription = useMemo(() => {
    if (!selection || !selection.length) {
      return all;
    }
    return (fixedTranslations ? map(selection, item => fixedTranslations[item] || item) : selection).join(listSeperator);
  }, [selection, fixedTranslations, all, listSeperator]);
  return (
    <NavButton
      text={`${title}${colon}${selectedDescription}`}
      onPress={onPress}
      indent={indent}
      disabled={pressed}
    />
  );
}
