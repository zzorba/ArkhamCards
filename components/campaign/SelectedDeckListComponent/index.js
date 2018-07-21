import React from 'react';
import PropTypes from 'prop-types';
import { forEach, map } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';
import { connectRealm } from 'react-native-realm';

import AddDeckRow from '../../AddDeckRow';
import DeckRow from './DeckRow';

function SelectedDeckListComponent({
  navigator,
  deckIds,
  deckUpdates = {},
  deckUpdatesChanged,
  deckAdded,
  deckRemoved,
  cards,
  investigators,
  noLimit,
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
      { (noLimit || deckIds.length < 4) && (
        <View style={styles.addDeckButton}>
          <AddDeckRow
            navigator={navigator}
            deckAdded={deckAdded}
            selectedDeckIds={deckIds}
          />
        </View>
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
  noLimit: PropTypes.bool,
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
  addDeckButton: {
    marginTop: 8,
  },
});
