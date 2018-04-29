import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';

import PlusMinusButtons from '../core/PlusMinusButtons';
import typography from '../../styles/typography';

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
        <Text style={typography.label}>XP:</Text>
        <Text style={[typography.label, { fontWeight: '900' }]}>{ xp }</Text>
        <PlusMinusButtons count={xp} onChange={onChange} size={28} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
  },
});
