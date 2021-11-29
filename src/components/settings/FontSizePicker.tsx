import React, { useCallback } from 'react';
import { find } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import { setFontSize } from './actions';
import { getAppFontScale } from '@reducers';
import { usePickerDialog } from '@components/deck/dialogs';
import DeckPickerStyleButton from '@components/deck/controls/DeckPickerStyleButton';

export default function ThemePicker() {
  const dispatch = useDispatch();
  const fontScale = useSelector(getAppFontScale);
  const items: {
    title: string;
    value: number;
  }[] = [
    {
      title: t`Smaller`,
      value: 0.9,
    },
    {
      title: t`Default`,
      value: 1.0,
    },
    {
      title: t`Medium`,
      value: 1.1,
    },
    {
      title: t`Large`,
      value: 1.25,
    },
    {
      title: t`X-Large`,
      value: 1.4,
    },
    {
      title: t`XX-Large`,
      value: 1.6,
    },
  ];
  const onFontScaleChange = useCallback((value: number) => {
    dispatch(setFontSize(value));
  }, [dispatch]);


  const [dialog, showDialog] = usePickerDialog<number>({
    title: t`Font Size`,
    description: t`This can be used to make the app font size larger, though it may impact layout on some screens.`,
    items,
    selectedValue: fontScale,
    onValueChange: onFontScaleChange,
  });


  return (
    <>
      <DeckPickerStyleButton
        title={t`Font Size`}
        icon="font-size"
        editable
        onPress={showDialog}
        valueLabel={find(items, item => item.value === fontScale)?.title || t`Default`}
        last
      />
      { dialog }
    </>
  );
}