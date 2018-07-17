import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
} from 'react-native';
import DialogComponent from 'react-native-dialog';

import Dialog from './Dialog';

export default class EditTextDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    viewRef: PropTypes.object,
    onTextChange: PropTypes.func,
    toggleVisible: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      textInputRef: null,
      originalText: null,
    };

    this._onTextChange = this.onTextChange.bind(this);
    this._captureTextInputRef = this.captureTextInputRef.bind(this);
    this._onDonePress = this.onDonePress.bind(this);
    this._onCancelPress = this.onCancelPress.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (state.originalText === null || props.text !== state.originalText) {
      return {
        text: props.text,
        originalText: props.text,
      };
    }
    return null;
  }

  onTextChange(value) {
    this.setState({
      text: value,
    });
  }

  captureTextInputRef(ref) {
    this.setState({
      textInputRef: ref,
    });
  }

  componentDidUpdate(prevProps) {
    const {
      visible,
    } = this.props;
    const {
      textInputRef,
    } = this.state;
    if (visible && !prevProps.visible && textInputRef) {
      textInputRef.focus();
    }
  }

  onCancelPress() {
    const {
      text,
      toggleVisible,
    } = this.props;
    this.setState({
      text: text,
    });
    toggleVisible();
  }

  onDonePress() {
    const {
      onTextChange,
      toggleVisible,
    } = this.props;
    onTextChange && onTextChange(this.state.text);
    toggleVisible();
  }

  render() {
    const {
      visible,
      title,
      viewRef,
      text,
    } = this.props;
    if (!viewRef) {
      return null;
    }

    const textChanged = text !== this.state.text;
    const buttonColor = Platform.OS === 'ios' ? '#007ff9' : '#169689';
    return (
      <Dialog visible={visible} title={title} viewRef={viewRef}>
        <DialogComponent.Input
          ref={this._captureTextInputRef}
          value={text}
          autoFocus
          onChangeText={this._onTextChange}
          onSubmitEditing={this._onDonePress}
        />
        <DialogComponent.Button
          label="Cancel"
          onPress={this._onCancelPress}
        />
        <DialogComponent.Button
          label="Done"
          color={textChanged ? buttonColor : '#666666'}
          disabled={!textChanged}
          onPress={this._onDonePress}
        />
      </Dialog>
    );
  }
}
