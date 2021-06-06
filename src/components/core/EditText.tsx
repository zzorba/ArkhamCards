import React, { useCallback } from 'react';
import { Alert, Platform } from 'react-native';
// @ts-ignore TS7016
import DialogAndroid from 'react-native-dialogs';
import { t } from 'ttag';

import PickerStyleButton from './PickerStyleButton';

interface Props {
  title: string;
  dialogDescription?: string;
  placeholder?: string;
  value?: string;
  onValueChange: (text?: string) => void;
  settingsStyle?: boolean;
}

export async function openDialog({
  title,
  dialogDescription,
  value,
  onValueChange,
}: Props) {
  if (Platform.OS === 'ios') {
    Alert.prompt(
      title,
      dialogDescription,
      [
        { text: t`Cancel`, onPress: () => {
          // intentionally empty
        }, style: 'cancel' },
        {
          text: t`Done`,
          onPress: onValueChange,
        },
      ],
      'plain-text',
      (value) || '',
    );
  } else {
    const { action, text } = await DialogAndroid.prompt(title, dialogDescription, {
      defaultValue: value || '',
      positiveText: t`Done`,
      negativeText: t`Cancel`,
      keyboardType: null,
    });
    if (action === DialogAndroid.actionPositive) {
      onValueChange(text);
    }
  }
}

export default function EditText({
  title,
  dialogDescription,
  placeholder,
  value,
  onValueChange,
  settingsStyle,
}: Props) {
  const showDialog = useCallback(
    () => openDialog({ title, dialogDescription, value, onValueChange }),
    [title, dialogDescription, value, onValueChange]
  );
  return (
    <PickerStyleButton
      id="edit"
      title={title}
      value={value || placeholder}
      onPress={showDialog}
      widget="nav"
      settingsStyle={settingsStyle}
    />
  );
}
