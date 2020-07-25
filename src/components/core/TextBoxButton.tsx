import React from 'react';
import {
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import typography from '@styles/typography';
import { xs } from '@styles/space';
import COLORS from '@styles/colors';

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
  constructor(props: Props) {
    super(props);

    this.state = {
      height: 24,
    };
  }

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
      style = {},
      textStyle = {},
      ...otherProps
    } = this.props;
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
            textStyle,
            multiline ? { height: this.state.height + 12 } : {},
            crossedOut ? {
              textDecorationLine: 'line-through',
              textDecorationStyle: 'solid',
              textDecorationColor: COLORS.lightText,
            } : {},
            value ? { color: COLORS.darkText } : { color: COLORS.lightText },
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
  textBox: {
    paddingLeft: xs,
    paddingRight: xs,
    paddingBottom: Platform.OS === 'ios' ? xs : (xs / 2),
    flexDirection: 'row',
    alignItems: 'center',
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
    color: COLORS.lightText,
    width: '100%',
  },
});
