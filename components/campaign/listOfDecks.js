import React from 'react';
import PropTypes from 'prop-types';
import { forEach, map } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';
import { connectRealm } from 'react-native-realm';
import hoistNonReactStatic from 'hoist-non-react-statics';

import AddDeckRow from '../AddDeckRow';

export default function listOfDecks(DeckComponent) {
  class DeckListerComponent extends React.Component {
    static propTypes = {
      navigator: PropTypes.object.isRequired,
      deckIds: PropTypes.array.isRequired,
      deckAdded: PropTypes.func.isRequired,
      deckRemoved: PropTypes.func.isRequired,

      // From realm, not passed in.
      cards: PropTypes.object,
      investigators: PropTypes.object,
      deckLimit: PropTypes.number,
    };

    render() {
      const {
        navigator,
        deckIds,
        deckAdded,
        deckRemoved,
        cards,
        investigators,
        deckLimit,
        ...otherProps
      } = this.props;
      return (
        <View>
          { map(deckIds, deckId => (
            <DeckComponent
              key={deckId}
              navigator={navigator}
              id={deckId}
              cards={cards}
              investigators={investigators}
              remove={deckRemoved}
              {...otherProps}
            />
          )) }
          { (!deckLimit || deckIds.length < deckLimit) && (
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
  }

  const result = connectRealm(DeckListerComponent, {
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
  hoistNonReactStatic(result, DeckComponent);
  return result;
}

const styles = StyleSheet.create({
  addDeckButton: {
    marginTop: 8,
  },
});
