import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DialogComponent from 'react-native-dialog';

import PlusMinusButtons from '../core/PlusMinusButtons';
import { t } from 'ttag';
import { Trauma } from '../../actions/types';
import Card from '../../data/Card';
import { COLORS } from '../../styles/colors';

interface Props {
  investigator?: Card;
  trauma: Trauma;
  mutateTrauma: (updateTrauma: (trauma: Trauma) => Trauma) => void;
}
export default class EditTraumaDialogContent extends React.Component<Props> {
  _incPhysical = () => {
    const {
      investigator,
    } = this.props;
    const health = investigator ? (investigator.health || 0) : 0;
    this.props.mutateTrauma(trauma =>
      Object.assign({}, trauma, { physical: Math.min((trauma.physical || 0) + 1, health) })
    );
  };

  _decPhysical = () => {
    this.props.mutateTrauma(trauma =>
      Object.assign({}, trauma, { physical: Math.max((trauma.physical || 0) - 1, 0) })
    );
  };

  _incMental = () => {
    const {
      investigator,
    } = this.props;
    const sanity = investigator ? (investigator.sanity || 0) : 0;
    this.props.mutateTrauma(trauma =>
      Object.assign({}, trauma, { mental: Math.min((trauma.mental || 0) + 1, sanity) })
    );
  };

  _decMental = () => {
    this.props.mutateTrauma(trauma =>
      Object.assign({}, trauma, { mental: Math.max((trauma.mental || 0) - 1, 0) })
    );
  };

  _toggleKilled = () => {
    this.props.mutateTrauma(trauma =>
      Object.assign({}, trauma, { killed: !trauma.killed })
    );
  };

  _toggleInsane = () => {
    this.props.mutateTrauma(trauma =>
      Object.assign({}, trauma, { insane: !trauma.insane })
    );
  };

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
    const health = investigator ? (investigator.health || 0) : 0;
    const sanity = investigator ? (investigator.sanity || 0) : 0;

    const impliedKilled = (physical === health);
    const impliedInsane = (mental === sanity);
    return (
      <View>
        <View style={styles.counterColumn}>
          <Text style={styles.label}>{ t`Physical Trauma` }</Text>
          <View style={styles.buttonsRow}>
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
              color="dark"
            />
          </View>
        </View>
        <View style={styles.counterColumn}>
          <Text style={styles.label}>{ t`Mental Trauma` }</Text>
          <View style={styles.buttonsRow}>
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
              color="dark"
            />
          </View>
        </View>
        <DialogComponent.Switch
          label={t`Killed`}
          value={killed || impliedKilled}
          disabled={impliedKilled}
          onValueChange={this._toggleKilled}
          trackColor={COLORS.switchTrackColor}
        />
        <DialogComponent.Switch
          label={t`Insane`}
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
  counterColumn: {
    marginRight: Platform.OS === 'ios' ? 28 : 8,
    marginLeft: Platform.OS === 'ios' ? 28 : 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
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
