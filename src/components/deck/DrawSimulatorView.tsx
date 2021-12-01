import React, { useCallback, useContext, useMemo, useState } from 'react';
import { concat, filter, flatMap, map, shuffle, range, without } from 'lodash';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { c, t } from 'ttag';

import { Slots } from '@actions/types';
import CardSearchResult from '../cardlist/CardSearchResult';
import { s, xs } from '@styles/space';
import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import StyleContext from '@styles/StyleContext';
import { useEffectUpdate, usePlayerCards } from '@components/core/hooks';

export interface DrawSimulatorProps {
  slots: Slots;
}

interface Item {
  key: string;
  code: string;
  selected: boolean;
}

interface DrawnState {
  shuffledDeck: string[];
  drawnCards: string[];
  selectedCards: string[];
}

function Button({ title, disabled, onPress }: { title: string; disabled?: boolean; onPress: () => void }) {
  const { colors, typography } = useContext(StyleContext);
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <View style={{ borderRadius: 4, padding: s, backgroundColor: colors.L20 }}>
        <Text style={[typography.button, typography.center, typography.light]}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default function DrawSimulatorView({ slots }: DrawSimulatorProps) {
  const { backgroundStyle, colors, typography } = useContext(StyleContext);
  const cards = usePlayerCards();
  const shuffleFreshDeck = useCallback(() => {
    return shuffle(
      flatMap(
        Object.keys(slots),
        cardId => {
          const card = cards && cards[cardId];
          if (!card) {
            return [];
          }
          // DUKE=02014
          if (card.permanent || card.double_sided || card.code === '02014') {
            return [];
          }
          return map(range(0, slots[cardId]), copy => `${cardId}-${copy}`);
        }));
  }, [cards, slots]);
  const [drawState, setDrawState] = useState<DrawnState>({
    shuffledDeck: shuffleFreshDeck(),
    drawnCards: [],
    selectedCards: [],
  });


  const resetDeck = useCallback(() => {
    setDrawState({
      shuffledDeck: shuffleFreshDeck(),
      drawnCards: [],
      selectedCards: [],
    });
  }, [setDrawState, shuffleFreshDeck]);

  const reshuffleSelected = useCallback(() => {
    const {
      selectedCards,
      drawnCards,
      shuffledDeck,
    } = drawState;
    const selectedSet = new Set(selectedCards);
    const newDrawnCards = filter(drawnCards, key => !selectedSet.has(key));
    setDrawState({
      shuffledDeck: shuffle(concat(shuffledDeck, selectedCards)),
      drawnCards: newDrawnCards,
      selectedCards: [],
    });
  }, [drawState, setDrawState]);

  useEffectUpdate(() => {
    resetDeck();
  }, [cards, slots]);

  const drawHelper = useCallback((count: number | 'all') => {
    const {
      drawnCards,
      shuffledDeck,
    } = drawState;
    if (count === 'all') {
      return {
        drawnCards: [
          ...shuffledDeck,
          ...drawnCards,
        ],
        shuffledDeck: [],
      };
    }

    return {
      drawnCards: [
        ...shuffledDeck.slice(0, count),
        ...drawnCards,
      ],
      shuffledDeck: shuffledDeck.slice(count),
    };
  }, [drawState]);

  const redrawSelected = useCallback(() => {
    const {
      selectedCards,
    } = drawState;
    const {
      drawnCards,
      shuffledDeck,
    } = drawHelper(selectedCards.length);

    const selectedSet = new Set(selectedCards);
    const newDrawnCards = filter(drawnCards, key => !selectedSet.has(key));
    setDrawState({
      shuffledDeck: shuffle(concat(shuffledDeck, selectedCards)),
      drawnCards: newDrawnCards,
      selectedCards: [],
    });
  }, [drawState, drawHelper, setDrawState]);


  const draw = useCallback((count: number | 'all') => {
    setDrawState({
      selectedCards: drawState.selectedCards,
      ...drawHelper(count),
    });
  }, [drawState, drawHelper, setDrawState]);

  const drawOne = useCallback(() => draw(1), [draw]);
  const drawTwo = useCallback(() => draw(2), [draw]);
  const drawFive = useCallback(() => draw(5), [draw]);
  const drawAll = useCallback(() => draw('all'), [draw]);

  const toggleSelection = useCallback((id: string) => {
    const {
      selectedCards,
    } = drawState;
    if (selectedCards.indexOf(id) !== -1) {
      setDrawState({
        ...drawState,
        selectedCards: without(selectedCards, id),
      });
    } else {
      setDrawState({
        ...drawState,
        selectedCards: [
          ...selectedCards,
          id,
        ],
      });
    }
  }, [drawState, setDrawState]);

  const footer = useMemo(() => {
    const {
      shuffledDeck,
      drawnCards,
      selectedCards,
    } = drawState;
    const deckEmpty = shuffledDeck.length === 0;
    const noSelection = selectedCards.length === 0;
    return (
      <View style={[styles.controlsContainer, { backgroundColor: colors.L10 }]}>
        <View style={[styles.drawButtonRow, { backgroundColor: colors.L10 }]}>
          <Text style={[typography.button, { color: colors.darkText }]}>{ t`Draw: ` }</Text>
          <View style={styles.buttonContainer}>
            <Button
              title="1"
              disabled={deckEmpty}
              onPress={drawOne}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="2"
              disabled={deckEmpty}
              onPress={drawTwo}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="5"
              disabled={deckEmpty}
              onPress={drawFive}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={c('Draw Cards').t`All`}
              disabled={deckEmpty}
              onPress={drawAll}
            />
          </View>
        </View>
        <View style={[styles.wrapButtonRow, { backgroundColor: colors.L10 }]}>
          <View style={styles.buttonContainer}>
            <Button
              title={t`Redraw`}
              disabled={noSelection}
              onPress={redrawSelected} />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={t`Reshuffle`}
              disabled={noSelection}
              onPress={reshuffleSelected} />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={t`Reset`}
              disabled={drawnCards.length === 0}
              onPress={resetDeck} />
          </View>
        </View>
      </View>
    );
  }, [colors, typography, drawState, drawOne, drawTwo, drawFive, drawAll, redrawSelected, reshuffleSelected, resetDeck]);

  const renderCardItem = useCallback(({ item }: { item: Item }) => {
    const card = cards && cards[item.code];
    if (!card) {
      return null;
    }
    return (
      <CardSearchResult
        key={item.key}
        id={item.key}
        card={card}
        onPressId={toggleSelection}
        backgroundColor={item.selected ? colors.L20 : undefined}
      />
    );
  }, [cards, colors, toggleSelection]);

  const {
    drawnCards,
    selectedCards,
  } = drawState;
  const selectedSet = useMemo(() => new Set(selectedCards), [selectedCards]);
  const data = useMemo(() => map(drawnCards, cardKey => {
    const parts = cardKey.split('-');
    return {
      key: cardKey,
      code: parts[0],
      selected: selectedSet.has(cardKey),
    };
  }), [drawnCards, selectedSet]);
  return (
    <View style={[styles.container, backgroundStyle]}>
      <FlatList
        data={data}
        renderItem={renderCardItem}
      />
      { footer }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  controlsContainer: {
    flexDirection: 'column',
    paddingBottom: NOTCH_BOTTOM_PADDING + s,
  },
  drawButtonRow: {
    width: '100%',
    paddingTop: xs,
    paddingBottom: xs,
    paddingLeft: s,
    paddingRight: s,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wrapButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  buttonContainer: {
    flex: 1,
    padding: s,
  },
});
