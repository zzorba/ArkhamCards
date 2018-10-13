import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../actions';
import DeckDelta from './DeckDelta';
import { getDeck } from '../../reducers';

class DeckProgressModule extends React.PureComponent {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    deck: PropTypes.object.isRequired,
    parsedDeck: PropTypes.object.isRequired,
    previousDeck: PropTypes.object,
    fetchPrivateDeck: PropTypes.func.isRequired,
    fetchPublicDeck: PropTypes.func.isRequired,
    isPrivate: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const {
      deck,
      previousDeck,
      fetchPublicDeck,
      fetchPrivateDeck,
      isPrivate,
    } = this.props;
    if (deck.previous_deck && !previousDeck) {
      if (isPrivate) {
        fetchPrivateDeck(deck.previous_deck);
      } else {
        fetchPublicDeck(deck.previous_deck, true);
      }
    }
  }

  render() {
    const {
      componentId,
      deck,
      parsedDeck,
    } = this.props;

    if (!deck.previous_deck && !deck.next_deck) {
      return null;
    }

    // Actually compute the diffs.
    return (
      <DeckDelta
        componentId={componentId}
        parsedDeck={parsedDeck}
      />
    );
  }
}

function mapStateToProps(state, props) {
  if (props.deck && props.deck.previous_deck) {
    return {
      previousDeck: getDeck(state, props.deck.previous_deck),
    };
  }
  return {
    previousDeck: null,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckProgressModule);
