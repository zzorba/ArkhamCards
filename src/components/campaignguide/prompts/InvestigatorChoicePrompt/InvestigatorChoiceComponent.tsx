import React from 'react';
import { map } from 'lodash';
import { SettingsPicker } from 'react-native-settings-components';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import Card from 'data/Card';
import { FACTION_COLORS } from 'constants';
import { Choice } from 'data/scenario/types';

interface Props {
  investigator: Card;
  choices: Choice[];
  choice: number;
  optional: boolean;
  onChoiceChange: (code: string, index: number) => void;
}

export default class InvestigatorChoiceComponent extends React.Component<Props> {
  pickerRef?: SettingsPicker<number>;

  _capturePickerRef = (ref: SettingsPicker<number>) => {
    this.pickerRef = ref;
  }

  _onChoiceChange = (idx: number) => {
    this.pickerRef && this.pickerRef.closeModal();
    const {
      onChoiceChange,
      investigator,
    } = this.props;
    onChoiceChange(
      investigator.code,
      idx
    );
  };

  _choiceToLabel = (idx: number) => {
    if (idx === -1) {
      return '';
    }
    const { choices } = this.props;
    const choice = choices[idx];
    if (choice) {
      return choice.text;
    }
    return '';
  };

  render() {
    const {
      investigator,
      choices,
      choice,
      optional,
    } = this.props;
    const passedOptions = [
      ...map(choices, (choice, idx) => {
        return {
          label: choice.text,
          value: idx,
        };
      }),
    ];
    const options = optional ? [
      { value: -1, label: '' },
      ...passedOptions,
    ] : passedOptions;
    const color = FACTION_COLORS[investigator.factionCode()];
    return (
      <SettingsPicker
        ref={this._capturePickerRef}
        title={investigator.name}
        value={choice}
        valuePlaceholder={''}
        valueFormat={this._choiceToLabel}
        onValueChange={this._onChoiceChange}
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
        disabledOverlayStyle={{
          backgroundColor: 'rgba(255,255,255,0.0)',
        }}
        titleStyle={{
          color: '#FFF',
          fontWeight: '700',
        }}
        valueStyle={{
          color: '#FFF',
          fontWeight: '400',
        }}
        containerStyle={{
          backgroundColor: color,
        }}
        widget={
          <MaterialIcons
            name="keyboard-arrow-right"
            size={30}
            color="#FFF"
          />
        }
      />
    );
  }
}
