import React, { Component } from 'react';
import { isFunction, trim } from 'lodash';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
  TextProps,
  TextStyle,
  Platform,
  Alert,
  AlertType,
} from 'react-native';
// @ts-ignore TS7016
import DialogAndroid from 'react-native-dialogs';
import { TouchableProps } from 'react-native-svg';

import COLORS from '@styles/colors';

interface Props {
  containerProps?: ViewProps;
  containerStyle?: ViewStyle;
  disabledOverlayStyle?: ViewStyle;
  titleProps?: TextProps;
  titleStyle?: TextStyle;
  title: string;
  descriptionProps?: TextProps;
  descriptionStyle?: TextStyle;
  description?: string;
  valueProps?: TextProps;
  valueStyle?: TextStyle;
  value?: string;
  valuePlaceholder?: string;
  valueFormat?: (value?: string) => string;
  negativeButtonTitle?: string;
  positiveButtonTitle?: string;
  dialogDescription?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  iosDialogInputType?: AlertType;
  androidDialogOptions: any;
  androidDialogInputType: any;
  touchableProps: TouchableProps;
}

export default class SettingsEditText extends Component<Props> {
  static constants = {
    iosDialogInputType: {
      DEFAULT: 'plain-text',
      PLAIN_TEXT: 'plain-text',
      EMAIL_ADDRESS: 'email-address',
      NUMERIC: 'numeric',
      PHONE_PAD: 'phone-pad',
      ASCII_CAPABLE: 'ascii-capable',
      NUMBERS_AND_PUNCTUATION: 'numbers-and-punctuation',
      URL: 'url',
      NUMBER_PAD: 'number-pad',
      NAME_PHONE_PAD: 'name-phone-pad',
      DECIMAL_PAD: 'decimal-pad',
      TWITTER: 'twitter',
      WEB_SEARCH: 'web-search',
    },
    androidDialogInputType: {
      DEFAULT: null,
      NUMERIC: 'numeric',
      NUMBERS_AND_PUNCTUATION: 'numbers-and-punctuation',
      NUMERIC_PASSWORD: 'numeric-password',
      EMAIL_ADDRESS: 'email-address',
      PASSWORD: 'password',
      PHONE_PAD: 'phone-pad',
      DECIMAL_PAD: 'decimal-pad',
    },
  };

  static defaultProps = {
    containerProps: {},
    containerStyle: {},
    disabledOverlayStyle: {},
    titleProps: {},
    titleStyle: {},
    valueProps: {},
    valuePlaceholder: '...',
    valueStyle: {},
    valueFormat: null,
    dialogDescription: '',
    disabled: false,
    iosDialogInputType: SettingsEditText.constants.iosDialogInputType.DEFAULT,
    androidDialogInputType: SettingsEditText.constants.androidDialogInputType.DEFAULT,
    androidDialogPlaceholder: null,
    androidDialogOptions: {},
    touchableProps: {},
  };

  onValueChange = (val: string | undefined) => {
    const { onValueChange } = this.props;
    onValueChange(trim(val));
  };

  renderAndroidDialog = async() => {
    const {
      title, dialogDescription, positiveButtonTitle, negativeButtonTitle, value,
      androidDialogOptions, androidDialogInputType,
    } = this.props;
    const { action, text } = await DialogAndroid.prompt(title, dialogDescription, {
      defaultValue: value || '',
      positiveText: positiveButtonTitle,
      negativeText: negativeButtonTitle,
      keyboardType: androidDialogInputType,
      ...androidDialogOptions,
    });

    if (action === DialogAndroid.actionPositive) {
      this.onValueChange(text);
    }
  };

  openDialog = async() => {
    const {
      title, dialogDescription, negativeButtonTitle, positiveButtonTitle,
      iosDialogInputType, value,
    } = this.props;
    if (Platform.OS === 'ios') {
      Alert.prompt(
        title,
        dialogDescription,
        [
          { text: negativeButtonTitle, onPress: () => {
            // intentionally empty
          }, style: 'cancel' },
          {
            text: positiveButtonTitle,
            onPress: this.onValueChange,
          },
        ],
        iosDialogInputType,
        (value) || '',
      );
    } else {
      this.renderAndroidDialog();
    }
  };

  render() {
    const {
      disabled, containerProps, containerStyle, title,
      titleProps, titleStyle, valueProps, valueStyle, valuePlaceholder, valueFormat,
      disabledOverlayStyle, touchableProps, value,
    } = this.props;

    return (!disabled) ? (
      <TouchableOpacity
        {...touchableProps}
        onPress={this.openDialog}
      >
        <View {...containerProps} style={[style.defaultContainerStyle, containerStyle]}>
          <View style={style.titleWrapper}>
            <Text
              numberOfLines={1}
              {...titleProps}
              style={[style.defaultTitleStyle, titleStyle]}
            >
              { title }
            </Text>
          </View>
          <View style={style.valueWrapper}>
            <Text
              numberOfLines={1}
              {...valueProps}
              style={[style.defaultValueStyle, valueStyle]}
            >
              { (value) || valuePlaceholder }
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ) : (
      <View {...containerProps} style={[style.defaultContainerStyle, containerStyle]}>
        <View style={style.titleWrapper}>
          <Text
            numberOfLines={1}
            {...titleProps}
            style={[style.defaultTitleStyle, titleStyle]}
          >
            { title }
          </Text>
        </View>
        <View style={style.valueWrapper}>
          <Text
            numberOfLines={1}
            {...valueProps}
            style={[style.defaultValueStyle, valueStyle]}
          >
            { (isFunction(valueFormat) ? valueFormat(value) : value) || valuePlaceholder }
          </Text>
        </View>
        <View style={[style.defaultDisabledOverlayStyle, disabledOverlayStyle]} />
      </View>
    );
  }
}

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
    fontSize: 16,
    textAlignVertical: 'center',
  },
  titleWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  valueWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  defaultValueStyle: {
    color: COLORS.lightText,
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
    textAlignVertical: 'center',
  },
  defaultDisabledOverlayStyle: {
    backgroundColor: COLORS.disabledOverlay,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
