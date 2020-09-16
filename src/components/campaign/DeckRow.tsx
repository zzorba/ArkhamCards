import React, { ReactNode } from 'react';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import { showDeckModal } from '@components/nav/helper';
import DeckListRow from '../decklist/DeckListRow';
import { Deck } from '@actions/types';
import Card, { CardsMap } from '@data/Card';
import { fetchPrivateDeck } from '@components/deck/actions';
import { getDeck, AppState } from '@reducers';

type RenderDeckDetails = (
  deck: Deck,
  cards: CardsMap,
  investigator: Card,
  previousDeck?: Deck
) => ReactNode;

export interface DeckRowProps {
  componentId: string;
  id: number;
  deckRemoved?: (id: number, deck?: Deck, investigator?: Card) => void;
  investigators: CardsMap;
  cards: CardsMap;
  renderSubDetails?: RenderDeckDetails;
  renderDetails?: RenderDeckDetails;
  killedOrInsane?: boolean;
  skipRender?: (deck: Deck, investigator: Card) => boolean;
}

interface OwnProps extends DeckRowProps {
  compact?: boolean;
  viewDeckButton?: boolean;
  otherProps?: any;
}

interface ReduxProps {
  theDeck?: Deck;
  thePreviousDeck?: Deck;
}

interface ReduxActionProps {
  fetchPrivateDeck: (deckId: number) => void;
}

type Props =
  OwnProps &
  ReduxProps &
  ReduxActionProps;

class DeckRow extends React.Component<Props> {
  _onDeckPress = () => {
    const {
      componentId,
      theDeck,
      investigators,
    } = this.props;
    if (theDeck) {
      showDeckModal(componentId, theDeck, investigators[theDeck.investigator_code]);
    }
  };

  _onRemove = () => {
    const {
      deckRemoved,
      id,
      theDeck,
      investigators,
    } = this.props;
    deckRemoved && deckRemoved(id, theDeck, theDeck ? investigators[theDeck.investigator_code] : undefined);
  };

  componentDidMount() {
    const {
      id,
      theDeck,
      fetchPrivateDeck,
    } = this.props;
    if (!theDeck) {
      fetchPrivateDeck(id);
    }
  }

  renderSubDetails() {
    const {
      theDeck,
      cards,
      thePreviousDeck,
      investigators,
      renderSubDetails,
    } = this.props;
    if (theDeck && renderSubDetails) {
      const card = investigators[theDeck.investigator_code];
      if (!card) {
        return null;
      }
      return renderSubDetails(
        theDeck,
        cards,
        card,
        thePreviousDeck
      );
    }
    return null;
  }

  renderDetails() {
    const {
      theDeck,
      cards,
      thePreviousDeck,
      investigators,
      renderDetails,
    } = this.props;
    if (!theDeck || !renderDetails) {
      return null;
    }
    const card = investigators[theDeck.investigator_code];
    if (!card) {
      return null;
    }
    return renderDetails(
      theDeck,
      cards,
      card,
      thePreviousDeck
    );
  }

  render() {
    const {
      theDeck,
      thePreviousDeck,
      cards,
      compact,
      viewDeckButton,
      killedOrInsane,
      skipRender,
    } = this.props;
    if (!theDeck) {
      return null;
    }
    const investigator = cards[theDeck.investigator_code];
    if (!investigator) {
      return null;
    }
    if (skipRender && skipRender(theDeck, investigator)) {
      return null;
    }
    return (
      <DeckListRow
        deck={theDeck}
        previousDeck={thePreviousDeck}
        cards={cards}
        onPress={this._onDeckPress}
        investigator={investigator}
        details={this.renderDetails()}
        subDetails={this.renderSubDetails()}
        compact={compact}
        viewDeckButton={viewDeckButton}
        killedOrInsane={killedOrInsane}
      />
    );
  }
}

function mapStateToProps(state: AppState, props: OwnProps): ReduxProps {
  const deck = getDeck(state, props.id);
  const previousDeck = deck &&
    deck.previous_deck &&
    getDeck(state, deck.previous_deck);
  return {
    theDeck: deck || undefined,
    thePreviousDeck: previousDeck || undefined,
  };
}

function mapDispatchToProps(
  dispatch: Dispatch<Action>
): ReduxActionProps {
  return bindActionCreators({ fetchPrivateDeck }, dispatch);
}

export default connect<ReduxProps, ReduxActionProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(DeckRow);
