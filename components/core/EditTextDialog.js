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
    text: PropTypes.string,
    viewRef: PropTypes.object,
    onTextChange: PropTypes.func,
    toggleVisible: PropTypes.func.isRequired,
    showCrossOut: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      textInputRef: null,
      text: null,
      originalText: null,
      isCrossedOut: false,
      submitting: false,
    };

    this._onTextChange = this.onTextChange.bind(this);
    this._captureTextInputRef = this.captureTextInputRef.bind(this);
    this._onDonePress = this.onDonePress.bind(this);
    this._onCancelPress = this.onCancelPress.bind(this);
    this._onCrossOutPress = this.onCrossOutPress.bind(this);
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
      text,
      showCrossOut,
    } = this.props;
    const {
      textInputRef,
    } = this.state;
    if (visible && !prevProps.visible) {
      const isCrossedOut = showCrossOut && text && text.startsWith('~');
      /* eslint-disable react/no-did-update-set-state */
      this.setState({
        text: isCrossedOut ? text.substring(1) : text,
        originalText: text,
        isCrossedOut,
      }, () => {
        textInputRef && textInputRef.focus();
      });
    }
  }

  onCancelPress() {
    const {
      toggleVisible,
    } = this.props;
    toggleVisible();
  }

  onCrossOutPress() {
    const {
      onTextChange,
      toggleVisible,
    } = this.props;
    const {
      isCrossedOut,
      text,
    } = this.state;
    const result = isCrossedOut ? text : `~${text}`;
    toggleVisible();
    onTextChange && onTextChange(result);
  }

  onDonePress() {
    const {
      onTextChange,
      toggleVisible,
    } = this.props;
    const {
      text,
      isCrossedOut,
    } = this.state;
    const result = isCrossedOut ? `~${text}` : text;
    onTextChange && onTextChange(result);
    toggleVisible();
  }

  render() {
    const {
      visible,
      title,
      viewRef,
      showCrossOut,
    } = this.props;
    const {
      isCrossedOut,
      originalText,
      text,
    } = this.state;

    const textChanged = isCrossedOut ?
      text !== originalText.substring(1) :
      text !== originalText;
    const buttonColor = Platform.OS === 'ios' ? '#007ff9' : '#169689';
    return (
      <Dialog visible={visible} title={title} viewRef={viewRef}>
        <DialogComponent.Input
          style={isCrossedOut ? { textDecorationLine: 'line-through' } : {}}
          ref={this._captureTextInputRef}
          value={text}
          autoFocus
          editable={!isCrossedOut}
          onChangeText={this._onTextChange}
          onSubmitEditing={this._onDonePress}
        />
        <DialogComponent.Button
          label="Cancel"
          onPress={this._onCancelPress}
        />
        { showCrossOut && (
          <DialogComponent.Button
            label={isCrossedOut ? 'Uncross Out' : 'Cross Out'}
            color="#ff3b30"
            onPress={this._onCrossOutPress}
          />
        ) }
        { !isCrossedOut && (
          <DialogComponent.Button
            label="Done"
            color={textChanged ? buttonColor : '#666666'}
            disabled={!textChanged}
            onPress={this._onDonePress}
          />
        ) }
      </Dialog>
    );
  }
}
