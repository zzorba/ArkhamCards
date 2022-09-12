import StyleContext from '@styles/StyleContext';
import React, { useCallback, useContext, useReducer } from 'react';
import { StyleSheet, View } from 'react-native';
import { filter, map, findIndex } from 'lodash';

import Ripple from '@lib/react-native-material-ripple';
import { useComponentDidAppear, useEffectUpdate } from './hooks';
import { s } from '@styles/space';
import deepEqual from 'deep-equal';

interface RenderButton {
  element: (selected: boolean) => React.ReactNode;
}

interface Props {
  buttons: RenderButton[];
  selectedIndexes: number[];
  onPress: (indexes: number[]) => void;
  componentId: string;
  interaction?: 'radio'
}

export function SingleButton({ idx, content, last, onPressIndex, height, selected }: {
  idx: number;
  content: RenderButton;
  last: boolean;
  onPressIndex: (idx: number) => void;
  height: number;
  selected: boolean;
}) {
  const { colors } = useContext(StyleContext);
  const onPress = useCallback(() => {
    onPressIndex(idx);
  }, [onPressIndex, idx]);

  return (
    <Ripple
      onPress={onPress}
      rippleColor={colors.L20}
      style={[
        styles.buttonRipple,
        { height: height - 2,  backgroundColor: selected ? colors.L15 : colors.L30 },
        idx === 0 ? { borderTopLeftRadius: height / 2, borderBottomLeftRadius: height / 2 } : {},
        last ? { borderBottomRightRadius: height / 2, borderTopRightRadius: height / 2 } : {},
      ]}
      contentStyle={styles.button}
    >
      { content.element(selected) }
    </Ripple>
  );
}

interface SyncIndexes {
  type: 'sync';
  indexes: number[];
}
interface ToggleIndex {
  type: 'toggle';
  idx: number;
  interaction?: 'radio';
}
type IndexAction = ToggleIndex | SyncIndexes;
export default function ArkhamButtonGroup({
  buttons,
  selectedIndexes,
  onPress,
  componentId,
  interaction,
}: Props) {
  const { colors, fontScale } = useContext(StyleContext);
  const [localSelectedIndexes, updateLocalSelectedIndexes] = useReducer((indexes: number[], action: IndexAction) => {
    switch (action.type) {
      case 'sync':
        if (deepEqual(indexes, action.indexes)) {
          return indexes;
        }
        return action.indexes;
      case 'toggle': {
        const selected = findIndex(indexes, idx => idx === action.idx) !== -1;
        let newSelection = indexes;
        if (action.interaction === 'radio') {
          newSelection = selected ? [] : [action.idx];
        } else {
          newSelection = selected ?
            filter(indexes, x => x !== action.idx) :
            [...indexes, action.idx];
        }
        return newSelection;
      }
    }
  }, selectedIndexes);
  useEffectUpdate(() => {
    onPress(localSelectedIndexes);
  }, [localSelectedIndexes]);
  useComponentDidAppear(() => {
    updateLocalSelectedIndexes({ type: 'sync', indexes: selectedIndexes });
  }, componentId, [updateLocalSelectedIndexes, selectedIndexes]);
  const onPressIndex = useCallback((idx: number) => {
    updateLocalSelectedIndexes({ type: 'toggle', idx, interaction });
  }, [interaction, updateLocalSelectedIndexes]);
  const height = 28 * fontScale + 20;
  return (
    <View style={styles.wrapper}>
      <View style={[styles.buttonWrapper, { borderColor: colors.M, borderRadius: height / 2, height, backgroundColor: colors.L30 }]}>
        { map(buttons, (button, idx) => {
          const last = idx === (buttons.length - 1);
          const selected = findIndex(localSelectedIndexes, x => x === idx) !== -1;
          return (
            <SingleButton
              idx={idx}
              key={`${idx}-${selected}`}
              content={button}
              selected={selected}
              last={last}
              onPressIndex={onPressIndex}
              height={height}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    margin: s,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  buttonRipple: {
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 10,
  },
});
