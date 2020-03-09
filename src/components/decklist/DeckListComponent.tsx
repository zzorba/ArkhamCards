import React, { ReactNode } from 'react';
import { filter, map } from 'lodash';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { t } from 'ttag';

import { Campaign, Deck, DecksMap } from 'actions/types';
import Card from 'data/Card';
import { searchMatchesText } from 'components/core/searchHelpers';
import SearchBox from 'components/core/SearchBox';
import DeckListRow from 'components/decklist/DeckListRow';
import withPlayerCards, { PlayerCardProps } from 'components/core/withPlayerCards';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import { fetchPublicDeck } from 'components/deck/actions';
import { getAllDecks, AppState } from 'reducers';
import typography from 'styles/typography';
import space, { s } from 'styles/space';

interface OwnProps {
  deckIds: number[];
  deckClicked: (deck: Deck, investigator?: Card) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  deckToCampaign?: { [id: number]: Campaign };
  customHeader?: ReactNode;
  customFooter?: ReactNode;
  isEmpty?: boolean;
}

interface ReduxProps {
  decks: DecksMap;
}

interface ReduxActionProps {
  fetchPublicDeck: (id: number, useDeckEndpoint: boolean) => void;
}

type Props = OwnProps &
  ReduxProps &
  ReduxActionProps &
  PlayerCardProps &
  DimensionsProps;

interface State {
  searchTerm: string;
}

interface Item {
  key: string;
  deckId: number;
}

class DeckListComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      searchTerm: '',
    };
  }

  _deckClicked = (deck: Deck, investigator?: Card) => {
    Keyboard.dismiss();
    this.props.deckClicked(deck, investigator);
  };

  _searchChanged = (searchTerm: string) => {
    this.setState({
      searchTerm,
    });
  };

  componentDidMount() {
    const {
      deckIds,
      decks,
      fetchPublicDeck,
    } = this.props;
    deckIds.forEach(deckId => {
      if (!decks[deckId] && deckId > 0) {
        fetchPublicDeck(deckId, false);
      }
    });
  }

  _renderItem = ({ item: { deckId } }: { item: Item }) => {
    const {
      investigators,
      decks,
      cards,
      deckToCampaign,
      fontScale,
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
        onPress={this._deckClicked}
      />
    );
  };

  _renderHeader = () => {
    const {
      customHeader,
    } = this.props;
    return (
      <View style={styles.header}>
        <SearchBox
          value={this.state.searchTerm}
          onChangeText={this._searchChanged}
          placeholder={t`Search decks`}
        />
        { !!customHeader && customHeader }
      </View>
    );
  };

  _renderFooter = () => {
    const {
      isEmpty,
      refreshing,
      customFooter,
    } = this.props;
    const {
      searchTerm,
    } = this.state;
    if (isEmpty && !refreshing) {
      return (
        <View style={styles.footer}>
          <Text style={[styles.emptyStateText, typography.text, space.marginBottomM]}>
            { t`No decks yet.\n\nUse the + button to create a new one.` }
          </Text>
          { customFooter }
        </View>
      );
    }
    if (searchTerm && this.getItems().length === 0) {
      return (
        <View style={[styles.footer, styles.emptyStateText]}>
          <Text style={[typography.text, typography.center, space.marginBottomM]}>
            { t`No matching decks for "${searchTerm}".` }
          </Text>
          { customFooter }
        </View>
      );
    }
    return (
      <View style={styles.footer}>
        { customFooter }
      </View>
    );
  };

  getItems() {
    const {
      deckIds,
      decks,
      investigators,
    } = this.props;

    const {
      searchTerm,
    } = this.state;
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
      onRefresh,
      refreshing,
      decks,
    } = this.props;
    return (
      <FlatList
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        refreshing={refreshing}
        onRefresh={onRefresh}
        style={styles.container}
        data={this.getItems()}
        renderItem={this._renderItem}
        extraData={decks}
        ListHeaderComponent={this._renderHeader}
        ListFooterComponent={this._renderFooter}
      />
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    decks: getAllDecks(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({ fetchPublicDeck }, dispatch);
}

export default connect<ReduxProps, ReduxActionProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(
  withPlayerCards<ReduxProps & ReduxActionProps & OwnProps>(
    withDimensions(DeckListComponent)
  )
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    width: '100%',
    flexDirection: 'column',
  },
  footer: {
    width: '100%',
    paddingTop: s,
    paddingBottom: s,
    marginBottom: 60,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  emptyStateText: {
    marginLeft: s,
    marginRight: s,
  },
});
