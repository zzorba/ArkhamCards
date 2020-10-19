import StyleContext from '@styles/StyleContext';
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { filter, map } from 'lodash';

import Ripple from '@lib/react-native-material-ripple';

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
  const onPress = () => {
    onPressIndex(idx);
  };

  return (
    <>
      <Ripple
        onPress={onPress}
        style={[
          styles.button,
          { height, backgroundColor: selected ? colors.L10 : colors.M },
          idx === 0 ? { borderTopLeftRadius: height / 2, borderBottomLeftRadius: height / 2 } : {},
          last ? { borderBottomRightRadius: height / 2, borderTopRightRadius: height / 2 } : {},
        ]}
      >
        { content.element(selected) }
      </Ripple>
      { !last && (
        <View
          key={`divider-${idx}`}
          style={[styles.divider, { marginLeft: -1.5, height: height - 16, backgroundColor: colors.L10 }]}
        />
      ) }
    </>
  );
}

export default function ArkhamButtonGroup({
  buttons,
  selectedIndexes,
  onPress,
}: Props) {
  const { colors, fontScale } = useContext(StyleContext);
  const selection = new Set(selectedIndexes);
  const onPressIndex = (idx: number) => {
    if (selection.has(idx)) {
      onPress(filter(selectedIndexes, x => x !== idx));
    } else {
      onPress([...selectedIndexes, idx]);
    }
  };
  const height = 18 * fontScale + 20;
  return (
    <View style={styles.wrapper}>
      <View style={[styles.buttonWrapper, { borderRadius: height / 2, height, backgroundColor: colors.M }]}>
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
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
  },
  button: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    width: 1,
  },
});
