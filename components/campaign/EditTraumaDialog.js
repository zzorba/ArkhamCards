import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DialogComponent from 'react-native-dialog';

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
      trauma: null,
      originalTrauma: null,
    };

    this._onCancel = this.onCancel.bind(this);
    this._onSubmit = this.onSubmit.bind(this);
    this._onPhysicalChange = this.onPhysicalChange.bind(this);
    this._onMentalChange = this.onMentalChange.bind(this);
    this._toggleKilled = this.toggleKilled.bind(this);
    this._toggleInsane = this.toggleInsane.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (state.originalTrauma === null || props.trauma !== state.originalTrauma) {
      return {
        trauma: props.trauma,
        originalTrauma: props.trauma,
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
    this.setState({
      trauma: this.state.originalTrauma,
    });
    this.props.hideDialog();
  }

  onPhysicalChange(count) {
    this.setState({
      trauma: Object.assign({}, this.state.trauma, { physical: count }),
    });
  }

  onMentalChange(count) {
    this.setState({
      trauma: Object.assign({}, this.state.trauma, { mental: count }),
    });
  }

  toggleKilled() {
    const {
      trauma,
    } = this.state;
    this.setState({
      trauma: Object.assign({}, trauma, { killed: !trauma.killed }),
    });
  }

  toggleInsane() {
    const {
      trauma,
    } = this.state;
    this.setState({
      trauma: Object.assign({}, trauma, { insane: !trauma.insane }),
    });
  }

  render() {
    const {
      visible,
      investigator,
      viewRef,
    } = this.props;
    const {
      trauma: {
        killed,
        insane,
        physical,
        mental,
      },
    } = this.state;
    const health = investigator ? investigator.health : 0;
    const sanity = investigator ? investigator.sanity : 0;

    const impliedKilled = (physical === health);
    const impliedInsane = (mental === sanity);
    return (
      <Dialog
        title={investigator ? `${investigator.name}'s Trauma` : 'Trauma'}
        visible={visible}
        viewRef={viewRef}
      >
        <View style={styles.counterRow}>
          <Text style={styles.label}>Physical Trauma</Text>
          <View style={styles.row}>
            <Text style={[styles.label, styles.traumaText]}>
              { physical || 0 }
            </Text>
            <PlusMinusButtons
              count={physical || 0}
              limit={health}
              onChange={this._onPhysicalChange}
              size={36}
              disabled={killed || insane}
              dark
            />
          </View>
        </View>
        <View style={styles.counterRow}>
          <Text style={styles.label}>Mental Trauma</Text>
          <View style={styles.row}>
            <Text style={[styles.label, styles.traumaText]}>
              { mental || 0 }
            </Text>
            <PlusMinusButtons
              count={mental || 0}
              limit={sanity}
              onChange={this._onMentalChange}
              size={36}
              disabled={killed || insane}
              dark
            />
          </View>
        </View>
        <DialogComponent.Switch
          label="Killed"
          value={killed || impliedKilled}
          disabled={impliedKilled}
          onValueChange={this._toggleKilled}
          onTintColor="#222222"
          tintColor="#bbbbbb"
        />
        <DialogComponent.Switch
          label="Insane"
          value={insane || impliedInsane}
          disabled={impliedInsane}
          onValueChange={this._toggleInsane}
          onTintColor="#222222"
          tintColor="#bbbbbb"
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
