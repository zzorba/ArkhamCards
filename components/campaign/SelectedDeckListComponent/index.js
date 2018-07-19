import React from 'react';
import PropTypes from 'prop-types';
import { forEach, map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connectRealm } from 'react-native-realm';

import AddDeckRow from '../../AddDeckRow';
import DeckRow from './DeckRow';
import typography from '../../../styles/typography';

function SelectedDeckListComponent({
  navigator,
  deckIds,
  deckUpdates = {},
  deckUpdatesChanged,
  deckAdded,
  deckRemoved,
  cards,
  investigators,
}) {
  return (
    <View>
      { map(deckIds, deckId => (
        <DeckRow
          key={deckId}
          id={deckId}
          cards={cards}
          investigators={investigators}
          navigator={navigator}
          updatesChanged={deckUpdatesChanged}
          remove={deckRemoved}
          updates={deckUpdates[deckId] || {}}
        />
      )) }
      { deckIds.length < 4 && (
        <AddDeckRow
          navigator={navigator}
          deckAdded={deckAdded}
          selectedDeckIds={deckIds}
        />
      ) }
    </View>
  );
}

SelectedDeckListComponent.propTypes = {
  navigator: PropTypes.object.isRequired,
  deckUpdatesChanged: PropTypes.func,
  deckRemoved: PropTypes.func.isRequired,
  deckAdded: PropTypes.func.isRequired,
  deckIds: PropTypes.array.isRequired,
  deckUpdates: PropTypes.object,
  cards: PropTypes.object,
  investigators: PropTypes.object,
};

export default connectRealm(SelectedDeckListComponent, {
  schemas: ['Card'],
  mapToProps(results) {
    const investigators = {};
    const cards = {};
    forEach(results.cards, card => {
      cards[card.code] = card;
      if (card.type_code === 'investigator') {
        investigators[card.code] = card;
      }
    });
    return {
      cards,
      investigators,
    };
  },
});

const styles = StyleSheet.create({
  margin: {
    marginLeft: 8,
    marginRight: 8,
  },
});
