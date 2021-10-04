import StyleContext from '@styles/StyleContext';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { InteractionManager, StyleSheet, View } from 'react-native';
import { filter, map } from 'lodash';

import Ripple from '@lib/react-native-material-ripple';
import { useEffectUpdate } from './hooks';

interface RenderButton {
  element: (selected: boolean) => React.ReactNode;
}

interface Props {
  buttons: RenderButton[];
  selectedIndexes: number[];
  onPress: (indexes: number[]) => void;
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
    <>
      <Ripple
        onPress={onPress}
        rippleColor={colors.L20}
        style={[
          styles.button,
          { height: height - 2, backgroundColor: selected ? colors.L15 : colors.L30 },
          idx === 0 ? { borderTopLeftRadius: height / 2, borderBottomLeftRadius: height / 2 } : {},
          last ? { borderBottomRightRadius: height / 2, borderTopRightRadius: height / 2 } : {},
        ]}
      >
        { content.element(selected) }
      </Ripple>
    </>
  );
}

export default function ArkhamButtonGroup({
  buttons,
  selectedIndexes,
  onPress,
}: Props) {
  const { colors, fontScale } = useContext(StyleContext);
  const [localSelectedIndexes, setLocalSelectedIndexes] = useState(selectedIndexes);
  useEffectUpdate(() => {
    setLocalSelectedIndexes(selectedIndexes);
  }, [selectedIndexes]);
  const onPressIndex = useCallback((idx: number) => {
    const selection = new Set(selectedIndexes);
    const newSelection = selection.has(idx) ? filter(selectedIndexes, x => x !== idx) : [...selectedIndexes, idx];
    setLocalSelectedIndexes(newSelection);
    InteractionManager.runAfterInteractions(() => onPress(newSelection));
  }, [selectedIndexes, setLocalSelectedIndexes, onPress]);
  const selection = useMemo(() => new Set(localSelectedIndexes), [localSelectedIndexes]);
  const height = 28 * fontScale + 20;
  return (
    <View style={styles.wrapper}>
      <View style={[styles.buttonWrapper, { borderColor: colors.M, borderRadius: height / 2, height, backgroundColor: colors.L30 }]}>
        { map(buttons, (button, idx) => {
          const last = idx === (buttons.length - 1);
          return (
            <SingleButton
              idx={idx}
              key={idx}
              content={button}
              selected={selection.has(idx)}
              last={last}
              onPressIndex={onPressIndex} height={height}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    margin: 8,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  button: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
