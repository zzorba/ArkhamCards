import React, { useCallback, useContext } from 'react';

import { t } from 'ttag';
import NavButton from './NavButton';
import LanguageContext from '@lib/i18n/LanguageContext';
import { useNavigation } from '@react-navigation/native';

interface Props {
  all: string;
  title: string;
  values: string[];
  onChange: (selection: string[]) => void;
  selection?: string[];
  indent?: boolean;
}

export default function ChooserButton({ title, values, onChange, selection, indent, all }: Props) {
  const navigation = useNavigation();
  const { listSeperator, colon } = useContext(LanguageContext);
  const onPress = useCallback(() => {
    navigation.navigate('SearchFilters.Chooser', {
      title,
      placeholder: t`Search ${title}`,
      values,
      onChange,
      selection,
    });
  }, [navigation, title, values, onChange, selection]);
  return (
    <NavButton
      text={`${title}${colon}${selection && selection.length ? selection.join(listSeperator) : all}`}
      onPress={onPress}
      indent={indent}
    />
  );
}
