import React, { useContext } from 'react';
import { findIndex } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import { setFontSize } from './actions';
import { getAppFontScale } from '@reducers';
import SinglePickerComponent from '@components/core/SinglePickerComponent';
import StyleContext from '@styles/StyleContext';
import COLORS from '@styles/colors';

export default function ThemePicker() {
  const dispatch = useDispatch();
  const { colors } = useContext(StyleContext);
  const fontScale = useSelector(getAppFontScale);
  const choices: {
    text: string;
    value: number;
  }[] = [
    {
      text: t`Smaller`,
      value: 0.9,
    },
    {
      text: t`Default`,
      value: 1.0,
    },
    {
      text: t`Medium`,
      value: 1.1,
    },
    {
      text: t`Large`,
      value: 1.25,
    },
    {
      text: t`X-Large`,
      value: 1.4,
    },
    {
      text: t`XX-Large`,
      value: 1.6,
    },
  ];
  const onThemeChange = (index: number | null) => {
    if (index === null) {
      return;
    }
    dispatch(setFontSize(choices[index].value));
  };
  return (
    <SinglePickerComponent
      title={t`Font Size`}
      onChoiceChange={onThemeChange}
      selectedIndex={findIndex(choices, x => fontScale === x.value)}
      choices={choices}
      colors={{
        modalColor: COLORS.lightBlue,
        modalTextColor: '#FFF',
        backgroundColor: colors.background,
        textColor: colors.darkText,
      }}
      description={t`This can be used to make the app font size larger, though it may impact layout on some screens.`}
      editable
      settingsStyle
      hideWidget
    />
  );
}