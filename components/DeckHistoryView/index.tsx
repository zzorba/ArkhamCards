import React from 'react';
import { map, reverse } from 'lodash';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import { t } from 'ttag';

import DeckProgressComponent from '../DeckProgressComponent';
import { DeckDetailProps } from '../DeckDetailView';
import { getDeckOptions } from '../navHelper';
import { NavigationProps } from '../types';
import withDimensions, { DimensionsProps } from '../core/withDimensions';
import withPlayerCards, { PlayerCardProps } from '../withPlayerCards';
import { Deck, DecksMap, ParsedDeck } from '../../actions/types';
import { AppState, getAllDecks } from '../../reducers';
import { parseDeck } from '../../lib/parseDeck';

interface DeckHistoryProps {
  id: number;
}

interface ReduxProps {
  decks: DecksMap;
}

type Props = NavigationProps & DimensionsProps & DeckHistoryProps & PlayerCardProps & ReduxProps;

class DeckHistoryView extends React.Component<Props> {

  historicDecks(): ParsedDeck [] {
    const { id, decks, cards } = this.props;
    const decksResult: ParsedDeck[] = [];
    let deck: Deck | undefined = decks[id];
    while (deck) {
      const previousDeck: Deck | undefined = (
        deck.previous_deck ? decks[deck.previous_deck] : undefined
      );
      decksResult.push(
        parseDeck(
          deck,
          deck.slots,
          deck.ignoreDeckLimitSlots,
          cards,
          previousDeck
        )
      );
      deck = previousDeck;
    }
    return reverse(decksResult);
  }

  deckTitle(deck: ParsedDeck): string {
    if (!deck.changes) {
      return t`Original Deck`;
    }
    if (deck.deck.id === this.props.id) {
      if (deck.changes) {
        return t`Latest Deck: ${deck.changes.spentXp} of ${deck.experience} XP`;
      }
      return t`Latest Version ${deck.deck.version}: ${deck.experience} XP`;
    }
    if (deck.changes) {
      return t`Version ${deck.deck.version}: ${deck.changes.spentXp} of ${deck.experience} XP`;
    }
    return t`Version ${deck.deck.version}: ${deck.experience} XP`;
  }

  _onDeckPress = (parsedDeck: ParsedDeck) => {
    const {
      componentId,
    } = this.props;
    Navigation.push<DeckDetailProps>(componentId, {
      component: {
        name: 'Deck',
        passProps: {
          id: parsedDeck.deck.id,
          isPrivate: true,
        },
        options: getDeckOptions(parsedDeck.investigator),
      },
    });
  };

  render() {
    const { componentId, cards, fontScale } = this.props;
    const decks = this.historicDecks();

    return (
      <ScrollView style={styles.wrapper}>
        { map(decks, deck => (
          <DeckProgressComponent
            key={deck.deck.id}
            title={this.deckTitle(deck)}
            onTitlePress={this._onDeckPress}
            fontScale={fontScale}
            componentId={componentId}
            deck={deck.deck}
            parsedDeck={deck}
            cards={cards}
            editable={false}
            xpAdjustment={0}
            isPrivate
          />
        )) }
      </ScrollView>
    );
  }
}


function mapStateToProps(state: AppState): ReduxProps {
  const decks = getAllDecks(state);
  return {
    decks,
  };
}

export default connect<ReduxProps, null, NavigationProps & DeckHistoryProps, AppState>(
  mapStateToProps
)(
  withPlayerCards<ReduxProps & NavigationProps & DeckHistoryProps>(
    withDimensions(DeckHistoryView)
  )
);

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
  },
});
