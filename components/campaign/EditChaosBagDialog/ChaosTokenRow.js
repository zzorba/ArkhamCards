import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ChaosToken from '../../core/ChaosToken';
import PlusMinusButtons from '../../core/PlusMinusButtons';

export default class ChaosTokenRow extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onCountChange: PropTypes.func.isRequired,
    originalCount: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);

    this._onChange = this.onChange.bind(this);
  }

  onChange(count) {
    const {
      id,
      onCountChange,
    } = this.props;
    onCountChange(id, count);
  }

  render() {
    const {
      id,
      count,
      originalCount,
      limit,
    } = this.props;
    const delta = (count - originalCount);
    const deltaString = (delta !== 0) ? ` (${delta > 0 ? '+' : ''}${delta})` : '';
    return (
      <View style={styles.row}>
        <ChaosToken id={id} />
        <View style={styles.count}>
          { count > 0 && <Text style={styles.countText}>{ ` x ${count}${deltaString}` }</Text> }
        </View>
        <PlusMinusButtons
          count={count}
          onChange={this._onChange}
          size={28}
          limit={limit}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    marginLeft: 8,
    marginRight: 8,
  },
  count: {
    width: 40,
  },
  countText: {
    fontSize: 18,
  },
});
