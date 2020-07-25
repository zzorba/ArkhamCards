import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ViewProps, ViewStyle, TextProps, TextStyle,
} from 'react-native';
import { cloneDeep, isArray, join, trim } from 'lodash';
import { t } from 'ttag';

import PickerModal, { ModalStyle, PickerItem } from './picker.modal';
import COLORS from '@styles/colors';

const style = StyleSheet.create({
  defaultContainerStyle: {
    padding: 0,
    minHeight: 50,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    flexDirection: 'row',
  },
  defaultTitleStyle: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 8,
    fontSize: 16,
  },
  defaultValueStyle: {
    color: COLORS.lightText,
    fontSize: 14,
    flex: 0,
    paddingLeft: 8,
    paddingRight: 16,
  },
  defaultDisabledOverlayStyle: {
    backgroundColor: COLORS.disabledOverlay,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  headerCloseBtnText: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: 'white',
    fontSize: 16,
    textTransform: 'uppercase',
  },
});

interface Props {
  containerProps?: ViewProps;
  containerStyle?: ViewStyle;
  disabledOverlayStyle?: ViewStyle;
  titleProps?: TextProps;
  titleStyle?: TextStyle;
  title: string;
  modalTitle?: string;
  valueProps?: TextProps;
  valueStyle?: TextStyle;
  valuePlaceholder?: string;
  options: PickerItem[];
  dialogDescription?: string;
  disabled?: boolean;
  modalStyle?: ModalStyle;
  renderCloseBtn?: () => React.ReactNode;
  singleRadio?: boolean;
  widgetStyle?: ViewStyle;
  widget?: React.ReactNode;

  multi: boolean;
  value: number | number[];
  valueFormat: ((idx: number) => string) | ((idx: number[]) => string);
  onValueChange: ((idx: number) => void) | ((idx: number[]) => void);
}

interface State {
  pickerValue: number[];
  pickerOpen: boolean;
}
class SettingsPicker extends Component<Props, State> {
  state: State = {
    pickerValue: [],
    pickerOpen: false,
  };
  static defaultProps = {
    containerProps: {},
    containerStyle: {},
    disabledOverlayStyle: {},
    dialogDescription: null,
    titleProps: {},
    titleStyle: {},
    value: null,
    valueProps: {},
    valuePlaceholder: '...',
    valueStyle: {},
    valueFormat: null,
    disabled: false,
    modalStyle: {},
    singleRadio: true,
    multi: false,
  };

  _renderCloseBtn = () => (
    <Text style={style.headerCloseBtnText}>
      { t`Close` }
    </Text>
  );

  componentDidMount() {
    const { value, multi } = this.props;
    this.setState({
      pickerValue: (multi && isArray(value) ? value : [value]) as any,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    this.setState({
      pickerValue: (nextProps.multi && isArray(nextProps.value) ? nextProps.value : [nextProps.value]) as any,
    });
  }

  openModal = () => {
    this.setState({
      pickerOpen: true,
    });
  };

  closeModal = () => {
    this.setState({
      pickerOpen: false,
    });
  };

  onSelectItem = (value: number) => {
    const {
      pickerValue,
    } = this.state;
    const {
      onValueChange, multi, singleRadio,
    } = this.props;
    let newVal;
    if (multi) {
      newVal = cloneDeep(pickerValue);
      if (pickerValue.indexOf(value) !== -1) {
        newVal.splice(newVal.indexOf(value), 1);
      } else {
        newVal.push(value);
      }
    } else if (pickerValue[0] === value && !singleRadio) {
      newVal = null;
    } else {
      newVal = value;
    }
    onValueChange(newVal as any);
  };

  generateValStr = () => {
    const {
      multi, valueFormat, value, valuePlaceholder,
    } = this.props;
    if (valueFormat) {
      return valueFormat(value as any);
    }
    if (multi) {
      if (isArray(value) && value.length) {
        return trim(join(value, ', '));
      }
    } else if (value) {
      return value.toString();
    }
    return valuePlaceholder;
  };

  render() {
    const {
      disabled, dialogDescription,
      containerProps, containerStyle, title, titleProps, titleStyle,
      valueProps, valueStyle, disabledOverlayStyle, modalStyle,
      options,
      modalTitle,
      renderCloseBtn = this._renderCloseBtn,
      widget, widgetStyle,
    } = this.props;
    const { pickerOpen, pickerValue } = this.state;

    return (
      <View style={{ width: '100%' }}>
        {(!disabled) ? (
          <TouchableOpacity onPress={this.openModal}>
            <PickerModal
              closeModal={this.closeModal}
              pickerOpen={pickerOpen}
              pickerValue={pickerValue}
              title={modalTitle || title}
              options={options}
              dialogDescription={dialogDescription}
              modalStyle={modalStyle}
              onSelectItem={this.onSelectItem}
              renderCloseBtn={renderCloseBtn}
            />
            <View {...containerProps} style={[style.defaultContainerStyle, containerStyle]}>
              <Text {...titleProps} style={[style.defaultTitleStyle, titleStyle]}>
                {title}
              </Text>
              <Text {...valueProps} style={[style.defaultValueStyle, valueStyle]}>
                {this.generateValStr()}
              </Text>
              { widget && <View style={widgetStyle}>{widget}</View> }
            </View>
          </TouchableOpacity>
        ) : (
          <View {...containerProps} style={[style.defaultContainerStyle, containerStyle]}>
            <Text {...titleProps} style={[style.defaultTitleStyle, titleStyle]}>{title}</Text>
            <Text
              {...valueProps}
              style={[style.defaultValueStyle, valueStyle]}
            >
              {this.generateValStr()}
            </Text>
            <View style={[style.defaultDisabledOverlayStyle, disabledOverlayStyle]} />
          </View>
        )}
      </View>
    );
  }
}


export default SettingsPicker;
