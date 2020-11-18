import React, { useCallback, useContext, useMemo, useReducer } from 'react';
import { StyleSheet, View } from 'react-native';
import { filter, flatMap, map, throttle, shuffle } from 'lodash';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import PickerStyleButton from '@components/core/PickerStyleButton';
import { RandomLocationInput } from '@data/scenario/types';
import { m, l } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import useCardList from '@components/card/useCardList';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';

interface Props {
  input: RandomLocationInput;
}

interface State {
  choices: number[];
}


export default function RandomLocationInputComponent({ input }: Props) {
  const { scenarioState } = useContext(ScenarioGuideContext);
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
  const [cards, loading] = useCardList(input.cards, 'encounter');
  if (loading || !cards) {
    return null;
  }

  const selectedCards = flatMap(choices, idx => cards[idx] || []);
  return (
    <View style={styles.container}>
      { !input.multiple ? (
        <View style={[styles.wrapper, borderStyle]}>
          <PickerStyleButton
            id="single"
            title={t`Random location`}
            value={selectedCards.length ? selectedCards[0].name : ''}
            onPress={drawLocation}
            widget="shuffle"
          />
        </View>
      ) : (
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
              <CardSearchResult key={card.code} card={card} />
            )) }
          </View>
        </>
      ) }
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
