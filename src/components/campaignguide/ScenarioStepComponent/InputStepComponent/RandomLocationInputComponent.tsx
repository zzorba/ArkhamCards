import React, { useCallback, useContext, useMemo, useReducer } from 'react';
import { StyleSheet, View } from 'react-native';
import { filter, flatMap, map, throttle, shuffle } from 'lodash';
import { t } from 'ttag';

import CardSearchResult from '@components/cardlist/CardSearchResult';
import PickerStyleButton from '@components/core/PickerStyleButton';
import { RandomLocationInput } from '@data/scenario/types';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import useCardList from '@components/card/useCardList';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';
import InputWrapper from '@components/campaignguide/prompts/InputWrapper';
import ActionButton from '@components/campaignguide/prompts/ActionButton';

interface Props {
  input: RandomLocationInput;
}

export default function RandomLocationInputComponent({ input }: Props) {
  const { scenarioState } = useContext(ScenarioGuideContext);
  const { borderStyle, colors } = useContext(StyleContext);
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
  }, 500, { leading: true, trailing: false }), [scenarioState]);

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
    <InputWrapper editable onSubmit={done}>
      { !input.multiple ? (
        <PickerStyleButton
          id="single"
          noBorder
          title={t`Random location`}
          value={selectedCards.length ? selectedCards[0].name : ''}
          onPress={drawLocation}
          widget="shuffle"
        />
      ) : (
        <>
          <View style={[styles.row, space.paddingBottomXs]}>
            <ActionButton
              color="light"
              leftIcon="plus-thin"
              title={t`Draw location`}
              disabled={selectedCards.length >= cards.length}
              onPress={drawLocation}
            />
            <ActionButton
              color="light"
              title={t`Reshuffle`}
              leftIcon="shuffle"
              disabled={choices.length === 0}
              onPress={clearLocations}
            />
          </View>
          <View style={[selectedCards.length ? styles.wrapper : {}, borderStyle]}>
            { map(selectedCards, card => (
              <CardSearchResult noBorder backgroundColor={colors.L20} key={card.code} card={card} />
            )) }
          </View>
        </>
      ) }
    </InputWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
