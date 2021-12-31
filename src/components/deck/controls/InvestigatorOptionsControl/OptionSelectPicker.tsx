import React from 'react';
import { find, map } from 'lodash';
import { t } from 'ttag';

import { usePickerDialog } from '@components/deck/dialogs';
import DeckPickerStyleButton from '../DeckPickerStyleButton';
import DeckOption, { localizeOptionName } from '@data/types/DeckOption';

interface Props {
  name: string;
  options: (DeckOption & { id: string })[];
  selection: string;
  onChange: (selection: string) => void;
  disabled?: boolean;
  editWarning: boolean;
  first: boolean;
  last?: boolean;
}

export default function OptionSelectPicker({
  options,
  selection,
  name,
  disabled,
  editWarning,
  onChange,
  first,
  last,
}: Props) {
  const onChoiceChange = (id: string | null) => {
    if (id === null) {
      return;
    }
    onChange(id);
  };
  const valueLabel = (find(options, o => o.id === selection) || options[0]).real_name;
  const [dialog, showDialog] = usePickerDialog({
    title: t`Select Deck Size`,
    description: editWarning ? t`Note: Deck size should only be selected at deck creation time, not between scenarios.` : undefined,
    items: map(options, (option, index) => {
      return {
        title: localizeOptionName(option.real_name || `${index}`),
        value: option.id,
      };
    }),
    selectedValue: selection || options[0].id,
    onValueChange: onChoiceChange,
  });
  return (
    <>
      <DeckPickerStyleButton
        title={name}
        icon="special_cards"
        editable={!disabled}
        onPress={showDialog}
        valueLabel={valueLabel}
        first={first}
        last={last}
      />
      { dialog }
    </>
  );
}
