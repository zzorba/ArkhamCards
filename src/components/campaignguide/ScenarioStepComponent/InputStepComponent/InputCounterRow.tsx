import React, { useContext, useMemo } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { t } from 'ttag';

import PlusMinusButtons from '@components/core/PlusMinusButtons';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';


export default function InputCounterRow({
  icon,
  title,
  count,
  total,
  inc,
  dec,
  max,
  min,
  editable,
  disabled,
  bottomBorder,
  hideTotal,
}: {
  editable: boolean;
  icon?: React.ReactNode;
  title: string;
  count: number;
  total: number;
  inc: () => void;
  dec: () => void;
  max?: number;
  min?: number;
  disabled?: boolean;
  bottomBorder?: boolean;
  hideTotal?: boolean;
}) {
  const { borderStyle, colors, typography } = useContext(StyleContext);
  const description = useMemo(() => {
    if (!editable || hideTotal) {
      return null;
    }
    return (
      <View style={[styles.startRow, space.paddingRightS]}>
        <Text style={[typography.small, { color: colors.lightText }]}>
          { t`(new total: ${total})` }
        </Text>
      </View>
    );
  }, [editable, total, colors, typography, hideTotal]);
  return (
    <View style={[
      styles.betweenRow,
      space.paddingTopS,
      space.paddingBottomS,
      space.paddingLeftXs,
      space.paddingRightXs,
      space.marginSideS,
      bottomBorder ? { borderBottomWidth: StyleSheet.hairlineWidth } : undefined,
      borderStyle,
    ]}>
      <View style={styles.column}>
        <View style={styles.startRow}>
          { icon }
          <Text style={[typography.small, typography.italic]}>
            { title }
          </Text>
        </View>
        <View style={space.paddingTopXs}>{description}</View>
      </View>
      <View style={styles.endRow}>
        { editable ? (
          <PlusMinusButtons
            count={total}
            countRender={(
              <Text style={[typography.counter, typography.center, { minWidth: 28 }]}>
                {!hideTotal && count > 0 && editable ? '+' : ''}{ count }
              </Text>
            )}
            onIncrement={inc}
            onDecrement={dec}
            showZeroCount
            min={min}
            max={max}
            disabled={disabled}
            rounded
            dialogStyle
          />
        ) : (
          <Text style={[typography.counter, { color: colors.lightText }]}>
            { total }
          </Text>
        ) }
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  startRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  betweenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  endRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});
