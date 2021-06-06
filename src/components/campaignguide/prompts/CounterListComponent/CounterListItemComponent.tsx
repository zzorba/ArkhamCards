import React, { useCallback, useContext, useMemo } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import PlusMinusButtons from '@components/core/PlusMinusButtons';
import space, { m, s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import Card from '@data/types/Card';
import CompactInvestigatorRow from '@components/core/CompactInvestigatorRow';

interface Props {
  code: string;
  name: string;
  investigator?: Card;
  description?: string;
  color?: string;
  value: number;
  max?: number;
  min?: number;
  onInc: (code: string, max?: number) => void;
  onDec: (code: string, min?: number) => void;
  editable: boolean;
  showDelta: boolean;
}

export default function CounterListItemComponent({ code, investigator, name, description, color, value, max, min, onInc, onDec, editable, showDelta }: Props) {
  const { typography, width } = useContext(StyleContext);
  const inc = useCallback(() => onInc(code, max), [onInc, code, max]);
  const dec = useCallback(() => onDec(code, min), [onDec, code, min]);

  const count = useMemo(() => {
    return (
      <View style={styles.count}>
        <Text style={[typography.bigGameFont, typography.center, color ? typography.white : {}]}>
          { showDelta && value > 0 ? `+${value}` : `${value}` }
        </Text>
      </View>
    );
  }, [color, value, showDelta, typography]);
  if (investigator) {
    return (
      <View style={space.paddingBottomXs}>
        <CompactInvestigatorRow
          investigator={investigator}
          width={width - s * (editable ? 4 : 2)}
          description={editable && !!description ? description : undefined}
        >
          { editable ? (
            <PlusMinusButtons
              count={value}
              max={max}
              min={min}
              onIncrement={inc}
              onDecrement={dec}
              countRender={count}
              color={color ? 'light' : 'dark'}
              hideDisabledMinus
              dialogStyle
              rounded
            />
          ) : (
            count
          ) }
        </CompactInvestigatorRow>
      </View>
    );
  }
  return (
    <View style={[
      styles.promptRow,
      color ? { backgroundColor: color } : {},
    ]}>
      <View style={styles.column}>
        <Text style={[typography.mediumGameFont, color ? typography.white : {}]}>
          { name }
        </Text>
        { editable && !!description && (
          <Text style={[typography.text, color ? typography.white : {}]}>
            { description }
          </Text>
        ) }
      </View>
      { editable ? (
        <PlusMinusButtons
          count={value}
          max={max}
          min={min}
          onIncrement={inc}
          onDecrement={dec}
          countRender={count}
          color={color ? 'light' : 'dark'}
          hideDisabledMinus
          dialogStyle
          rounded
        />
      ) : (
        count
      ) }
    </View>
  );
}

const styles = StyleSheet.create({
  count: {
    paddingLeft: xs,
    paddingRight: xs,
    minWidth: 40,
  },
  promptRow: {
    padding: m,
    paddingTop: s,
    paddingBottom: s,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
    flex: 1,
  },
});
