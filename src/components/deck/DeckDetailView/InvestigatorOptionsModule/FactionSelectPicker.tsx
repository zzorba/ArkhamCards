import React from 'react';
import { findIndex, map } from 'lodash';
import { t } from 'ttag';

import SinglePickerComponent from '@components/core/SinglePickerComponent';
import { FactionCodeType } from '@app_constants';
import Card from '@data/Card';
import COLORS from '@styles/colors';

interface Props {
  name: string;
  factions: FactionCodeType[];
  selection?: FactionCodeType;
  onChange: (faction: FactionCodeType) => void;
  investigatorFaction?: FactionCodeType;
  disabled?: boolean;
  editWarning: boolean;
}

export default class FactionSelectPicker extends React.Component<Props> {
  _onChange = (index: number) => {
    const {
      onChange,
      factions,
    } = this.props;
    onChange(factions[index]);
  };

  _codeToLabel = (faction: string) => {
    return Card.factionCodeToName(faction, t`Select Faction`);
  };

  render() {
    const {
      factions,
      selection,
      name,
      investigatorFaction,
      disabled,
      editWarning,
    } = this.props;
    return (
      <SinglePickerComponent
        settingsStyle
        title={name}
        editable={!disabled}
        description={editWarning ? t`Note: Secondary faction should only be selected at deck creation time, not between scenarios.` : undefined}
        colors={{
          modalColor: investigatorFaction ?
            COLORS.faction[investigatorFaction].background :
            COLORS.lightBlue,
          modalTextColor: 'white',
          backgroundColor: 'transparent',
          textColor: COLORS.darkText,
        }}
        choices={map(factions, size => {
          return {
            text: this._codeToLabel(size),
          };
        })}
        selectedIndex={selection ? findIndex(factions, faction => faction === selection) : 0}
        onChoiceChange={this._onChange}
        noBorder
      />
    );
  }
}
