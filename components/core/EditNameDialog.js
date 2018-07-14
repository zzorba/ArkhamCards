import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
} from 'react-native';
import DialogComponent from 'react-native-dialog';

import Dialog from './Dialog';

export default class EditNameDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    viewRef: PropTypes.object,
    onNameChange: PropTypes.func.isRequired,
    toggleVisible: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      name: props.name,
      textInputRef: null,
    };

    this._onNameChange = this.onNameChange.bind(this);
    this._captureTextInputRef = this.captureTextInputRef.bind(this);
    this._onDonePress = this.onDonePress.bind(this);
    this._onCancelPress = this.onCancelPress.bind(this);
  }

  onNameChange(value) {
    this.setState({
      name: value,
    });
  }

  captureTextInputRef(ref) {
    this.setState({
      textInputRef: ref,
    });
  }

  componentDidUpdate(prevProps) {
    const {
      name,
      visible,
    } = this.props;
    const {
      textInputRef,
    } = this.state;
    if (prevProps.name !== name) {
      /* eslint-disable react/no-did-update-set-state */
      this.setState({
        name: name,
      });
    }
    if (visible && !prevProps.visible) {
      textInputRef && textInputRef.focus();
    }
  }

  onCancelPress() {
    const {
      name,
      toggleVisible,
    } = this.props;
    this.setState({
      name: name,
    });
    toggleVisible();
  }

  onDonePress() {
    const {
      onNameChange,
      toggleVisible,
    } = this.props;
    onNameChange(this.state.name);
    toggleVisible();
  }

  render() {
    const {
      visible,
      title,
      viewRef,
    } = this.props;
    const {
      name,
    } = this.state;
    if (!viewRef) {
      return null;
    }

    const nameChanged = this.props.name !== name;
    const buttonColor = Platform.OS === 'ios' ? '#007ff9' : '#169689';
    return (
      <Dialog
        title={title}
        visible={visible}
        viewRef={viewRef}
      >
        <DialogComponent.Input
          ref={this._captureTextInputRef}
          value={name}
          autoFocus
          onChangeText={this._onNameChange}
          onSubmitEditing={this._onDonePress}
        />
        <DialogComponent.Button
          label="Cancel"
          onPress={this._onCancelPress}
        />
        <DialogComponent.Button
          label="Done"
          color={nameChanged ? buttonColor : '#666666'}
          disabled={!nameChanged}
          onPress={this._onDonePress}
        />
      </Dialog>
    );
  }
}
