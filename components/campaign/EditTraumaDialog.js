import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DialogComponent from 'react-native-dialog';

import EditTraumaDialogContent from './EditTraumaDialogContent';
import Dialog from '../core/Dialog';
import PlusMinusButtons from '../core/PlusMinusButtons';

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
    this._onTraumaChange = this.onTraumaChange.bind(this);
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

  onTraumaChange(trauma) {
    this.setState({
      trauma,
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
        title={investigator ? `${investigator.name}\'s Trauma` : 'Trauma'}
        visible={visible}
        viewRef={viewRef}
      >
        <EditTraumaDialogContent
          investigator={investigator}
          trauma={trauma}
          onTraumaChange={this._onTraumaChange}
        />
        <DialogComponent.Button label="Cancel" onPress={this._onCancel} />
        <DialogComponent.Button label="Save" onPress={this._onSubmit} />
      </Dialog>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterRow: {
    marginLeft: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 28,
  },
  traumaText: {
    fontWeight: '900',
    width: 30,
  },
  label: Platform.select({
    ios: {
      fontSize: 13,
      color: 'black',
    },
    android: {
      fontSize: 16,
      color: '#33383D',
    },
  }),
});
