declare module 'react-native-settings-components' {
  import React, { ReactNode } from 'react';
  import { TextProps, TextStyle, SwitchProps, ViewProps, ViewStyle } from 'react-native';
  interface SettingsCategoryHeaderProps {
    container?: React.ReactNode;
    containerStyle?: ViewStyle;
    titleProps?: TextProps;
    titleStyle?: TextStyle;
    title: string;
  }
  class SettingsCategoryHeader extends React.Component<SettingsCategoryHeaderProps> {}

  interface SettingsButtonProps {
    containerProps?: ViewProps;
    containerStyle?: ViewStyle;
    disabledOverlayStyle?: any;
    titleProps?: TextProps;
    titleStyle?: TextStyle;
    title: string;
    descriptionProps?: TextProps;
    descriptionStyle?: TextStyle;
    description?: string;
    rightIconWrapperStyle?: ViewStyle;
    rightIcon?: () => React.ReactNode;
    disabled?: boolean;
    onPress: () => void;
  }
  class SettingsButton extends React.Component<SettingsButtonProps> {}

  interface PickerOption<T> {
    value: T;
    label: string;
  }

  interface ModalStyle {
    innerWrapper?: ViewStyle;
    header?: {
      wrapper?: ViewStyle;
      titleWrapper?: ViewStyle;
      title?: TextStyle;
      description?: TextStyle;
      closeBtnWrapper?: ViewStyle;
    };
    list?: {
      wrapper?: ViewStyle;
      scrollView?: ViewStyle;
      innerWrapper?: ViewStyle;
      itemColor?: string;
    };
  }

  interface SettingsPickerProps<T> {
    containerProps?: ViewProps;
    containerStyle?: ViewStyle;
    disabledOverlayStyle?: any;
    titleProps?: TextProps;
    titleStyle?: TextStyle;
    title: string;
    valueProps?: TextProps;
    valueStyle?: TextStyle;
    value?: T;
    valueFormat?: (value: T) => string;
    valuePlaceholder?: string;
    options: PickerOption<T>[];
    dialogDescription?: string;
    onValueChange: (value: T) => void;
    disabled?: boolean;
    modalStyle?: ModalStyle;
    multi?: boolean;
    renderCloseButton?: () => React.Component;
    singleRadio?: boolean;
    widget?: React.ReactNode;
  }

  class SettingsPicker<T> extends React.Component<SettingsPickerProps<T>> {
    openModal: () => void;
    closeModal: () => void;
  }

  interface SettingsSwitchProps<T> {
    containerProps?: ViewProps;
    containerStyle?: ViewStyle;
    disabledOverlayStyle?: ViewStyle;
    titleProps?: TextProps;
    titleStyle?: TextStyle;
    title: string;
    descriptionProps?: TextProps;
    descriptionStyle?: TextStyle;
    description?: string;
    switchWrapperProps?: ViewProps;
    switchWrapperStyle?: ViewStyle;
    value: boolean;
    disabled?: boolean;
    onValueChange: (value: boolean) => void;
    trackColor?: {
      true?: string;
      false?: string;
    };
    switchProps?: SwitchProps;
  }

  class SettingsSwitch<T> extends React.Component<SettingsSwitchProps<T>> {

  }

  export { SettingsButton, SettingsSwitch, SettingsCategoryHeader, SettingsPicker };
}
