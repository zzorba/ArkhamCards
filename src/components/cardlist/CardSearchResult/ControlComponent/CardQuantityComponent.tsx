import React, { useCallback, useContext, useRef, useState } from 'react';
import { range } from 'lodash';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Button from '@components/core/Button';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import CountButton from '../CountButton';
import { rowHeight, buttonWidth, BUTTON_PADDING, toggleButtonMode } from '../constants';
import { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { EditSlotsActions, useCounter, useEffectUpdate, useFlag } from '@components/core/hooks';

interface Props {
  code: string;
  count: number;
  countChanged: EditSlotsActions;
  limit: number;
  showZeroCount?: boolean;
  forceBig?: boolean;
}
function TinyCardQuantityComponent({ code, count: propsCount, countChanged: { setSlot }, limit }: Props) {
  const { borderStyle, fontScale } = useContext(StyleContext);
  const [open, toggleOpen, setOpen] = useFlag(false);
  const slideAnim = useRef(new Animated.Value(0));
  const [count, setCount] = useState(propsCount);

  useEffectUpdate(() => {
    setCount(propsCount);
  }, [propsCount]);

  useEffectUpdate(() => {
    Animated.timing(slideAnim.current, {
      toValue: open ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [open]);

  const selectCount = useCallback((count: number) => {
    setCount(count);
    setOpen(false);
    setTimeout(() => setSlot(code, count), 100);
  }, [setOpen, setCount, code, setSlot]);

  const drawerWidth = BUTTON_PADDING + (buttonWidth(fontScale) + BUTTON_PADDING) * (limit + 1);
  const translateX = slideAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -drawerWidth],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.tinyContainer, { height: rowHeight(fontScale) }]} pointerEvents="box-none">
      <Button
        style={[styles.button, { width: buttonWidth(fontScale) }]}
        color={count === 0 ? 'white' : undefined}
        size="small"
        align="center"
        width={buttonWidth(fontScale)}
        text={count.toString()}
        onPress={toggleOpen}
      />
      <View style={styles.drawer} pointerEvents="box-none">
        <Animated.View style={[
          styles.slideDrawer,
          borderStyle,
          {
            height: rowHeight(fontScale),
            width: drawerWidth,
            transform: [{ translateX: translateX }],
          },
        ]}>
          <LinearGradient
            style={styles.gradient}
            colors={['#a0a0a0', '#f3f3f3']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
          >
            { range(0, limit + 1).map(buttonIdx => (
              <CountButton
                key={buttonIdx}
                count={buttonIdx}
                text={`${buttonIdx}`}
                selected={count === buttonIdx}
                onPress={selectCount}
              />
            )) }
          </LinearGradient>
        </Animated.View>
      </View>
    </View>
  );
}

function NormalCardQuantityComponent({ code, count: propsCount, countChanged: { incSlot, decSlot }, limit, showZeroCount, forceBig }: Props) {
  const { fontScale, typography } = useContext(StyleContext);
  const [count, incCount, decCount, setCount] = useCounter(propsCount, { min: 0, max: limit });
  useEffectUpdate(() => {
    setCount(propsCount);
  }, [propsCount]);

  const inc = useCallback(() => {
    incCount();
    setTimeout(() => incSlot(code), 100);
  }, [incCount, incSlot, code]);
  const dec = useCallback(() => {
    decCount();
    setTimeout(() => decSlot(code), 100);
  }, [decCount, decSlot, code]);

  return (
    <View style={[styles.row, { height: rowHeight(fontScale) }]}>
      <PlusMinusButtons
        count={count}
        size={36}
        onIncrement={inc}
        onDecrement={dec}
        max={limit}
        color={forceBig ? 'white' : undefined}
        hideDisabledMinus
        countRender={
          <Text style={[typography.text, styles.count, forceBig ? { color: 'white', fontSize: 22 } : {}]}>
            { (showZeroCount || count !== 0) ? count : ' ' }
          </Text>
        }
      />
    </View>
  );
}

/**
 * Simple sliding card count.
 */
export default function CardQuantityComponent(props: Props) {
  const { fontScale } = useContext(StyleContext);

  if (toggleButtonMode(fontScale) && !props.forceBig) {
    return <TinyCardQuantityComponent {...props} />;
  }
  return <NormalCardQuantityComponent {...props} />;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: xs,
  },
  count: {
    marginLeft: xs,
    width: 16,
    textAlign: 'center',
    marginRight: s,
    fontWeight: '600',
  },
  tinyContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'visible',
  },
  button: {
    marginTop: xs,
    marginBottom: xs,
    marginRight: xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawer: {
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: '100%',
    overflow: 'visible',
  },
  slideDrawer: {
    borderLeftWidth: 1,
  },
  gradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: BUTTON_PADDING,
  },
});
