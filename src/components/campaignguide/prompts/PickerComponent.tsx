import React from 'react';
import { StyleSheet } from 'react-native';
import { map } from 'lodash';
import { SettingsPicker } from 'react-native-settings-components';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import { DisplayChoice } from 'data/scenario';
import { COLORS } from 'styles/colors';
import typography from 'styles/typography';

interface Props {
  choices: DisplayChoice[];
  description?: string;
  selectedIndex?: number;
  onChoiceChange: (index: number) => void;
  title: string;
  optional?: boolean;
  editable: boolean;
  colors?: {
    modalColor: string;
    modalTextColor: string;
    backgroundColor: string;
    textColor: string;
  };
  defaultLabel?: string;
  topBorder: boolean;
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
      topBorder,
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
              backgroundColor: colors ? colors.modalColor : COLORS.lightBlue,
            },
            title: {
              ...typography.mediumGameFont,
              color: colors ? colors.modalTextColor : COLORS.white,
            },
            description: {
              paddingTop: 8,
              color: colors ? colors.modalTextColor : COLORS.white,
            },
          },
          list: {
            itemText: typography.label,
            itemColor: colors ? colors.modalColor : COLORS.lightBlue,
          },
        }}
        options={options}
        disabledOverlayStyle={{
          backgroundColor: 'rgba(255,255,255,0.0)',
        }}
        titleStyle={{
          ...typography.mediumGameFont,
          color: colors ? colors.textColor : COLORS.black,
          fontWeight: '700',
        }}
        valueStyle={{
          ...typography.label,
          color: colors ? colors.textColor : COLORS.black,
          fontWeight: '400',
        }}
        containerStyle={{
          padding: 8,
          backgroundColor: colors ? colors.backgroundColor : COLORS.white,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: '#888',
          borderTopWidth: topBorder ? StyleSheet.hairlineWidth : undefined,
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
