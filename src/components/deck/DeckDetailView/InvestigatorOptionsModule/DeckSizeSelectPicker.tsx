import React from 'react';
import { findIndex, map } from 'lodash';
import { t } from 'ttag';

import SinglePickerComponent from '@components/core/SinglePickerComponent';
import { FactionCodeType } from '@app_constants';
import COLORS from '@styles/colors';

interface Props {
  name: string;
  sizes: string[];
  selection?: string;
  onChange: (selection: string) => void;
  investigatorFaction?: FactionCodeType;
  disabled?: boolean;
  editWarning: boolean;
}

export default class DeckSizeSelectPicker extends React.Component<Props> {
  _onChange = (index: number) => {
    const {
      onChange,
      sizes,
    } = this.props;
    onChange(sizes[index]);
  };

  _codeToLabel = (size?: string) => {
    return size || t`Select Deck Size`;
  };

  render() {
    const {
      sizes,
      selection,
      name,
      investigatorFaction,
      disabled,
      editWarning,
    } = this.props;
    return (
      <SinglePickerComponent
        title={name}
        editable={!disabled}
        description={editWarning ? t`Note: Deck size should only be selected at deck creation time, not between scenarios.` : undefined}
        colors={{
          modalColor: investigatorFaction ?
            COLORS.faction[investigatorFaction].background :
            COLORS.lightBlue,
          modalTextColor: 'white',
          backgroundColor: 'transparent',
          textColor: COLORS.darkText,
        }}
        settingsStyle
        choices={map(sizes, size => {
          return {
            text: this._codeToLabel(size),
          };
        })}
        selectedIndex={selection ? findIndex(sizes, size => size === selection) : 0}
        onChoiceChange={this._onChange}
        noBorder
      />
    );
  }
}
