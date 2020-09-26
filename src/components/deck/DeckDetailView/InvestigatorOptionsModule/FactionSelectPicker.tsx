import React, { useContext } from 'react';
import { findIndex, map } from 'lodash';
import { t } from 'ttag';

import SinglePickerComponent from '@components/core/SinglePickerComponent';
import { FactionCodeType } from '@app_constants';
import Card from '@data/Card';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';

interface Props {
  name: string;
  factions: FactionCodeType[];
  selection?: FactionCodeType;
  onChange: (faction: FactionCodeType) => void;
  investigatorFaction?: FactionCodeType;
  disabled?: boolean;
  editWarning: boolean;
}

export default function FactionSelectPicker({
  factions,
  selection,
  name,
  investigatorFaction,
  disabled,
  editWarning,
  onChange,
}: Props){
  const { colors } = useContext(StyleContext);
  const onChoiceChange = (index: number) => {
    onChange(factions[index]);
  };

  return (
    <SinglePickerComponent
      settingsStyle
      title={name}
      editable={!disabled}
      description={editWarning ? t`Note: Secondary faction should only be selected at deck creation time, not between scenarios.` : undefined}
      colors={{
        modalColor: investigatorFaction ?
          colors.faction[investigatorFaction].background :
          COLORS.lightBlue,
        modalTextColor: 'white',
        backgroundColor: 'transparent',
        textColor: colors.darkText,
      }}
      choices={map(factions, faction => {
        return {
          text: Card.factionCodeToName(faction, t`Select Faction`),
        };
      })}
      selectedIndex={selection ? findIndex(factions, faction => faction === selection) : 0}
      onChoiceChange={onChoiceChange}
      noBorder
    />
  );
}
