import React from 'react';
import PropTypes from 'prop-types';
import { map, range } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';

import { ChaosTokenType } from '../../../constants';
import ChaosToken, { SIZE } from '../../core/ChaosToken';
import PlusMinusButtons from '../../core/PlusMinusButtons';

interface Props {
  id: ChaosTokenType;
  mutateCount: (id: ChaosTokenType, mutate: (count: number) => number) => void;
  originalCount: number;
  count: number;
  limit: number;
}

export default class ChaosTokenRow extends React.PureComponent<Props> {
  _increment = () => {
    const {
      id,
      mutateCount,
      limit,
    } = this.props;
    mutateCount(id, count => Math.min(count + 1, limit));
  };

  _decrement = () => {
    const {
      id,
      mutateCount,
    } = this.props;
    mutateCount(id, count => Math.max(count - 1, 0));
  };

  static renderTokens(id: ChaosTokenType, count: number, status?: 'added' | 'removed') {
    return (
      <View style={styles.row}>
        { map(range(0, count), (idx) => (
          <ChaosToken
            key={`${status}-${idx}`}
            id={id}
            status={status}
          />
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
            onIncrement={this._increment}
            onDecrement={this._decrement}
            size={36}
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
    height: SIZE + 24,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
