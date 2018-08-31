import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DialogComponent from 'react-native-dialog';

import L from '../../app/i18n';
import PlusMinusButtons from '../core/PlusMinusButtons';

export default class EditTraumaDialogContent extends React.Component {
  static propTypes = {
    investigator: PropTypes.object,
    trauma: PropTypes.object,
    onTraumaChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._onPhysicalChange = this.onPhysicalChange.bind(this);
    this._onMentalChange = this.onMentalChange.bind(this);
    this._toggleKilled = this.toggleKilled.bind(this);
    this._toggleInsane = this.toggleInsane.bind(this);
  }

  onPhysicalChange(count) {
    const {
      trauma,
      onTraumaChange,
    } = this.props;
    onTraumaChange(Object.assign({}, trauma, { physical: count }));
  }

  onMentalChange(count) {
    const {
      trauma,
      onTraumaChange,
    } = this.props;
    onTraumaChange(Object.assign({}, trauma, { mental: count }));
  }

  toggleKilled() {
    const {
      trauma,
      onTraumaChange,
    } = this.props;
    onTraumaChange(Object.assign({}, trauma, { killed: !trauma.killed }));
  }

  toggleInsane() {
    const {
      trauma,
      onTraumaChange,
    } = this.props;
    onTraumaChange(Object.assign({}, trauma, { insane: !trauma.insane }));
  }

  render() {
    const {
      investigator,
      trauma: {
        killed,
        insane,
        physical,
        mental,
      },
    } = this.props;
    const health = investigator ? investigator.health : 0;
    const sanity = investigator ? investigator.sanity : 0;

    const impliedKilled = (physical === health);
    const impliedInsane = (mental === sanity);
    return (
      <View>
        <View style={styles.counterRow}>
          <Text style={styles.label}>{ L('Physical Trauma') }</Text>
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
          <Text style={styles.label}>{ L('Mental Trauma') }</Text>
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
          label={L('Killed')}
          value={killed || impliedKilled}
          disabled={impliedKilled}
          onValueChange={this._toggleKilled}
          onTintColor="#222222"
          tintColor="#bbbbbb"
        />
        <DialogComponent.Switch
          label={L('Insane')}
          value={insane || impliedInsane}
          disabled={impliedInsane}
          onValueChange={this._toggleInsane}
          onTintColor="#222222"
          tintColor="#bbbbbb"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterRow: {
    marginRight: Platform.OS === 'ios' ? 28 : 8,
    marginLeft: Platform.OS === 'ios' ? 28 : 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
