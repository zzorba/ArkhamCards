import React from 'react';
import { findIndex, map } from 'lodash';
import { t } from 'ttag';

import { FactionCodeType } from '@app_constants';
import Card from '@data/Card';
import DeckPickerButton from '../DeckPickerButton';

interface Props {
  name: string;
  factions: FactionCodeType[];
  selection: FactionCodeType;
  onChange: (faction: FactionCodeType) => void;
  investigatorFaction: FactionCodeType;
  disabled?: boolean;
  editWarning: boolean;
  first: boolean;
}

export default function FactionSelectPicker({
  factions,
  selection,
  name,
  investigatorFaction,
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

  return (
    <DeckPickerButton
      title={name}
      icon={`class_${selection}`}
      editable={!disabled}
      modalDescription={editWarning ? t`Note: Secondary faction should only be selected at deck creation time, not between scenarios.` : undefined}
      options={map(factions, (faction, index) => {
        return {
          value: index,
          label: Card.factionCodeToName(faction, t`Select Faction`),
        };
      })}
      valueLabel={Card.factionCodeToName(selection, t`Select Faction`)}
      faction={investigatorFaction}
      selectedValue={selection ? findIndex(factions, faction => faction === selection) : 0}
      onChoiceChange={onChoiceChange}
      first={first}
      last
    />
  );
}
