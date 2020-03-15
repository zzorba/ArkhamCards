import React from 'react';
import { find, map } from 'lodash';
import Realm, { Results } from 'realm';
import { connectRealm, TabooSetResults } from 'react-native-realm';
import { SettingsPicker } from 'react-native-settings-components';
import { t } from 'ttag';

import Card from 'data/Card';
import TabooSet from 'data/TabooSet';
import { FACTION_COLORS } from 'constants';
import { COLORS } from 'styles/colors';
import { Choice } from 'data/scenario/types';

interface Props {
  investigator: Card;
  choices: Choice[];
  choice: number;
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
  }

  render() {
    const {
      investigator,
      choices,
      choice,
    } = this.props;
    const options = [
      { value: -1, label: '' },
      ...map(choices, (choice, idx) => {
        return {
          label: choice.text,
          value: idx,
        };
      }),
    ];
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
        valueStyle={{
          color: COLORS.darkGray,
        }}
        containerStyle={{
          backgroundColor: 'transparent',
        }}
      />
    );
  }
}
