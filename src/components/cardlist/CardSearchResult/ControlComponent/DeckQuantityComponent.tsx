import React, { useCallback, useMemo, useContext, useState, useRef } from 'react';
import { InteractionManager, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { t } from 'ttag';

import AppIcon from '@icons/AppIcon';
import RoundButton from '@components/core/RoundButton';
import { EditSlotsActions, useEffectUpdate } from '@components/core/hooks';
import { incDeckSlot, decDeckSlot, setDeckSlot } from '@components/deck/actions';
import CardQuantityComponent from './CardQuantityComponent';
import { useDeckSlotCount } from '@components/deck/hooks';
import { DeckId } from '@actions/types';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface DeckCardQuantityProps {
  deckId: DeckId;
  code: string;
  limit: number;
  side?: boolean;
  showZeroCount?: boolean;
  forceBig?: boolean;
  useGestureHandler?: boolean;
}

function DeckQuantityComponent(props: DeckCardQuantityProps) {
  const { colors } = useContext(StyleContext);
  const { deckId, code, limit, showZeroCount, forceBig, useGestureHandler, side } = props;
  const actualCount = useDeckSlotCount(deckId, code, side);

  const [count, setCount] = useState(actualCount);
  useEffectUpdate(() => {
    setCount(actualCount)
  }, [setCount, actualCount]);
  const countRef = useRef(count);
  countRef.current = count;
  const dispatch = useDispatch();
  const countChanged: EditSlotsActions = useMemo(() => {
    return {
      setSlot: (code: string, count: number) => {
        setCount(count);
        InteractionManager.runAfterInteractions(() => dispatch(setDeckSlot(deckId, code, count, side)));
      },
      incSlot: (code: string) => {
        setCount(Math.min(limit, countRef.current + 1));
        InteractionManager.runAfterInteractions(() => dispatch(incDeckSlot(deckId, code, limit, side)));
      },
      decSlot: (code: string) => {
        setCount(Math.max(0, countRef.current - 1));
        InteractionManager.runAfterInteractions(() => dispatch(decDeckSlot(deckId, code, side)));
      },
    };
  }, [dispatch, deckId, limit, side, setCount]);
  const onSidePress = useCallback(() => {
    InteractionManager.runAfterInteractions(() => {
      setCount(Math.max(0, countRef.current - 1));
      dispatch(decDeckSlot(deckId, code, true));
      dispatch(incDeckSlot(deckId, code, limit, false));
    });
  }, [dispatch, deckId, code, limit]);
  return (
    <>
      { !!side && count > 0 && (
        <View style={space.marginRightS}>
          <RoundButton onPress={onSidePress} accessibilityLabel={t`Move to deck`}>
            <View style={styles.icon}>
              <AppIcon
                size={32}
                color={colors.M}
                name="above_arrow"
              />
            </View>
          </RoundButton>
        </View>
      ) }
      <CardQuantityComponent
        code={code}
        limit={limit}
        countChanged={countChanged}
        count={count || 0}
        showZeroCount={showZeroCount}
        forceBig={forceBig}
        useGestureHandler={useGestureHandler}
      />
    </>
  );
}

export default React.memo(DeckQuantityComponent);


const styles = StyleSheet.create({
  icon: {
    paddingRight: 6,
    paddingBottom: 2,
    transform: [{ scaleX: -1 }],
  },
});