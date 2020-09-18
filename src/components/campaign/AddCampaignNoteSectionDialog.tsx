import React from 'react';
import {
  Platform,
  TextInput,
  View,
} from 'react-native';
import DialogComponent from '@lib/react-native-dialog';
import { t } from 'ttag';

import Dialog from '@components/core/Dialog';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

export type AddSectionFunction = (
  name: string,
  perInvestigator: boolean,
  isCount: boolean
) => void;

interface Props {
  viewRef?: View;
  visible: boolean;
  addSection?: AddSectionFunction;
  toggleVisible: () => void;
}

interface State {
  name: string;
  perInvestigator: boolean;
  isCount: boolean;
}

export default class AddCampaignNoteSectionDialog extends React.Component<Props, State> {
  static contextType = StyleContext;
  context!: StyleContextType;

  _textInputRef = React.createRef<TextInput>();

  constructor(props: Props) {
    super(props);

    this.state = {
      name: '',
      perInvestigator: false,
      isCount: false,
    };
  }

  _onAddPress = () => {
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
  };

  _onCancelPress = () => {
    this.resetForm();
    this.props.toggleVisible();
  };

  resetForm() {
    this.setState({
      name: '',
      perInvestigator: false,
      isCount: false,
    });
  }

  _toggleCount = () => {
    this.setState({
      isCount: !this.state.isCount,
    });
  };

  _toggleInvestigator = () => {
    this.setState({
      perInvestigator: !this.state.perInvestigator,
    });
  };

  _onNameChange = (value: string) => {
    this.setState({
      name: value,
    });
  };

  componentDidUpdate(prevProps: Props) {
    const {
      visible,
    } = this.props;
    if (visible && !prevProps.visible) {
      if (this._textInputRef && this._textInputRef.current) {
        this._textInputRef.current.focus();
      }
    }
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
    const { typography } = this.context;

    const buttonColor = Platform.OS === 'ios' ? '#007ff9' : '#169689';
    return (
      <Dialog
        title={t`Add Campaign Log Section`}
        visible={visible}
        viewRef={viewRef}
      >
        <DialogComponent.Input
          value={name}
          textInputRef={this._textInputRef}
          placeholder={t`Section Name`}
          onChangeText={this._onNameChange}
        />
        <DialogComponent.Switch
          label={t`Count`}
          labelStyle={typography.dialogLabel}
          value={isCount}
          onValueChange={this._toggleCount}
        />
        <DialogComponent.Switch
          label={t`Per Investigator`}
          labelStyle={typography.dialogLabel}
          value={perInvestigator}
          onValueChange={this._toggleInvestigator}
        />
        <DialogComponent.Button
          label={t`Cancel`}
          onPress={this._onCancelPress}
        />
        <DialogComponent.Button
          label={t`Add`}
          color={name ? buttonColor : '#666666'}
          disabled={!name}
          onPress={this._onAddPress}
        />
      </Dialog>
    );
  }
}
