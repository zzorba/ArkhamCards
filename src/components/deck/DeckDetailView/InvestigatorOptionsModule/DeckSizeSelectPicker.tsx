import React, { useContext } from 'react';
import { findIndex, map } from 'lodash';
import { t } from 'ttag';

import SinglePickerComponent from '@components/core/SinglePickerComponent';
import { FactionCodeType } from '@app_constants';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';

interface Props {
  name: string;
  sizes: string[];
  selection?: string;
  onChange: (selection: string) => void;
  investigatorFaction?: FactionCodeType;
  disabled?: boolean;
  editWarning: boolean;
}

export default function DeckSizeSelectPicker({
  sizes,
  selection,
  name,
  investigatorFaction,
  disabled,
  editWarning,
  onChange,
}: Props) {
  const { colors } = useContext(StyleContext);
  const onChoiceChange = (index: number) => {
    onChange(sizes[index]);
  };

  return (
    <SinglePickerComponent
      title={name}
      editable={!disabled}
      description={editWarning ? t`Note: Deck size should only be selected at deck creation time, not between scenarios.` : undefined}
      colors={{
        modalColor: investigatorFaction ?
          colors.faction[investigatorFaction].background :
          COLORS.lightBlue,
        modalTextColor: 'white',
        backgroundColor: 'transparent',
        textColor: colors.darkText,
      }}
      settingsStyle
      choices={map(sizes, size => {
        return {
          text: size || t`Select Deck Size`,
        };
      })}
      selectedIndex={selection ? findIndex(sizes, size => size === selection) : 0}
      onChoiceChange={onChoiceChange}
      noBorder
    />
  );
}
