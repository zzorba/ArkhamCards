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
import StyleContext, { StyleContextType } from '@styles/StyleContext';

interface Props {
  card: Card;
  code: string;
  count: number;
  ignoreCount: number;
  onIncrement: (code: string) => void;
  onDecrement: (code: string) => void;

  onIgnore?: {
    onIncrement: (code: string) => void;
    onDecrement: (code: string) => void;
  };
}

export default class CardUpgradeOption extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

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

  _incIgnore = () => {
    const { onIgnore, code } = this.props;
    if (onIgnore) {
      onIgnore.onIncrement(code);
    }
  };

  _decIgnore = () => {
    const { onIgnore, code } = this.props;
    if (onIgnore) {
      onIgnore.onDecrement(code);
    }
  };

  render() {
    const {
      count,
      card,
      onIgnore,
      ignoreCount,
    } = this.props;
    const { typography } = this.context;
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
        { !!onIgnore && (
          <View style={[styles.buttonsRow, space.paddingSideS]}>
            <View style={styles.buttonLabel}>
              <Text style={typography.dialogLabel}>
                { t`Keep level ${level} after upgrade\nWon't count towards deck size` }
              </Text>
            </View>
            <Text style={[typography.dialogLabel, styles.countText]}>
              { ignoreCount }
            </Text>
            <PlusMinusButtons
              count={ignoreCount}
              max={count}
              onIncrement={this._incIgnore}
              onDecrement={this._decIgnore}
              size={36}
              color="dark"
            />
          </View>
        ) }
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
