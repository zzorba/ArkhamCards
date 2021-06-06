import React, { useCallback, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import PlusMinusButtons from '@components/core/PlusMinusButtons';
import Card from '@data/types/Card';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import StackedCardCount from '@components/cardlist/CardSearchResult/ControlComponent/StackedCardCount';

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

export default function CardUpgradeOption({ card, code, count, ignoreCount, onIncrement, onDecrement, onIgnore }: Props) {
  const { typography } = useContext(StyleContext);

  const inc = useCallback(() => {
    onIncrement(code);
  }, [onIncrement, code]);

  const dec = useCallback(() => {
    onDecrement(code);
  }, [onDecrement, code]);

  const incIgnore = useCallback(() => {
    if (onIgnore) {
      onIgnore.onIncrement(code);
    }
  }, [onIgnore, code]);

  const decIgnore = useCallback(() => {
    if (onIgnore) {
      onIgnore.onDecrement(code);
    }
  }, [onIgnore, code]);

  const level = card.xp || 0;
  return (
    <View>
      <View style={[styles.buttonsRow, space.paddingSideS]}>
        <View style={styles.buttonLabel}>
          <Text style={typography.dialogLabel}>
            { t`Level ${level}` }
          </Text>
        </View>
        <PlusMinusButtons
          count={count}
          max={card.deck_limit || 2}
          onIncrement={inc}
          onDecrement={dec}
          size={36}
          dialogStyle
          countRender={<StackedCardCount count={count} showZeroCount />}
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
            onIncrement={incIgnore}
            onDecrement={decIgnore}
            size={36}
            color="dark"
          />
        </View>
      ) }
    </View>
  );
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
