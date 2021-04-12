import React from 'react';
import { findIndex, map } from 'lodash';
import { t } from 'ttag';

import { FactionCodeType } from '@app_constants';
import Card from '@data/types/Card';
import DeckPickerStyleButton from '@components/deck/controls/DeckPickerStyleButton';
import { usePickerDialog } from '@components/deck/dialogs';

interface Props {
  name: string;
  factions: FactionCodeType[];
  selection: FactionCodeType;
  onChange: (faction: FactionCodeType) => void;
  disabled?: boolean;
  editWarning: boolean;
  first: boolean;
}

export default function FactionSelectPicker({
  factions,
  selection,
  name,
  disabled,
  editWarning,
  onChange,
  first,
}: Props){
  const onChoiceChange = (index: number | null) => {
    if (index === null) {
      return;
    }
    onChange(factions[index]);
  };
  const { showDialog, dialog } = usePickerDialog({
    title: t`Select Faction`,
    description: editWarning ? t`Note: Secondary faction should only be selected at deck creation time, not between scenarios.` : undefined,
    items: map(factions, (faction, index) => {
      return {
        icon: t`class_${faction}`,
        title: Card.factionCodeToName(faction, t`Select Faction`),
        value: index,
      };
    }),
    selectedValue: selection ? findIndex(factions, faction => faction === selection) : 0,
    onValueChange: onChoiceChange,
  });
  return (
    <>
      <DeckPickerStyleButton
        title={name}
        icon={`class_${selection}`}
        editable={!disabled}
        onPress={showDialog}
        valueLabel={Card.factionCodeToName(selection, t`Select Faction`)}
        first={first}
        last
      />
      { dialog }
    </>
  );
}
