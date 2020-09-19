import React from 'react';
import { StyleSheet } from 'react-native';
import { isArray, map } from 'lodash';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import { SettingsPicker } from '@lib/react-native-settings-components';
import { DisplayChoice } from '@data/scenario';
import COLORS from '@styles/colors';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

export interface PickerProps {
  choices: DisplayChoice[];
  description?: string;
  title: string;
  modalTitle?: string;
  optional?: boolean;
  editable: boolean;
  colors?: {
    modalColor: string;
    modalTextColor: string;
    backgroundColor: string;
    textColor: string;
  };
  defaultLabel?: string;
  topBorder?: boolean;
  noBorder?: boolean;
  settingsStyle?: boolean;
  open?: boolean;
  hideWidget?: boolean;
  formatLabel?: (index: number) => string;
}

interface SingleConfig {
  mode: 'single';
  onChoiceChange: (index: number) => void;
  selectedIndex?: number;
}

interface MultiConfig {
  mode: 'multi';
  onChoiceChange: (index: number[]) => void;
  selectedIndex?: number[];
}

interface Props extends PickerProps {
  config: SingleConfig | MultiConfig;
}

export default class PickerComponent extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  pickerRef?: SettingsPicker;

  _capturePickerRef = (ref: SettingsPicker) => {
    this.pickerRef = ref;
    if (this.props.open && this.pickerRef) {
      this.pickerRef.openModal();
    }
  };

  componentDidUpdate(prevProps: Props) {
    if (this.props.open && !prevProps.open) {
      this.pickerRef && this.pickerRef.openModal();
    }
  }

  _onSingleChoiceChange = (idx: number) => {
    const { config } = this.props;
    if (config.mode === 'single') {
      this.pickerRef && this.pickerRef.closeModal();
      config.onChoiceChange(idx);
    }
  };

  _onMultiChoiceChange = (idx: number[]) => {
    const { config } = this.props;
    if (config.mode === 'multi') {
      config.onChoiceChange(idx);
    }
  };

  _valueFormat = (idxOrArray: number | number[]): string => {
    const { defaultLabel, formatLabel } = this.props;
    if (isArray(idxOrArray)) {
      if (!idxOrArray.length) {
        return defaultLabel || '';
      }
      return map(idxOrArray, x => formatLabel ? formatLabel(x) : this.choiceToLabel(x)).join(', ');
    }
    return formatLabel ? formatLabel(idxOrArray) : this.choiceToLabel(idxOrArray);
  };

  choiceToLabel(idx: number): string {
    const { choices, defaultLabel } = this.props;
    if (idx === -1) {
      return defaultLabel || '';
    }
    const choice = choices[idx];
    if (choice) {
      return choice.text || 'Unknown text';
    }
    return '';
  }

  render() {
    const {
      choices,
      config,
      optional,
      editable,
      title,
      colors,
      description,
      defaultLabel,
      topBorder,
      noBorder,
      settingsStyle,
      hideWidget,
      modalTitle,
    } = this.props;
    const { gameFont, typography } = this.context;
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
        modalTitle={modalTitle}
        dialogDescription={description}
        value={config.selectedIndex}
        valuePlaceholder={''}
        valueFormat={this._valueFormat}
        onValueChange={config.mode === 'single' ?
          this._onSingleChoiceChange :
          this._onMultiChoiceChange
        }
        disabled={!editable}
        multi={config.mode === 'multi'}
        singleRadio={config.mode === 'single' && !optional}
        modalStyle={{
          header: {
            wrapper: {
              backgroundColor: colors ? colors.modalColor : COLORS.lightBlue,
            },
            title: settingsStyle ? {
              ...typography.text,
              color: colors ? colors.modalTextColor : COLORS.white,
            } : {
              ...typography.mediumGameFont,
              fontFamily: gameFont,
              color: colors ? colors.modalTextColor : COLORS.white,
            } ,
            description: {
              paddingTop: 8,
              color: colors ? colors.modalTextColor : COLORS.white,
            },
          },
          list: {
            itemText: typography.small,
            itemColor: colors ? colors.modalColor : COLORS.lightBlue,
            scrollView: {
              backgroundColor: this.context.colors.background,
            },
            itemWrapper: {
              backgroundColor: this.context.colors.background,
            },
          },
        }}
        options={options}
        disabledOverlayStyle={{
          backgroundColor: 'transparent',
        }}
        titleStyle={settingsStyle ? {
          ...typography.text,
          color: colors ? colors.textColor : this.context.colors.darkText,
        } : {
          ...typography.mediumGameFont,
          fontFamily: gameFont,
          color: colors ? colors.textColor : this.context.colors.darkText,
          fontWeight: '600',
        }}
        valueProps={{
          numberOfLines: 3,
          ellipsizeMode: 'tail',
        }}
        valueStyle={{
          ...typography.large,
          color: colors ? colors.textColor : this.context.colors.darkText,
          fontWeight: '400',
          textAlign: 'right',
        }}
        containerStyle={{
          padding: 4,
          paddingLeft: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: colors ? colors.backgroundColor : 'transparent',
          borderBottomWidth: noBorder ? undefined : StyleSheet.hairlineWidth,
          borderColor: this.context.colors.divider,
          borderTopWidth: topBorder ? StyleSheet.hairlineWidth : undefined,
        }}
        widgetStyle={{}}
        widget={
          editable && !hideWidget ? (
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
