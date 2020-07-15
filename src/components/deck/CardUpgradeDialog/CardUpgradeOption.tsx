import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import PlusMinusButtons from '@components/core/PlusMinusButtons';
import Card from '@data/Card';
import space from '@styles/space';
import typography from '@styles/typography';

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
        <View style={[styles.buttonsRow, space.paddingSideS]}>
          <View style={styles.buttonLabel}>
            <Text style={typography.dialogLabel}>
              { t`Level ${level}` }
            </Text>
          </View>
          <Text style={[typography.dialogLabel, styles.countText]}>
            { count }
          </Text>
          <PlusMinusButtons
            count={count}
            max={card.deck_limit || 2}
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
  },
  buttonLabel: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  countText: {
    fontWeight: '900',
    width: 30,
  },
});
