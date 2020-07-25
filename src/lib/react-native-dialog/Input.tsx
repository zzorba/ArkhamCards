import PropTypes from 'prop-types';
import React from 'react';
import { Platform, StyleSheet, Text, TextInput, View, TextInputProps, TextStyle, ViewStyle } from 'react-native';

interface Props extends TextInputProps {
  label?: string;
  style?: TextStyle | TextStyle[];
  textInputRef?: React.RefObject<TextInput>;
  wrapperStyle?: ViewStyle;
  numberOfLines?: number;
  multiline?: boolean;
}

export default class DialogInput extends React.PureComponent<Props> {
  static displayName = 'DialogInput';

  render() {
    const {
      label,
      style,
      wrapperStyle,
      textInputRef,
      multiline,
      numberOfLines,
      ...otherProps
    } = this.props;
    const lines = (multiline && numberOfLines) || 1;
    const height = 18 + (Platform.OS === 'ios' ? 14 : 22) * lines;
    return (
      <View style={[styles.textInputWrapper, wrapperStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
          ref={textInputRef}
          style={[styles.textInput, ...(Array.isArray(style) ? style : [style]), { height }]}
          multiline={multiline}
          numberOfLines={numberOfLines}
          {...otherProps}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInputWrapper: Platform.select({
    ios: {
      backgroundColor: 'white',
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: 6,
      borderColor: '#A9ADAE',
      marginHorizontal: 20,
      marginBottom: 20,
      paddingHorizontal: 8,
    },
    default: {
      marginHorizontal: 10,
      marginBottom: 20,
    },
  }),
  label: Platform.select({
    ios: {},
    default: {
      color: 'rgba(0, 0, 0, 0.5)',
      fontSize: 14,
    },
  }),
  textInput: Platform.select({
    ios: {},
    default: {
      marginLeft: -4,
      paddingLeft: 4,
    },
  }),
});
