import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import PlusMinusButtons from 'components/core/PlusMinusButtons';
import Card from 'data/Card';

interface Props {
  card: Card;
  code: string;
  count: number;
  onIncrement: (code: string) => void;
  onDecrement: (code: string) => void;
}

export default class CardUpgradeOption extends React.Component<Props> {
  _inc = () => {
    const {
      onIncrement,
      code,
    } = this.props;
    onIncrement(code);
  };

  _dec = () => {
    const {
      onDecrement,
      code,
    } = this.props;
    onDecrement(code);
  };

  render() {
    const {
      count,
      card,
    } = this.props;
    const level = card.xp || 0;
    return (
      <View>
        <View style={styles.buttonsRow}>
          <View style={styles.buttonLabel}>
            <Text style={styles.label}>
              { t`Level ${level}` }
            </Text>
          </View>
          <Text style={[styles.label, styles.countText]}>
            { count }
          </Text>
          <PlusMinusButtons
            count={count}
            limit={card.deck_limit || 2}
            onIncrement={this._inc}
            onDecrement={this._dec}
            size={36}
            color="dark"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
    paddingLeft: 8,
  },
  buttonLabel: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
  countText: {
    fontWeight: '900',
    width: 30,
  },
});
