import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import hoistNonReactStatic from 'hoist-non-react-statics';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import DeckListRow from '../DeckListRow';
import * as Actions from '../../actions';
import { getDeck } from '../../reducers';

function mapStateToProps(state, props) {
  return {
    deck: getDeck(state, props.id),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default function deckRowWithDetails(DeckRowDetails, compact = false, viewDeckButton = true) {
  class DeckRow extends React.Component {
    static propTypes = {
      navigator: PropTypes.object.isRequired,
      id: PropTypes.number.isRequired,
      deck: PropTypes.object,
      remove: PropTypes.func.isRequired,
      fetchPrivateDeck: PropTypes.func.isRequired,
      // From realm
      investigators: PropTypes.object,
      cards: PropTypes.object,
    };

    constructor(props) {
      super(props);

      this._onRemove = this.onRemove.bind(this);
      this._onDeckPress = this.onDeckPress.bind(this);
    }

    onDeckPress() {
      const {
        navigator,
        id,
      } = this.props;
      navigator.showModal({
        screen: 'Deck',
        passProps: {
          id: id,
          isPrivate: true,
          modal: true,
        },
      });
    }

    onRemove() {
      const {
        remove,
        id,
        deck,
        investigators,
      } = this.props;
      remove(id, deck, deck ? investigators[deck.investigator_code] : null);
    }

    componentDidMount() {
      const {
        id,
        deck,
        fetchPrivateDeck,
      } = this.props;
      if (!deck) {
        fetchPrivateDeck(id, false);
      }
    }

    renderDetails() {
      const {
        navigator,
        id,
        deck,
        /* eslint-disable no-unused-vars */
        remove,
        /* eslint-disable no-unused-vars */
        fetchPrivateDeck,
        investigators,
        cards,
        ...otherProps
      } = this.props;
      if (!deck) {
        return null;
      }
      return (
        <DeckRowDetails
          navigator={navigator}
          id={id}
          deck={deck}
          investigators={investigators}
          cards={cards}
          {...otherProps}
        />
      );
    }

    render() {
      const {
        id,
        deck,
        cards,
        investigators,
      } = this.props;
      return (
        <DeckListRow
          id={id}
          deck={deck}
          cards={cards}
          investigators={investigators}
          onPress={this._onDeckPress}
          investigator={deck ? cards[deck.investigator_code] : null}
          titleButton={
            <TouchableOpacity onPress={this._onRemove}>
              <MaterialCommunityIcons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          }
          details={this.renderDetails()}
          compact={compact}
          viewDeckButton={viewDeckButton}
        />
      );
    }
  }
  const result = connect(mapStateToProps, mapDispatchToProps)(DeckRow);

  hoistNonReactStatic(result, DeckRowDetails);

  return result;
}
