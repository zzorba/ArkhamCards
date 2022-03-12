import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Navigation } from 'react-native-navigation';
import { values, map, forEach } from 'lodash';
import { t } from 'ttag';
import stable from 'stable';

import { SearchSelectProps } from '@components/cardlist/SearchMultiSelectView';
import StyleContext from '@styles/StyleContext';
import NavButton from '@components/core/NavButton';
import LanguageContext from '@lib/i18n/LanguageContext';

interface Props {
  componentId: string;
  title: string;
  all: string;
  selection?: string[];
  setting: string;
  onFilterChange: (setting: string, selection: string[]) => void;
  indent?: boolean;
  allValues: {
    [key: string]: string;
  };
}

export default function FixedSetChooserButton({
  componentId,
  title,
  all,
  selection,
  setting,
  onFilterChange,
  indent,
  allValues,
}: Props) {
  const { colors } = useContext(StyleContext);
  const { listSeperator, colon, lang } = useContext(LanguageContext);
  const reversedValues = useMemo(() => {
    const reversed: { [key: string]: string } = {};
    forEach(allValues, (value, key) => {
      reversed[value] = key;
    });
    return reversed;
  }, [allValues]);
  const onChange = useCallback((values: string[]) => {
    onFilterChange(setting, map(values, value => reversedValues[value]));
  }, [onFilterChange, setting, reversedValues]);
  const [pressed, setPressed] = useState(false);
  const onPress = useCallback(() => {
    setPressed(true);
    Navigation.push<SearchSelectProps>(componentId, {
      component: {
        name: 'SearchFilters.Chooser',
        passProps: {
          placeholder: t`Search ${title}`,
          values: stable(values(allValues), (a, b) => a.localeCompare(b, lang)),
          onChange,
          selection: map(selection, item => allValues[item]),
        },
        options: {
          topBar: {
            title: {
              text: t`Select ${title}`,
              color: colors.M,
            },
            backButton: {
              title: t`Back`,
              color: colors.M,
            },
            rightButtons: selection && selection.length > 0 ?
              [{
                text: t`Clear`,
                id: 'clear',
                color: colors.M,
                accessibilityLabel: t`Clear`,
              }] : [],
          },
        },
      },
    });
    setPressed(false);
  }, [allValues, colors, lang, componentId, title, setPressed, onChange, selection]);
  const selectedDescription = useMemo(
    () => selection && selection.length ? map(selection, item => allValues[item]).join(listSeperator) : all,
    [allValues, selection, listSeperator, all]
  );
  return (
    <NavButton
      text={`${title}${colon}${selectedDescription}`}
      onPress={onPress}
      indent={indent}
      disabled={pressed}
    />
  );
}
