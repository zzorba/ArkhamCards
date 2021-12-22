import React from 'react';
import { findIndex, map } from 'lodash';
import { ngettext, msgid, t } from 'ttag';

import { usePickerDialog } from '@components/deck/dialogs';
import DeckPickerStyleButton from '../DeckPickerStyleButton';

interface Props {
  name: string;
  sizes: string[];
  selection: string;
  onChange: (selection: string) => void;
  disabled?: boolean;
  editWarning: boolean;
  first: boolean;
}

export default function DeckSizeSelectPicker({
  sizes,
  selection,
  name,
  disabled,
  editWarning,
  onChange,
  first,
}: Props) {
  const onChoiceChange = (index: number | null) => {
    if (index === null) {
      return;
    }
    onChange(sizes[index]);
  };
  const cardCount = selection;
  const valueLabel = t`${cardCount} Cards`;
  const [dialog, showDialog] = usePickerDialog({
    title: t`Select Deck Size`,
    description: editWarning ? t`Note: Deck size should only be selected at deck creation time, not between scenarios.` : undefined,
    items: map(sizes, (size, index) => {
      const sizeCount = parseInt(size, 10);
      return {
        title: ngettext(
          msgid`${size} Card`,
          `${size} Cards`,
          sizeCount
        ),
        value: index,
      };
    }),
    selectedValue: selection ? findIndex(sizes, size => size === selection) : 0,
    onValueChange: onChoiceChange,
  });
  return (
    <>
      <DeckPickerStyleButton
        title={name}
        icon="card-outline"
        editable={!disabled}
        onPress={showDialog}
        valueLabel={valueLabel}
        first={first}
      />
      { dialog }
    </>
  );
}
