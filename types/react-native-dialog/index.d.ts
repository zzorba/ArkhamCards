declare module 'react-native-dialog' {
  // Type definitions for react-native-dialog 5.5
  // Project: https://github.com/mmazzarolo/react-native-dialog
  // Definitions by: MrLuje <https://github.com/MrLuje>
  //                 Stack Builders <https://github.com/stackbuilders>
  //                 Esteban Ibarra <https://github.com/ibarrae>
  // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
  // TypeScript Version: 2.8

  import { Ref, PureComponent, ReactNode } from 'react';
  import {
    SwitchProps,
    ViewProps,
    TextProps,
    StyleProp,
    TextInputProps,
    TextStyle,
    ViewStyle,
  } from 'react-native';

  interface ButtonProps {
    label: string;
    /**
     * default:
     *      ios     #007ff9
     *      android #169689
     */
    color?: string;
    bold?: boolean;
    /**
     * default: false
     */

    disabled?: boolean;
    onPress: () => void;
  }

  interface ContainerProps {
    blurComponentIOS?: ReactNode;
    children: React.ReactNode[];
    /**
     * default: false
     */
    visible?: boolean;
    buttonSeparatorStyle?: ViewStyle;
    contentStyle?: ViewStyle;
    footerStyle?: ViewStyle;
    headerStyle?: ViewStyle;
  }

  interface TitleProps {
    children: string;
  }

  interface DialogSwitchProps {
    label?: string;
    labelStyle?: TextStyle;
  }

  interface InputProps<T> {
    label?: string;
    textInputRef?: Ref<T>;
    wrapperStyle?: StyleProp<ViewStyle>;
  }

  interface DescriptionProps {
    children: string;
  }

  export namespace Dialog {
    export class Button extends PureComponent<
        ButtonProps & ViewProps & TextProps
    > {}
    export class Container extends PureComponent<ContainerProps & ViewProps> {}
    export class Title extends PureComponent<
        TitleProps & ViewProps & TextProps
    > {}
    export class Input<T> extends PureComponent<
        InputProps<T> & ViewProps & TextInputProps
    > {}
    export class Description extends PureComponent<
        DescriptionProps & ViewProps & TextProps
    > {}
    export class Switch extends PureComponent<
        DialogSwitchProps & SwitchProps
    > {}
  }

  export default Dialog;
}
