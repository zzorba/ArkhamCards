declare module 'react-native-settings-components' {
  import React, { ReactNode } from 'react';
  import { TextProps, TextStyle, ViewProps, ViewStyle } from 'react-native';
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

  export { SettingsButton, SettingsCategoryHeader };

}
