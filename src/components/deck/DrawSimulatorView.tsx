import React, { useCallback, useContext, useMemo, useReducer } from 'react';
import { concat, filter, flatMap, map, shuffle, range, without, keys } from 'lodash';
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
import { useEffectUpdate, usePlayerCardsFunc } from '@components/core/hooks';

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

interface DrawCardsAction {
  type: 'draw';
  count: number | 'all';
}
interface ResetAction {
  type: 'reset';
  shuffledDeck: string[];
}
interface ToggleSelectionAction {
  type: 'selection';
  id: string;
}

interface ReshuffleSelected {
  type: 'reshuffle';
}


interface RedrawSelected {
  type: 'redraw';
}

type DrawnStateAction = DrawCardsAction | ToggleSelectionAction | ResetAction | ReshuffleSelected | RedrawSelected;

function Button({ title, disabled, onPress }: { title: string; disabled?: boolean; onPress: () => void }) {
  const { colors, typography } = useContext(StyleContext);
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <View style={{ borderRadius: 4, padding: xs, backgroundColor: colors.L20 }}>
        <Text style={[typography.button, typography.center, disabled ? { color: colors.M } : { color: colors.D20 }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}


function drawHelper(drawState: DrawnState, count: number | 'all'): {
  shuffledDeck: string[];
  drawnCards: string[];
} {
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
}

export default function DrawSimulatorView({ slots }: DrawSimulatorProps) {
  const { backgroundStyle, colors, typography } = useContext(StyleContext);
  const cards = usePlayerCardsFunc(() => keys(slots), [slots], 0);
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
  const [drawState, updateDrawState] = useReducer<React.Reducer<DrawnState, DrawnStateAction>>((state: DrawnState, action: DrawnStateAction): DrawnState => {
    switch (action.type) {
      case 'selection': {
        if (state.selectedCards.indexOf(action.id) !== -1) {
          return {
            ...state,
            selectedCards: without(state.selectedCards, action.id),
          };
        }
        return {
          ...state,
          selectedCards: [
            ...state.selectedCards,
            action.id,
          ],
        };
      }
      case 'reshuffle': {
        const selectedSet = new Set(state.selectedCards);
        const newDrawnCards = filter(state.drawnCards, key => !selectedSet.has(key));
        return {
          shuffledDeck: shuffle(concat(state.shuffledDeck, state.selectedCards)),
          drawnCards: newDrawnCards,
          selectedCards: [],
        };
      }
      case 'redraw': {
        const {
          drawnCards,
          shuffledDeck,
        } = drawHelper(state, state.selectedCards.length);
        const selectedSet = new Set(state.selectedCards);
        const newDrawnCards = filter(drawnCards, key => !selectedSet.has(key));
        return {
          shuffledDeck: shuffle(concat(shuffledDeck, state.selectedCards)),
          drawnCards: newDrawnCards,
          selectedCards: [],
        };
      }
      case 'reset':
        return {
          shuffledDeck: action.shuffledDeck,
          drawnCards: [],
          selectedCards: [],
        };
      case 'draw':
        return {
          ...drawHelper(state, action.count),
          selectedCards: state.selectedCards,
        };
    }
  },
  {
    shuffledDeck: shuffleFreshDeck(),
    drawnCards: [],
    selectedCards: [],
  });


  const resetDeck = useCallback(() => {
    updateDrawState({ type: 'reset', shuffledDeck: shuffleFreshDeck() });
  }, [updateDrawState, shuffleFreshDeck]);

  const reshuffleSelected = useCallback(() => {
    updateDrawState({ type: 'reshuffle' });
  }, [updateDrawState]);

  useEffectUpdate(() => {
    resetDeck();
  }, [cards, slots]);
  const redrawSelected = useCallback(() => updateDrawState({ type: 'redraw' }), [updateDrawState]);
  const drawOne = useCallback(() => updateDrawState({ type: 'draw', count: 1 }), [updateDrawState]);
  const drawTwo = useCallback(() => updateDrawState({ type: 'draw', count: 2 }), [updateDrawState]);
  const drawFive = useCallback(() => updateDrawState({ type: 'draw', count: 5 }), [updateDrawState]);
  const drawAll = useCallback(() => updateDrawState({ type: 'draw', count: 'all' }), [updateDrawState]);

  const toggleSelection = useCallback((id: string) => {
    updateDrawState({ type: 'selection', id });
  }, [updateDrawState]);

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
        onPressDebounce={100}
        backgroundColor={item.selected ? colors.L20 : undefined}
      />
    );
  }, [cards, colors, toggleSelection]);

  const selectedSet = useMemo(() => new Set(drawState.selectedCards), [drawState.selectedCards]);
  const data = useMemo(() => flatMap(drawState.drawnCards, cardKey => {
    if (!cardKey) {
      return [];
    }
    const parts = cardKey.split('-');
    return {
      key: cardKey,
      code: parts[0],
      selected: selectedSet.has(cardKey),
    };
  }), [drawState.drawnCards, selectedSet]);
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
