import React, { useMemo } from 'react';
import { useColorScheme } from 'react-native-appearance';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import { setTheme } from './actions';
import { getThemeOverride } from '@reducers';
import { usePickerDialog } from '@components/deck/dialogs';
import DeckPickerStyleButton from '@components/deck/controls/DeckPickerStyleButton';

export default function ThemePicker() {
  const dispatch = useDispatch();
  const override = useSelector(getThemeOverride);
  const systemScheme = useColorScheme();
  const systemSchemeName = systemScheme === 'dark' ? t`Dark` : t`Light`;
  const items: {
    title: string;
    value: 'system' | 'light' | 'dark',
  }[] = [
    {
      title: t`Default (${systemSchemeName})`,
      value: 'system',
    },
    {
      title: t`Light`,
      value: 'light',
    },
    {
      title: t`Dark`,
      value: 'dark',
    },
  ];
  const onThemeChange = (theme: 'light' | 'dark' | 'system') => {
    dispatch(setTheme(theme));
  };
  const valueLabel = useMemo(() => {
    if (!override) {
      return systemSchemeName;
    }
    if (override === 'light') {
      return t`Light`;
    }
    return t`Dark`;
  }, [override, systemSchemeName]);

  const [dialog, showDialog] = usePickerDialog<'light' | 'dark' | 'system'>({
    title: t`Theme`,
    items,
    selectedValue: override || 'system',
    onValueChange: onThemeChange,
  });

  return (
    <>
      <DeckPickerStyleButton
        title={t`Theme`}
        icon="logo"
        editable
        onPress={showDialog}
        valueLabel={valueLabel}
        first
      />
      { dialog }
    </>
  );
}