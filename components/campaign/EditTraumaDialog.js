import React from 'react';
import PropTypes from 'prop-types';
import DialogComponent from 'react-native-dialog';

import L from '../../app/i18n';
import EditTraumaDialogContent from './EditTraumaDialogContent';
import Dialog from '../core/Dialog';

export default class EditTraumaDialog extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    investigator: PropTypes.object,
    trauma: PropTypes.object,
    updateTrauma: PropTypes.func.isRequired,
    hideDialog: PropTypes.func.isRequired,
    viewRef: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      trauma: {},
      visible: false,
    };

    this._onCancel = this.onCancel.bind(this);
    this._onSubmit = this.onSubmit.bind(this);
    this._mutateTrauma = this.mutateTrauma.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
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

  onSubmit() {
    const {
      investigator,
      updateTrauma,
      hideDialog,
    } = this.props;
    updateTrauma(investigator.code, this.state.trauma);
    hideDialog();
  }

  onCancel() {
    this.props.hideDialog();
  }

  mutateTrauma(mutate) {
    this.setState(state => {
      return {
        trauma: mutate(state.trauma),
      };
    });
  }

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
          L('{{firstName}}’s Trauma', { firstName: investigator.firstName }) :
          L('Trauma')}
        visible={visible}
        viewRef={viewRef}
      >
        <EditTraumaDialogContent
          investigator={investigator}
          trauma={trauma}
          mutateTrauma={this._mutateTrauma}
        />
        <DialogComponent.Button label={L('Cancel')} onPress={this._onCancel} />
        <DialogComponent.Button label={L('Save')} onPress={this._onSubmit} />
      </Dialog>
    );
  }
}
