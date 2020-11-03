import React, { useCallback, useContext, useMemo, useReducer } from 'react';
import { StyleSheet, View } from 'react-native';
import { filter, flatMap, map, throttle, shuffle } from 'lodash';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import CardListWrapper from '@components/card/CardListWrapper';
import PickerStyleButton from '@components/core/PickerStyleButton';
import Card from '@data/Card';
import { RandomLocationInput } from '@data/scenario/types';
import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import { m, l } from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  input: RandomLocationInput;
}

interface State {
  choices: number[];
}


export default function RandomLocationInputComponent({ input }: Props) {
  const { scenarioState } = useContext(ScenarioStepContext);
  const { borderStyle } = useContext(StyleContext);
  const [choices, updateChoices] = useReducer((state: number[], action: 'draw' | 'clear') => {
    switch (action) {
      case 'draw': {
        if (input.multiple) {
          const existingChoices = new Set(state);
          const remainingCards = filter(
            map(input.cards, (card, idx) => idx),
            idx => !existingChoices.has(idx)
          );
          if (!remainingCards.length) {
            return state;
          }
          return [
            ...state,
            shuffle(remainingCards)[0],
          ];
        }
        const choice = Math.floor(Math.random() * input.cards.length);
        return state.length ? [] : [choice];
      }
      case 'clear':
        return [];
    }
  }, []);
  const done = useMemo(() => throttle(() => {
    scenarioState.undo();
  }, 500), [scenarioState]);

  const drawLocation = useCallback(() => {
    updateChoices('draw');
  }, [updateChoices]);

  const clearLocations = useCallback(() => {
    updateChoices('clear');
  }, [updateChoices]);

  const renderCards = useCallback((cards: Card[]) => {
    const selectedCards = flatMap(choices, idx => cards[idx] || []);
    if (!input.multiple) {
      return (
        <View style={[styles.wrapper, borderStyle]}>
          <PickerStyleButton
            id="single"
            title={t`Random location`}
            value={selectedCards.length ?
              selectedCards[0].name :
              ''
            }
            onPress={drawLocation}
            widget="shuffle"
          />
        </View>
      );
    }
    return (
      <>
        <BasicButton
          title={t`Draw location`}
          disabled={selectedCards.length >= cards.length}
          onPress={drawLocation}
        />
        <BasicButton
          title={t`Reshuffle`}
          disabled={choices.length === 0}
          onPress={clearLocations}
        />
        <View style={[selectedCards.length ? styles.wrapper : {}, borderStyle]}>
          { map(selectedCards, card => (
            <CardSearchResult
              key={card.code}
              card={card}
            />
          )) }
        </View>
      </>
    );
  }, [input, choices, borderStyle, clearLocations, drawLocation]);

  return (
    <View style={styles.container}>
      <CardListWrapper
        type="encounter"
        codes={input.cards}
      >
        { (cards: Card[]) => renderCards(cards) }
      </CardListWrapper>
      <BasicButton
        title={t`Done`}
        onPress={done}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  container: {
    marginTop: m,
    marginBottom: l * 3,
  },
});
