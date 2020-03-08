import React from 'react';
import { View } from 'react-native';
import DialogComponent from 'react-native-dialog';

import EditTraumaDialogContent from './EditTraumaDialogContent';
import Dialog from 'components/core/Dialog';
import { t } from 'ttag';
import { Trauma } from 'actions/types';
import Card from 'data/Card';

interface Props {
  visible: boolean;
  investigator?: Card;
  trauma?: Trauma;
  updateTrauma: (investigator_code: string, trauma: Trauma) => void;
  hideDialog: () => void;
  viewRef?: View;
}

interface State {
  trauma: Trauma;
  visible: boolean;
}

export default class EditTraumaDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      trauma: {},
      visible: false,
    };
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.visible !== state.visible) {
      if (props.visible) {
        return {
          visible: props.visible,
          trauma: props.trauma,
        };
      }
      return {
        visible: props.visible,
      };
    }
    return null;
  }

  _onSubmit = () => {
    const {
      investigator,
      updateTrauma,
      hideDialog,
    } = this.props;
    if (investigator) {
      updateTrauma(investigator.code, this.state.trauma);
    }
    hideDialog();
  };

  _onCancel = () => {
    this.props.hideDialog();
  };

  _mutateTrauma = (mutate: (trauma: Trauma) => Trauma) => {
    this.setState(state => {
      return {
        trauma: mutate(state.trauma),
      };
    });
  };

  render() {
    const {
      investigator,
      viewRef,
    } = this.props;
    const {
      visible,
      trauma,
    } = this.state;
    return (
      <Dialog
        title={investigator ?
          t`${investigator.firstName}’s Trauma` :
          t`Trauma`}
        visible={visible}
        viewRef={viewRef}
      >
        <EditTraumaDialogContent
          investigator={investigator}
          trauma={trauma}
          mutateTrauma={this._mutateTrauma}
        />
        <DialogComponent.Button label={t`Cancel`} onPress={this._onCancel} />
        <DialogComponent.Button label={t`Save`} onPress={this._onSubmit} />
      </Dialog>
    );
  }
}
