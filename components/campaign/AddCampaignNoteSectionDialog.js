import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
} from 'react-native';
import DialogComponent from 'react-native-dialog';

import Dialog from '../core/Dialog';

export default class AddCampaignNoteSectionDialog extends React.Component {
  static propTypes = {
    viewRef: PropTypes.object,
    visible: PropTypes.bool,
    addSection: PropTypes.func,
    toggleVisible: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      perInvestigator: false,
      isCount: false,
    };

    this._onAddPress = this.onAddPress.bind(this);
    this._onCancelPress = this.onCancelPress.bind(this);
    this._toggleCount = this.toggleCount.bind(this);
    this._toggleInvestigator = this.toggleInvestigator.bind(this);
    this._onNameChange = this.onNameChange.bind(this);
  }

  onAddPress() {
    const {
      name,
      perInvestigator,
      isCount,
    } = this.state;
    const {
      addSection,
      toggleVisible,
    } = this.props;
    addSection && addSection(name, isCount, perInvestigator);
    this.resetForm();
    toggleVisible();
  }

  onCancelPress() {
    this.resetForm();
    this.props.toggleVisible();
  }

  resetForm() {
    this.setState({
      name: '',
      perInvestigator: false,
      inCount: false,
    });
  }

  toggleCount() {
    this.setState({
      isCount: !this.state.isCount,
    });
  }

  toggleInvestigator() {
    this.setState({
      perInvestigator: !this.state.perInvestigator,
    });
  }

  onNameChange(value) {
    this.setState({
      name: value,
    });
  }

  render() {
    const {
      viewRef,
      visible,
    } = this.props;
    const {
      name,
      isCount,
      perInvestigator,
    } = this.state;

    const buttonColor = Platform.OS === 'ios' ? '#007ff9' : '#169689';
    return (
      <Dialog
        title="Add Campaign Log Section"
        visible={visible}
        viewRef={viewRef}
      >
        <DialogComponent.Input
          value={name}
          autoFocus
          placeholder="Section Name"
          onChangeText={this._onNameChange}
        />
        <DialogComponent.Switch
          label="Count"
          value={isCount}
          onValueChange={this._toggleCount}
          onTintColor="#222222"
          tintColor="#bbbbbb"
        />
        <DialogComponent.Switch
          label="Per Investigator"
          value={perInvestigator}
          onValueChange={this._toggleInvestigator}
          onTintColor="#222222"
          tintColor="#bbbbbb"
        />
        <DialogComponent.Button
          label="Cancel"
          onPress={this._onCancelPress}
        />
        <DialogComponent.Button
          label="Add"
          color={name ? buttonColor : '#666666'}
          disabled={!name}
          onPress={this._onAddPress}
        />
      </Dialog>
    );
  }
}
