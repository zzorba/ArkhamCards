import React, { useCallback, useContext, useMemo, useState } from 'react';

import { values, map, forEach } from 'lodash';
import { t } from 'ttag';
import stable from 'stable';

import NavButton from '@components/core/NavButton';
import LanguageContext from '@lib/i18n/LanguageContext';
import { useNavigation } from '@react-navigation/native';

interface Props {
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
  title,
  all,
  selection,
  setting,
  onFilterChange,
  indent,
  allValues,
}: Props) {
  const navigation = useNavigation();
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
    navigation.navigate('SearchFilters.Chooser', {
      placeholder: t`Search ${title}`,
      title,
      values: stable(values(allValues), (a, b) => a.localeCompare(b, lang)),
      onChange,
      selection: map(selection, item => allValues[item]),
    });
    setPressed(false);
  }, [navigation, allValues, lang, title, setPressed, onChange, selection]);
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
