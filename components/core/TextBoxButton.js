import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewPropTypes,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import typography from '../../styles/typography';

export default class TextBoxButton extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    crossedOut: PropTypes.bool,
    style: ViewPropTypes.style,
    textStyle: PropTypes.any,
    multiline: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      height: 24,
    };

    this._updateSize = props.multiline ? this.updateSize.bind(this) : null;
  }

  updateSize(event) {
    this.setState({
      height: event.nativeEvent.contentSize.height,
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
        <LinearGradient
          colors={['#fff', '#eee']}
          style={[
            styles.textBox,
            style,
            multiline ? {} : { paddingTop: Platform.OS === 'ios' ? 4 : 2 },
          ]}
        >
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
                textDecorationColor: '#222',
              } : {},
              value ? { color: '#222' } : { color: '#aaa' },
            ]}
            onContentSizeChange={this._updateSize}>
              { value || placeholder }
            </Text>
          </TextInput>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#a8a8a8',
    overflow: 'hidden',
  },
  textBox: {
    paddingLeft: 4,
    paddingRight: 4,
    paddingBottom: Platform.OS === 'ios' ? 4 : 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    paddingTop: 2,
    width: '100%',
    padding: 0,
    minHeight: 22,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  input: {
    color: '#222',
    width: '100%',
  },
});
