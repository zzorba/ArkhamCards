import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';

import PlusMinusButtons from './core/PlusMinusButtons';
import typography from '../styles/typography';

export default class XpController extends React.Component {
  static propTypes = {
    xp: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    const {
      xp,
      onChange,
    } = this.props;
    return (
      <View style={styles.row}>
        <Text style={typography.label}>Experience:</Text>
        <Text style={[typography.label, { fontWeight: '900', width: 30 }]}>{ xp }</Text>
        <PlusMinusButtons count={xp} onChange={onChange} size={28} dark />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 4,
  },
});
