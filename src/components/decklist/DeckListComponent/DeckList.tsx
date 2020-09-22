import React from 'react';
import { filter, isUndefined, map } from 'lodash';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
} from 'react-native';

import { Campaign, Deck, DecksMap } from '@actions/types';
import { searchMatchesText } from '@components/core/searchHelpers';
import DeckListRow from '@components/decklist/DeckListRow';
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import Card from '@data/Card';
import { SEARCH_BAR_HEIGHT } from '@components/core/SearchBox';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

interface OwnProps {
  deckIds: number[];
  header?: React.ReactElement;
  footer: (empty: boolean) => React.ReactElement;
  searchTerm: string;
  deckToCampaign?: { [id: number]: Campaign };
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
  static contextType = StyleContext;
  context!: StyleContextType;

  _renderItem = ({ item: { deckId } }: { item: Item }) => {
    const {
      investigators,
      decks,
      cards,
      deckToCampaign,
      deckClicked,
    } = this.props;

    const deck = decks[deckId];
    if (!deck) {
      return null;
    }
    return (
      <DeckListRow
        key={deckId}
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
    const { backgroundStyle, colors } = this.context;
    const items = this.getItems();
    return (
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            tintColor={colors.lightText}
            progressViewOffset={SEARCH_BAR_HEIGHT}
          />
        }
        contentInset={Platform.OS === 'ios' ? { top: SEARCH_BAR_HEIGHT } : undefined}
        contentOffset={Platform.OS === 'ios' ? { x: 0, y: -SEARCH_BAR_HEIGHT } : undefined}
        onScroll={onScroll}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        //refreshing={refreshing}
        //onRefresh={onRefresh}
        style={[styles.container, backgroundStyle]}
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
  },
});