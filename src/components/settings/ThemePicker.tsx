import React, { useContext } from 'react';
import { useColorScheme } from 'react-native-appearance';
import { findIndex } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import { setTheme } from './actions';
import { getThemeOverride } from '@reducers';
import SinglePickerComponent from '@components/core/SinglePickerComponent';
import StyleContext from '@styles/StyleContext';
import COLORS from '@styles/colors';
import { InteractionManager } from 'react-native';

export default function ThemePicker() {
  const dispatch = useDispatch();
  const { colors } = useContext(StyleContext);
  const override = useSelector(getThemeOverride);
  const systemScheme = useColorScheme();
  const systemSchemeName = systemScheme === 'dark' ? t`Dark` : t`Light`;
  const choices: {
    text: string;
    value: 'system' | 'light' | 'dark',
  }[] = [
    {
      text: t`Default (${systemSchemeName})`,
      value: 'system',
    },
    {
      text: t`Light`,
      value: 'light',
    },
    {
      text: t`Dark`,
      value: 'dark',
    },
  ];
  const onThemeChange = (index: number | null) => {
    if (index === null) {
      return;
    }
    dispatch(setTheme(choices[index].value));
  };
  const formatLabel = (index: number) => {
    switch (index) {
      case 0:
        return systemSchemeName;
      case 1:
        return t`Light`;
      case 2:
      default:
        return t`Dark`;
    }
  };
  return (
    <SinglePickerComponent
      title={t`Theme`}
      onChoiceChange={onThemeChange}
      selectedIndex={findIndex(choices, x => !override ? x.value === 'system' : x.value === override)}
      choices={choices}
      colors={{
        modalColor: COLORS.lightBlue,
        modalTextColor: '#FFF',
        backgroundColor: colors.background,
        textColor: colors.darkText,
      }}
      editable
      settingsStyle
      hideWidget
      formatLabel={formatLabel}
    />
  );
}