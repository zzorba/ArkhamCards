import React from 'react';
import {
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TextStyle,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { xs } from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

interface Props extends TextInputProps {
  value: string;
  placeholder?: string;
  crossedOut?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  multiline?: boolean;
  ellipsizeMode?: string;
}

interface State {
  height: number;
}

export default class TextBoxButton extends React.Component<Props, State> {
  static contextType = StyleContext;
  context!: StyleContextType;

  state = {
    height: 24,
  };

  _updateSize = (event: LayoutChangeEvent) => {
    this.setState({
      height: event.nativeEvent.layout.height,
    });
  }

  render() {
    const {
      value,
      multiline,
      crossedOut,
      placeholder,
      textStyle = {},
      ...otherProps
    } = this.props;
    const { colors, typography } = this.context;
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          editable={false}
          multiline={multiline}
          {...otherProps}
        >
          <Text style={[
            typography.text,
            styles.input,
            { color: colors.lightText },
            textStyle,
            multiline ? { height: this.state.height + 12 } : {},
            crossedOut ? {
              textDecorationLine: 'line-through',
              textDecorationStyle: 'solid',
              textDecorationColor: colors.lightText,
            } : {},
            value ? { color: colors.darkText } : { color: colors.lightText },
          ]}
          onLayout={multiline ? this._updateSize : undefined}>
            { value || placeholder }
          </Text>
        </TextInput>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: xs,
    borderBottomWidth: 1,
    borderColor: '#a8a8a8',
    overflow: 'hidden',
    marginBottom: xs,
  },
  textInput: {
    paddingTop: (xs / 2),
    width: '100%',
    padding: 0,
    paddingLeft: xs,
    minHeight: 22,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
  },
});
