import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  ViewProps,
  ViewStyle,
  TextProps,
  TextStyle,
} from 'react-native';
import { trim } from 'lodash';
import DialogAndroid from 'react-native-dialogs';
import isFunction from 'lodash/isFunction';
import { TouchableProps } from 'react-native-svg';

const style = StyleSheet.create({
  defaultContainerStyle: {
    padding: 0,
    minHeight: 50,
    backgroundColor: 'white',
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
    color: 'rgb(160,160,160)',
    fontSize: 14,
    flex: 1,
    paddingLeft: 8,
    paddingRight: 16,
    textAlign: 'right',
  },
  defaultDisabledOverlayStyle: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});

namespace constants {
  export enum IosDialogInputType {
    DEFAULT = 'plain-text',
    PLAIN_TEXT= 'plain-text',
    EMAIL_ADDRESS = 'email-address',
    NUMERIC = 'numeric',
    PHONE_PAD = 'phone-pad',
    ASCII_CAPABLE = 'ascii-capable',
    NUMBERS_AND_PUNCTUATION = 'numbers-and-punctuation',
    URL = 'url',
    NUMBER_PAD = 'number-pad',
    NAME_PHONE_PAD = 'name-phone-pad',
    DECIMAL_PAD = 'decimal-pad',
    TWITTER = 'twitter',
    WEB_SEARCH = 'web-search',
  };
  export enum AndroidDialogInputType {
    NUMERIC= 'numeric',
    NUMBERS_AND_PUNCTUATION = 'numbers-and-punctuation',
    NUMERIC_PASSWORD = 'numeric-password',
    EMAIL_ADDRESS = 'email-address',
    PASSWORD = 'password',
    PHONE_PAD = 'phone-pad',
    DECIMAL_PAD = 'decimal-pad',
  };
};


interface Props {
  containerProps?: ViewProps;
  containerStyle?: ViewStyle
    disabledOverlayStyle?: ViewStyle;
    titleProps?: TextProps;
    titleStyle?: TextStyle;
    title: string;
    valueProps?: TextProps;
    valueStyle?: TextStyle;
    value?: string;
    valuePlaceholder?: string;
    valueFormat: (value?: string) => string;
    negativeButtonTitle: string;
    positiveButtonTitle: string;
    dialogDescription?: string;
    onValueChange: (value: string) => string;
    disabled?: boolean;
    iosDialogInputType?: constants.IosDialogInputType;
    androidDialogInputType?: constants.AndroidDialogInputType | null;
    androidDialogPlaceholder?: string;
    androidDialogOptions: any;
    touchableProps?: TouchableProps;
}

class SettingsEditText extends Component<Props> {
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
    iosDialogInputType: constants.IosDialogInputType.DEFAULT,
    androidDialogInputType: null,
    androidDialogPlaceholder: null,
    androidDialogOptions: {},
    touchableProps: {},
  };

  onValueChange = (val: string) => {
    const { onValueChange } = this.props;
    onValueChange(trim(val));
  };

  renderAndroidDialog = async () => {
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
      this.onValueChange(trim(text));
    }
  };

  openDialog = async () => {
    const {
      title, dialogDescription, negativeButtonTitle, positiveButtonTitle,
      iosDialogInputType, value,
    } = this.props;
    if (Platform.OS === 'ios') {
      Alert.prompt(
        title,
        dialogDescription,
        [
          { text: negativeButtonTitle, onPress: () => {}, style: 'cancel' },
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
          <Text
            numberOfLines={1}
            {...titleProps}
            style={[style.defaultTitleStyle, titleStyle]}
          >
            {title}
          </Text>
          <Text
            numberOfLines={1}
            {...valueProps}
            style={[style.defaultValueStyle, valueStyle]}
          >
            {(value) || valuePlaceholder}
          </Text>
        </View>
      </TouchableOpacity>
    ) : (
      <View {...containerProps} style={[style.defaultContainerStyle, containerStyle]}>
        <Text
          numberOfLines={1}
          {...titleProps}
          style={[style.defaultTitleStyle, titleStyle]}
        >
          {title}
        </Text>
        <Text
          numberOfLines={1}
          {...valueProps}
          style={[style.defaultValueStyle, valueStyle]}
        >
          {(isFunction(valueFormat) ? valueFormat(value) : value) || valuePlaceholder}
        </Text>
        <View style={[style.defaultDisabledOverlayStyle, disabledOverlayStyle]} />
      </View>
    );
  }
}

export default SettingsEditText;
