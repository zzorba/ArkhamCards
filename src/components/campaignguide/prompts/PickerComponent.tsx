import React from 'react';
import { map } from 'lodash';
import { SettingsPicker } from 'react-native-settings-components';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import { Choice } from 'data/scenario/types';
import { COLORS } from 'styles/colors';

interface Props {
  choices: Choice[];
  description?: string;
  selectedIndex?: number;
  onChoiceChange: (index: number) => void;
  title: string;
  optional?: boolean;
  editable: boolean;
  colors?: {
    backgroundColor: string;
    textColor: string;
  };
  defaultLabel?: string;
}

export default class PickerComponent extends React.Component<Props> {
  pickerRef?: SettingsPicker<number>;

  _capturePickerRef = (ref: SettingsPicker<number>) => {
    this.pickerRef = ref;
  }

  _onChoiceChange = (idx: number) => {
    this.pickerRef && this.pickerRef.closeModal();
    this.props.onChoiceChange(idx);
  };

  _choiceToLabel = (idx: number): string => {
    const { choices, defaultLabel } = this.props;
    if (idx === -1) {
      return defaultLabel || '';
    }
    const choice = choices[idx];
    if (choice) {
      return choice.text || choice.flavor || 'Unknown text';
    }
    return '';
  };

  render() {
    const {
      choices,
      selectedIndex,
      optional,
      editable,
      title,
      colors,
      description,
      defaultLabel,
    } = this.props;
    const passedOptions = [
      ...map(choices, (choice, idx) => {
        return {
          label: choice.text || '',
          value: idx,
        };
      }),
    ];
    const options = optional ? [
      { value: -1, label: defaultLabel || '' },
      ...passedOptions,
    ] : passedOptions;
    return (
      <SettingsPicker
        ref={this._capturePickerRef}
        title={title}
        dialogDescription={description}
        value={selectedIndex}
        valuePlaceholder={''}
        valueFormat={this._choiceToLabel}
        onValueChange={this._onChoiceChange}
        disabled={!editable}
        modalStyle={{
          header: {
            wrapper: {
              backgroundColor: colors ? colors.backgroundColor : COLORS.lightBlue,
            },
            description: {
              paddingTop: 8,
            },
          },
          list: {
            itemColor: colors ? colors.backgroundColor : COLORS.lightBlue,
          },
        }}
        options={options}
        disabledOverlayStyle={{
          backgroundColor: 'rgba(255,255,255,0.0)',
        }}
        titleStyle={{
          color: colors ? colors.textColor : COLORS.black,
          fontWeight: '700',
        }}
        valueStyle={{
          color: colors ? colors.textColor : COLORS.black,
          fontWeight: '400',
        }}
        containerStyle={{
          backgroundColor: colors ? colors.backgroundColor : COLORS.white,
        }}
        widget={
          editable ? (
            <MaterialIcons
              name="keyboard-arrow-right"
              size={30}
              color={colors ? colors.textColor : COLORS.lightBlue}
            />
          ) : undefined
        }
      />
    );
  }
}
