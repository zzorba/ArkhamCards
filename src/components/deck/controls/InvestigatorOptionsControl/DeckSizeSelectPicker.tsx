import React from 'react';
import { findIndex, map } from 'lodash';
import { t } from 'ttag';

import { FactionCodeType } from '@app_constants';
import DeckPickerButton from '@components/deck/controls/DeckPickerButton';

interface Props {
  name: string;
  sizes: string[];
  selection: string;
  onChange: (selection: string) => void;
  investigatorFaction: FactionCodeType;
  disabled?: boolean;
  editWarning: boolean;
  first: boolean;
}

export default function DeckSizeSelectPicker({
  sizes,
  selection,
  name,
  investigatorFaction,
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
  return (
    <DeckPickerButton
      icon="card-outline"
      title={name}
      faction={investigatorFaction}
      editable={!disabled}
      modalDescription={editWarning ? t`Note: Deck size should only be selected at deck creation time, not between scenarios.` : undefined}
      options={map(sizes, (size, index) => {
        return {
          value: index,
          label: size || t`Select Deck Size`,
        };
      })}
      selectedValue={selection ? findIndex(sizes, size => size === selection) : 0}
      onChoiceChange={onChoiceChange}
      valueLabel={valueLabel}
      first={first}
    />
  );
}
