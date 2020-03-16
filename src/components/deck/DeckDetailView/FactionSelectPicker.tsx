import React from 'react';
import { map } from 'lodash';
import { SettingsPicker } from 'react-native-settings-components';
import { t } from 'ttag';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import { FactionCodeType, FACTION_COLORS } from 'constants';
import Card from 'data/Card';
import { COLORS } from 'styles/colors';

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
  ref?: SettingsPicker<FactionCodeType>;

  _captureRef = (ref: SettingsPicker<FactionCodeType>) => {
    this.ref = ref;
  };

  _onChange = (selection: FactionCodeType) => {
    this.ref && this.ref.closeModal();
    const {
      onChange,
    } = this.props;
    onChange(selection);
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
    const options = map(factions, faction => {
      return {
        label: this._codeToLabel(faction),
        value: faction,
      };
    });
    const color = investigatorFaction ?
      FACTION_COLORS[investigatorFaction] :
      COLORS.lightBlue;
    return (
      <SettingsPicker
        ref={this._captureRef}
        dialogDescription={editWarning ? t`Note: Secondary faction should only be selected at deck creation time, not between scenarios.` : undefined}
        disabled={disabled}
        disabledOverlayStyle={{
          backgroundColor: 'rgba(255,255,255,0.0)',
        }}
        valueStyle={{
          color: COLORS.darkGray,
        }}
        title={name}
        value={selection}
        valueFormat={this._codeToLabel}
        onValueChange={this._onChange}
        modalStyle={{
          header: {
            wrapper: {
              backgroundColor: color,
            },
            description: {
              paddingTop: 8,
            },
          },
          list: {
            itemColor: color,
          },
        }}
        options={options}
        containerStyle={{
          backgroundColor: 'transparent',
        }}
        widget={
          <MaterialIcons
            name="keyboard-arrow-right"
            size={30}
            color={COLORS.darkGray}
          />
        }
      />
    );
  }
}
