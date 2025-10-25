import React, { useCallback } from 'react';
import Alert from '@blazejkustra/react-native-alert';
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
