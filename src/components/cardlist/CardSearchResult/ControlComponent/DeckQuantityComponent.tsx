import React, { useCallback, useMemo, useContext, useState, useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
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
  mode?: 'side' | 'extra' | 'ignore';
  showZeroCount?: boolean;
  forceBig?: boolean;
  editable?: boolean;
}

function DeckQuantityComponent({ deckId, editable, code, limit, showZeroCount, forceBig, mode }: DeckCardQuantityProps) {
  const { colors } = useContext(StyleContext);
  const [actualCount, ignoreCount] = useDeckSlotCount(deckId, code, mode);
  const [count, setCount] = useState(actualCount);
  useEffectUpdate(() => {
    setCount(actualCount)
  }, [setCount, actualCount]);
  const countRef = useRef(count);
  useEffect(() => {
    countRef.current = count;
  }, [count]);
  const dispatch = useDispatch();
  const countChanged: EditSlotsActions = useMemo(() => {
    return {
      setSlot: (code: string, count: number) => {
        setCount(count);
        setTimeout(() => dispatch(setDeckSlot(deckId, code, count, mode)), 20);
      },
      incSlot: (code: string) => {
        setCount(Math.min(limit, countRef.current + 1));
        setTimeout(() => dispatch(incDeckSlot(deckId, code, limit, mode)), 20);
      },
      decSlot: (code: string) => {
        setCount(Math.max(0, countRef.current - 1));
        setTimeout(() => dispatch(decDeckSlot(deckId, code, mode)), 20);
      },
    };
  }, [dispatch, deckId, limit, mode, setCount]);
  const onSidePress = useCallback(() => {
    setCount(Math.max(0, countRef.current - 1));
    setTimeout(() => {
      dispatch(decDeckSlot(deckId, code, 'side'));
      dispatch(incDeckSlot(deckId, code, limit, undefined));
    }, 20);
  }, [dispatch, deckId, code, limit]);
  return (
    <>
      { mode === 'side' && count > 0 && !!editable && (
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
        adjustment={-ignoreCount}
        showZeroCount={showZeroCount}
        forceBig={forceBig}
        locked={!editable}
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