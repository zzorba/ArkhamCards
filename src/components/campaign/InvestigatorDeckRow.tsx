import React from 'react';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import InvestigatorRow from '@components/core/InvestigatorRow';
import { Deck } from '@actions/types';
import Card, { CardsMap } from '@data/Card';
import { fetchPrivateDeck } from '@components/deck/actions';
import { getDeck, AppState } from '@reducers';

interface OwnProps {
  id: number;
  investigators: CardsMap;
  deckRemoved?: (
    id: number,
    deck?: Deck,
    investigator?: Card
  ) => void;
}

interface ReduxProps {
  theDeck?: Deck;
  thePreviousDeck?: Deck;
}

interface ReduxActionProps {
  fetchPrivateDeck: (deckId: number) => void;
}

type Props = OwnProps & ReduxProps & ReduxActionProps;

class InvestigatorDeckRow extends React.Component<Props> {
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

  render() {
    const {
      theDeck,
      investigators,
      deckRemoved,
    } = this.props;
    if (!theDeck) {
      return null;
    }
    const investigator = investigators[theDeck.investigator_code];
    if (!investigator) {
      return null;
    }
    return (
      <InvestigatorRow
        investigator={investigator}
        onRemove={deckRemoved ? this._onRemove : undefined}
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
)(InvestigatorDeckRow);
