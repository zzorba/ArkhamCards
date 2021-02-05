import React, { useCallback } from 'react';

import { ShowCountDialog } from '@components/deck/dialogs';
import MiniPickerStyleButton from '@components/deck/controls/MiniPickerStyleButton';
import PickerStyleButton from '@components/core/PickerStyleButton';
import DeckPickerStyleButton from '@components/deck/controls/DeckPickerStyleButton';

interface Props {
  countChanged: (index: number, count: number) => void;
  showCountDialog: ShowCountDialog;
  index: number;
  title: string;
  icon?: string;
  count?: number;
  first?: boolean;
  last?: boolean;
}

export default function EditCountComponent({
  countChanged,
  showCountDialog,
  index,
  icon,
  title,
  count: initialCount,
  first,
  last,
}: Props) {
  const updateCount = useCallback((value: number) => {
    countChanged(index, value);
  }, [index, countChanged]);
  const onPress = useCallback(() => {
    showCountDialog({
      title,
      label: title,
      value: initialCount || 0,
      update: updateCount,
      min: 0,
    });
  }, [title, initialCount, updateCount, showCountDialog]);
  return (
    <DeckPickerStyleButton
      icon={icon}
      title={title}
      valueLabel={`${initialCount || 0}`}
      first={first}
      last={last}
      editable
      onPress={onPress}
    />
  );
}
