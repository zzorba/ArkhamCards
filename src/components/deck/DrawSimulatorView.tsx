import React, { useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { concat, filter, flatMap, map, shuffle, range, without, keys } from 'lodash';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { c, t } from 'ttag';
import { SlideInLeft, SlideOutRight } from 'react-native-reanimated';

import { TouchableShrink } from '@components/core/Touchables';
import { Customizations, Slots } from '@actions/types';
import CardSearchResult from '../cardlist/CardSearchResult';
import space, { m, s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useEffectUpdate, usePlayerCardsFunc, useSettingValue } from '@components/core/hooks';
import { Navigation, OptionsTopBar, OptionsTopBarButton } from 'react-native-navigation';
import ListToggleButton from './ListToggleButton';
import { NavigationProps } from '@components/nav/types';
import AppIcon from '@icons/AppIcon';
import Card from '@data/types/Card';
import { showCard } from '@components/nav/helper';
import colors from '@styles/colors';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import CardImage from '@components/card/CardImage';
import { CARD_RATIO } from '@styles/sizes';
import CardGridComponent from '@components/cardlist/CardGridComponent';
import LanguageContext from '@lib/i18n/LanguageContext';

export interface DrawSimulatorProps {
  slots: Slots;
  customizations: Customizations;
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

function Button({ title, disabled, onPress, square, icon, color = 'light', accessibilityLabel }: { accessibilityLabel?: string; title?: string; square?: boolean; disabled?: boolean; onPress: () => void; color?: 'light' | 'dark' | 'red', icon?: string }) {
  const { colors, typography } = useContext(StyleContext);
  const backgroundColor = useMemo(() => {
    switch (color) {
      case 'dark': return colors.D20;
      case 'light': return colors.D10;
      case 'red': return colors.warn;
    }
  }, [color, colors]);
  return (
    <View style={[space.paddingLeftS, !square ? { flex: 1 } : undefined]}>
      <TouchableShrink disabled={disabled} onPress={onPress} accessibilityLabel={accessibilityLabel}>
        <View style={[
          square ? { width: 50, justifyContent: 'center' } : { justifyContent: 'flex-start' },
          { borderRadius: 8, padding: s, height: 50, backgroundColor, flexDirection: 'row', alignItems: 'center' },
        ]}>
          { !!icon && <AppIcon name={icon} size={32} color={disabled ? colors.M : colors.L30} /> }
          { !!title && (
            <Text style={[square ? typography.counter : typography.large, icon ? space.paddingLeftXs : undefined, typography.center, disabled ? { color: colors.M } : { color: colors.L30 }]}>
              {title}
            </Text>
          ) }
        </View>
      </TouchableShrink>
    </View>
  )
}

export function navigationOptions(
  {
    lightButton,
  }: {
    lightButton?: boolean;
  }
){
  const rightButtons: OptionsTopBarButton[] = [{
    id: 'grid',
    component: {
      name: 'ListToggleButton',
      passProps: {
        setting: 'card_grid',
        lightButton,
      },
      width: ListToggleButton.WIDTH,
      height: ListToggleButton.HEIGHT,
    },
    accessibilityLabel: t`Grid`,
    enabled: true,
  }];
  const topBarOptions: OptionsTopBar = {
    rightButtons,
  };

  return {
    topBar: topBarOptions,
  };
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

function GridControl({ item, toggleSelection }: { item: Item; toggleSelection: (id: string) => void; }) {
  const onToggle = useCallback(() => toggleSelection(item.key), [toggleSelection, item.key]);
  return (
    <ArkhamSwitch value={item.selected} onValueChange={onToggle} />
  );
}

function CardItem({ item, card, width, onPress, toggleSelection, grid }: { width: number; grid: boolean; onPress: (card: Card) => void; toggleSelection: (id: string) => void; item: Item; card: Card }) {
  const onGridPress = useCallback(() => onPress(card), [onPress, card]);
  const onToggle = useCallback(() => toggleSelection(item.key), [toggleSelection, item.key]);
  if (grid) {
    return (
      <View style={{ flexDirection: 'column', alignItems: 'center', width: width + s, height: CARD_RATIO * width + 60, paddingRight: s, paddingBottom: m }}>
        <ArkhamSwitch value={item.selected} onValueChange={onToggle} />
        <View style={space.paddingTopXs}>
          <TouchableShrink onPress={onGridPress}>
            <CardImage card={card} width={width} superCompact />
          </TouchableShrink>
        </View>
      </View>
    );
  }
  return (
    <CardSearchResult
      key={item.key}
      id={item.key}
      card={card}
      onPress={onPress}
      backgroundColor={item.selected ? colors.L20 : undefined}
      control={{
        type: 'toggle',
        value: item.selected,
        toggleValue: onToggle,
      }}
    />
  );
}

export default function DrawSimulatorView({ componentId, customizations, slots }: DrawSimulatorProps & NavigationProps) {
  const { backgroundStyle, colors, typography, width } = useContext(StyleContext);
  useEffect(() => {
    Navigation.mergeOptions(componentId, navigationOptions({ lightButton: true }));
  }, [componentId]);
  const [cards] = usePlayerCardsFunc(() => keys(slots), [slots], 0);
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
  const gridView = useSettingValue('card_grid');
  const toggleSelection = useCallback((id: string) => {
    updateDrawState({ type: 'selection', id });
  }, [updateDrawState]);

  const header = useMemo(() => {
    const {
      shuffledDeck,
      drawnCards,
      selectedCards,
    } = drawState;
    const deckEmpty = shuffledDeck.length === 0;
    const noSelection = selectedCards.length === 0;
    return (
      <View style={styles.controlsContainer}>
        <View style={[styles.drawButtonRow, { backgroundColor: colors.L10 }]}>
          <AppIcon name="draw" size={32} color={colors.D10} />
          <Text style={[typography.large, { color: colors.darkText }]}>{ t`Draw` }</Text>
          <View style={styles.buttonContainer}>
            <Button
              title="×1"
              disabled={deckEmpty}
              onPress={drawOne}
              square
            />
            <Button
              title="×2"
              disabled={deckEmpty}
              onPress={drawTwo}
              square
            />
            <Button
              title="×5"
              disabled={deckEmpty}
              onPress={drawFive}
              square
            />
            <Button
              title="∞"
              accessibilityLabel={c('Draw Cards').t`All`}
              disabled={deckEmpty}
              onPress={drawAll}
              square
              color="dark"
            />
            <Button
              icon="dismiss"
              accessibilityLabel={t`Reset`}
              color="red"
              square
              disabled={drawnCards.length === 0}
              onPress={resetDeck}
            />
          </View>
        </View>
        <View style={[styles.drawButtonRow, { backgroundColor: colors.L20 }]}>
          <Text style={[typography.smallLabel, { color: colors.darkText }]}>{ t`Selection` }</Text>
          <View style={styles.buttonContainer}>
            <Button
              icon="draft"
              title={t`Redraw`}
              disabled={noSelection}
              onPress={redrawSelected}
            />
            <Button
              icon="undo"
              title={t`Reshuffle`}
              disabled={noSelection}
              onPress={reshuffleSelected}
            />
          </View>
        </View>
      </View>
    );
  }, [colors, typography, drawState, drawOne, drawTwo, drawFive, drawAll, redrawSelected, reshuffleSelected, resetDeck]);

  const onCardPress = useCallback((card: Card) => {
    showCard(componentId, card.code, card, colors, true, undefined, customizations);
  }, [componentId, colors, customizations]);
  const cardWidth = useMemo(() => {
    let cardsPerRow = 10;
    let cardWidth = (width - s) / cardsPerRow - s;
    while (cardsPerRow > 2) {
      if (cardWidth > 110) {
        break;
      }
      cardsPerRow--;
      cardWidth = (width - s) / cardsPerRow - s;
    }
    return cardWidth;
  }, [width]);
  const { listSeperator } = useContext(LanguageContext);
  const renderCardItem = useCallback(({ item }: { item: Item }) => {
    const card = cards && cards[item.code];
    if (!card) {
      return null;
    }
    return (
      <CardItem
        key={item.key}
        width={cardWidth}
        grid={gridView}
        item={item}
        card={card.withCustomizations(listSeperator, customizations[card.code])}
        onPress={onCardPress}
        toggleSelection={toggleSelection}
      />
    );
  }, [cards, cardWidth, gridView, listSeperator, customizations, onCardPress, toggleSelection]);

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
      enterAnimation: SlideInLeft.duration(500),
      exitAnimation: SlideOutRight.duration(250),
    };
  }), [drawState.drawnCards, selectedSet]);

  const renderGridControl = useCallback((item: Item) => {
    return (
      <GridControl
        item={item}
        toggleSelection={toggleSelection}
      />
    );
  }, [toggleSelection]);
  return (
    <View style={[styles.container, backgroundStyle]}>
      { header }
      { gridView ? (
        <CardGridComponent
          items={data}
          cards={cards}
          componentId={componentId}
          controlHeight={40}
          controlForCard={renderGridControl}
        />
      ) : (
        <FlatList
          data={data}
          renderItem={renderCardItem}
        />
      ) }
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
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: s,
  },
});
