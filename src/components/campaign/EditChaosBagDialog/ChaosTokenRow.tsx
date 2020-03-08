import React from 'react';
import { map, range } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';

import { ChaosTokenType } from 'constants';
import ChaosToken from 'components/core/ChaosToken';
import PlusMinusButtons from 'components/core/PlusMinusButtons';
import { s, xs } from 'styles/space';

interface Props {
  id: ChaosTokenType;
  fontScale: number;
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

  static renderTokens(id: ChaosTokenType, count: number, fontScale: number, status?: 'added' | 'removed') {
    return (
      <View style={styles.row}>
        { map(range(0, count), (idx) => (
          <ChaosToken
            key={`${status}-${idx}`}
            fontScale={fontScale}
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
      fontScale,
    } = this.props;
    if (count > originalCount) {
      return (
        <View style={styles.row}>
          { (originalCount > 0) && ChaosTokenRow.renderTokens(id, originalCount, fontScale) }
          { ChaosTokenRow.renderTokens(id, (count - originalCount), fontScale, 'added') }
        </View>
      );
    }
    if (count < originalCount) {
      return (
        <View style={styles.row}>
          { count > 0 && ChaosTokenRow.renderTokens(id, count, fontScale) }
          { ChaosTokenRow.renderTokens(id, (originalCount - count), fontScale, 'removed') }
        </View>
      );
    }
    return ChaosTokenRow.renderTokens(id, count, fontScale);

  }

  render() {
    const {
      id,
      count,
      limit,
      fontScale,
    } = this.props;
    return (
      <View style={styles.mainRow}>
        <View style={styles.row}>
          <ChaosToken id={id} fontScale={fontScale} />
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
    paddingLeft: s,
    paddingRight: s,
    paddingTop: xs,
    paddingBottom: xs,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
