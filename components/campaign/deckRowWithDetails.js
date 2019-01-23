import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import hoistNonReactStatic from 'hoist-non-react-statics';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { showDeckModal } from '../navHelper';
import DeckListRow from '../DeckListRow';
import AppIcon from '../../assets/AppIcon';
import * as Actions from '../../actions';
import { getDeck } from '../../reducers';

function mapStateToProps(state, props) {
  const deck = getDeck(state, props.id);
  const previousDeck = deck && deck.previous_deck && getDeck(state, deck.previous_deck);
  return {
    deck,
    previousDeck,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default function deckRowWithDetails(
  DeckRowDetails,
  DeckRowSubDetails,
  { compact, viewDeckButton },
) {
  class DeckRow extends React.Component {
    static propTypes = {
      componentId: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      deck: PropTypes.object,
      remove: PropTypes.func,
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
        componentId,
        deck,
        investigators,
      } = this.props;
      showDeckModal(componentId, deck, investigators[deck.investigator_code]);
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

    renderSubDetails() {
      const {
        componentId,
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
      if (!deck || !DeckRowSubDetails) {
        return null;
      }
      return (
        <DeckRowSubDetails
          componentId={componentId}
          id={id}
          deck={deck}
          investigator={investigators[deck.investigator_code]}
          cards={cards}
          {...otherProps}
        />
      );
    }

    renderDetails() {
      const {
        componentId,
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
      if (!deck || !DeckRowDetails) {
        return null;
      }
      return (
        <DeckRowDetails
          componentId={componentId}
          id={id}
          deck={deck}
          investigator={investigators[deck.investigator_code]}
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
        remove,
      } = this.props;
      if (!deck) {
        return null;
      }
      return (
        <DeckListRow
          id={id}
          deck={deck}
          cards={cards}
          investigators={investigators}
          onPress={this._onDeckPress}
          investigator={deck ? cards[deck.investigator_code] : null}
          titleButton={remove ? (
            <View style={styles.row}>
              <TouchableOpacity onPress={this._onRemove}>
                <MaterialCommunityIcons name="close" size={32} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={this._onDeckPress}>
              <AppIcon name="deck" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          details={this.renderDetails()}
          subDetails={this.renderSubDetails()}
          compact={compact}
          viewDeckButton={viewDeckButton}
        />
      );
    }
  }
  const result = connect(mapStateToProps, mapDispatchToProps)(DeckRow);

  if (DeckRowDetails) {
    hoistNonReactStatic(result, DeckRowDetails);
  }

  return result;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
