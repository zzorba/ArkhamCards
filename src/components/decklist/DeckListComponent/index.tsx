import React, { ReactNode } from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { t } from 'ttag';

import DeckList from './DeckList';
import { Campaign, Deck, DecksMap } from 'actions/types';
import Card from '@data/Card';
import CollapsibleSearchBox from '@components/core/CollapsibleSearchBox';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import { fetchPublicDeck } from '@components/deck/actions';
import { getAllDecks, AppState } from '@reducers';
import typography from '@styles/typography';
import space, { s } from '@styles/space';

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
  DimensionsProps;

interface State {
  searchTerm: string;
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
  _renderHeader = () => {
    const {
      customHeader,
    } = this.props;
    return (
      <View style={styles.header}>
        { !!customHeader && customHeader }
      </View>
    );
  };

  _renderFooter = (empty: boolean) => {
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
          <View style={styles.footerText}>
            <Text style={[styles.emptyStateText, typography.text, space.marginBottomM]}>
              { t`No decks yet.\n\nUse the + button to create a new one.` }
            </Text>
          </View>
          { customFooter }
        </View>
      );
    }
    if (searchTerm && empty) {
      return (
        <View style={[styles.footer, styles.emptyStateText]}>
          <View style={styles.footerText}>
            <Text style={[typography.text, typography.center, space.marginBottomM]}>
              { t`No matching decks for "${searchTerm}".` }
            </Text>
          </View>
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

  render() {
    const {
      onRefresh,
      refreshing,
      decks,
      deckIds,
      deckToCampaign,
      fontScale,
    } = this.props;
    const { searchTerm } = this.state;
    return (
      <CollapsibleSearchBox
        searchTerm={searchTerm}
        onSearchChange={this._searchChanged}
        prompt={t`Search decks`}
      >
        { onScroll => (
          <DeckList
            deckIds={deckIds}
            header={this._renderHeader()}
            footer={this._renderFooter}
            searchTerm={searchTerm}
            deckToCampaign={deckToCampaign}
            fontScale={fontScale}
            onRefresh={onRefresh}
            refreshing={refreshing}
            decks={decks}
            onScroll={onScroll}
            deckClicked={this._deckClicked}
          />
        ) }
      </CollapsibleSearchBox>
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
  withDimensions(DeckListComponent)
);

const styles = StyleSheet.create({
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
  footerText: {
    padding: s,
  },
  emptyStateText: {
    marginLeft: s,
    marginRight: s,
  },
});
