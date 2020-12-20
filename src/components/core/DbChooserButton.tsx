import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Navigation } from 'react-native-navigation';
import { Brackets } from 'typeorm/browser';
import { forEach, map } from 'lodash';
import { t } from 'ttag';

import NavButton from './NavButton';
import { SearchSelectProps } from '../cardlist/SearchMultiSelectView';
import COLORS from '@styles/colors';
import DatabaseContext from '@data/DatabaseContext';

interface Props {
  componentId: string;
  title: string;
  field: string;
  query?: Brackets;
  tabooSetId?: number;
  onChange: (selection: string[]) => void;
  selection?: string[];
  indent?: boolean;
  processValue?: (value: string) => string[];
  capitalize?: boolean;
  fixedTranslations?: {
    [key: string]: string;
  };
}
export default function DbChooserButton({ componentId, title, field, onChange, fixedTranslations, selection, indent, query, tabooSetId, processValue, capitalize }: Props) {
  const { db } = useContext(DatabaseContext);
  const [pressed, setPressed] = useState(false);

  const onSelectionChange = useCallback((selection: string[]) => {
    if (fixedTranslations) {
      const reversed: { [key: string]: string } = {};
      forEach(fixedTranslations, (value, key) => {
        reversed[value] = key;
      });
      onChange(map(selection, item => reversed[item]));
    } else {
      onChange(selection);
    }
  }, [onChange, fixedTranslations]);

  const onPress = useCallback(() => {
    setPressed(true);
    db.getDistinctFields(field, query, tabooSetId, processValue).then(values => {
      const actualValues = fixedTranslations ? map(values, item => fixedTranslations[item]) : values;
      const actualSelection = fixedTranslations ? map(selection || [], item => fixedTranslations[item]) : selection;
      Navigation.push<SearchSelectProps>(componentId, {
        component: {
          name: 'SearchFilters.Chooser',
          passProps: {
            placeholder: t`Search ${title}`,
            values: actualValues,
            onChange: onSelectionChange,
            selection: actualSelection,
            capitalize,
          },
          options: {
            topBar: {
              title: {
                text: t`Select ${title}`,
                color: COLORS.M,
              },
              backButton: {
                title: t`Back`,
                color: COLORS.M,
              },
              rightButtons: selection && selection.length > 0 ?
                [{
                  text: t`Clear`,
                  id: 'clear',
                  color: COLORS.M,
                  accessibilityLabel: t`Clear`,
                }] : [],
            },
          },
        },
      });
      setPressed(false);
    });
  }, [capitalize, db, field, componentId, title, fixedTranslations, setPressed, onSelectionChange, selection, processValue, query, tabooSetId]);

  const selectedDescription = useMemo(() => {
    if (!selection || !selection.length) {
      return t`All`;
    }
    return (fixedTranslations ? map(selection, item => fixedTranslations[item]) : selection).join(', ');
  }, [selection, fixedTranslations]);
  return (
    <NavButton
      text={`${title}: ${selectedDescription}`}
      onPress={onPress}
      indent={indent}
      disabled={pressed}
    />
  );
}
