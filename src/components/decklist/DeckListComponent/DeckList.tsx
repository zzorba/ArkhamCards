import React from 'react';
import { filter, map } from 'lodash';
import {
  FlatList,
  StyleSheet,
} from 'react-native';

import { Campaign, Deck, DecksMap } from 'actions/types';
import { searchMatchesText } from '@components/core/searchHelpers';
import DeckListRow from '@components/decklist/DeckListRow';
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import Card from '@data/Card';
import COLORS from '@styles/colors';

interface OwnProps {
  deckIds: number[];
  header?: React.ReactElement;
  footer: (empty: boolean) => React.ReactElement;
  searchTerm: string;
  deckToCampaign?: { [id: number]: Campaign };
  fontScale: number;
  onRefresh?: () => void;
  refreshing?: boolean;
  decks: DecksMap;
  onScroll: (...args: any[]) => void;
  deckClicked: (deck: Deck, investigator?: Card) => void;
}

type Props = OwnProps & PlayerCardProps;

interface Item {
  key: string;
  deckId: number;
}

class DeckList extends React.Component<Props> {
  _renderItem = ({ item: { deckId } }: { item: Item }) => {
    const {
      investigators,
      decks,
      cards,
      deckToCampaign,
      fontScale,
      deckClicked,
    } = this.props;

    const deck = decks[deckId];
    if (!deck) {
      return null;
    }
    return (
      <DeckListRow
        key={deckId}
        fontScale={fontScale}
        deck={deck}
        previousDeck={deck.previous_deck ? decks[deck.previous_deck] : undefined}
        cards={cards}
        deckToCampaign={deckToCampaign}
        investigator={deck ? investigators[deck.investigator_code] : undefined}
        onPress={deckClicked}
      />
    );
  };

  getItems() {
    const {
      deckIds,
      decks,
      investigators,
      searchTerm,
    } = this.props;

    return map(
      filter(deckIds, deckId => {
        const deck = decks[deckId];
        const investigator = deck && investigators[deck.investigator_code];
        if (!deck || !investigator) {
          return true;
        }
        return searchMatchesText(searchTerm, [deck.name, investigator.name]);
      }), deckId => {
        return {
          key: `${deckId}`,
          deckId,
        };
      });
  }

  render() {
    const {
      onScroll,
      onRefresh,
      refreshing,
      decks,
      header,
      footer,
    } = this.props;
    const items = this.getItems();
    return (
      <FlatList
        onScroll={onScroll}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        refreshing={refreshing}
        onRefresh={onRefresh}
        style={styles.container}
        data={items}
        renderItem={this._renderItem}
        extraData={decks}
        ListHeaderComponent={header}
        ListFooterComponent={footer(items.length === 0)}
      />
    );
  }
}

export default withPlayerCards(DeckList);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});