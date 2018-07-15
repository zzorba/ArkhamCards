import React from 'react';
import PropTypes from 'prop-types';
import { map, range } from 'lodash';
import {
  StyleSheet,
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

  static renderTokens(id, count, status) {
    return (
      <View style={styles.row}>
        { map(range(0, count), (idx) => (
          <ChaosToken key={`${status}-${idx}`} id={id} status={status} />
        )) }
      </View>
    );
  }

  renderTokens() {
    const {
      id,
      count,
      originalCount,
    } = this.props;
    if (count > originalCount) {
      return (
        <View style={styles.row}>
          { (originalCount > 0) && ChaosTokenRow.renderTokens(id, originalCount) }
          { ChaosTokenRow.renderTokens(id, (count - originalCount), 'added') }
        </View>
      );
    }
    if (count < originalCount) {
      return (
        <View style={styles.row}>
          { count > 0 && ChaosTokenRow.renderTokens(id, count) }
          { ChaosTokenRow.renderTokens(id, (originalCount - count), 'removed') }
        </View>
      );
    }
    return ChaosTokenRow.renderTokens(id, count);

  }

  render() {
    const {
      id,
      count,
      limit,
    } = this.props;
    return (
      <View style={styles.mainRow}>
        <View style={styles.row}>
          <ChaosToken id={id} />
          <PlusMinusButtons
            count={count}
            onChange={this._onChange}
            size={28}
            limit={limit}
          />
        </View>
        { this.renderTokens() }
      </View>
    );
  }
}


const styles = StyleSheet.create({
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 8,
    paddingRight: 8,
    height: 60,
    borderBottomWidth: 1,
    borderColor: '#222222',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
