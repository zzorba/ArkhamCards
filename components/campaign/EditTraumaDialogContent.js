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
import { COLORS } from '../../styles/colors';

export default class EditTraumaDialogContent extends React.Component {
  static propTypes = {
    investigator: PropTypes.object,
    trauma: PropTypes.object,
    mutateTrauma: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._incPhysical = this.incPhysical.bind(this);
    this._decPhysical = this.decPhysical.bind(this);
    this._incMental = this.incMental.bind(this);
    this._decMental = this.decMental.bind(this);
    this._toggleKilled = this.toggleKilled.bind(this);
    this._toggleInsane = this.toggleInsane.bind(this);
  }

  incPhysical() {
    const {
      investigator,
    } = this.props;
    const health = investigator ? investigator.health : 0;
    this.props.mutateTrauma(trauma =>
      Object.assign({}, trauma, { physical: Math.min(trauma.physical + 1, health) })
    );
  }

  decPhysical() {
    this.props.mutateTrauma(trauma =>
      Object.assign({}, trauma, { physical: Math.max(trauma.physical - 1, 0) })
    );
  }

  incMental() {
    const {
      investigator,
    } = this.props;
    const sanity = investigator ? investigator.sanity : 0;
    this.props.mutateTrauma(trauma =>
      Object.assign({}, trauma, { mental: Math.min(trauma.mental + 1, sanity) })
    );
  }

  decMental() {
    this.props.mutateTrauma(trauma =>
      Object.assign({}, trauma, { mental: Math.max(trauma.mental - 1, 0) })
    );
  }

  toggleKilled() {
    this.props.mutateTrauma(trauma =>
      Object.assign({}, trauma, { killed: !trauma.killed })
    );
  }

  toggleInsane() {
    this.props.mutateTrauma(trauma =>
      Object.assign({}, trauma, { insane: !trauma.insane })
    );
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
              onIncrement={this._incPhysical}
              onDecrement={this._decPhysical}
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
              onIncrement={this._incMental}
              onDecrement={this._decMental}
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
          trackColor={COLORS.switchTrackColor}
        />
        <DialogComponent.Switch
          label={L('Insane')}
          value={insane || impliedInsane}
          disabled={impliedInsane}
          onValueChange={this._toggleInsane}
          trackColor={COLORS.switchTrackColor}
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
