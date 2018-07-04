import React from 'react';
import PropTypes from 'prop-types';
import { flatMap, forEach } from 'lodash';
import {
  ScrollView,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import { BASIC_WEAKNESS_QUERY } from '../../data/query';
import * as Actions from '../../actions';
import CardSearchResult from '../CardSearchResult';

class EditAssignedWeaknessDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    id: PropTypes.number.isRequired,
    set: PropTypes.object,
    cards: PropTypes.object, // Realm array
    cardsMap: PropTypes.object,
    deleteWeaknessSet: PropTypes.func.isRequired,
    editWeaknessSet: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._onCountChange = this.onCountChange.bind(this);
    this._cardPressed = this.cardPressed.bind(this);

    props.navigator.setTitle({
      title: 'Available weaknesses',
    });
  }

  onCountChange(code, count) {
    const {
      set,
      editWeaknessSet,
      cardsMap,
    } = this.props;
    const assignedCards = Object.assign(
      {},
      set.assignedCards,
      { [code]: (cardsMap[code].quantity || 1) - count });
    editWeaknessSet(set.id, set.name, set.packCodes, assignedCards);
  }

  cardPressed(card) {
    this.props.navigator.push({
      screen: 'Card',
      passProps: {
        id: card.code,
        pack_code: card.pack_code,
        showSpoilers: true,
        backButtonTitle: 'Back',
      },
    });
  }

  render() {
    const {
      set,
      cards,
    } = this.props;
    if (!set) {
      return null;
    }
    const packCodes = new Set(set.packCodes);
    return (
      <ScrollView>
        { flatMap(cards, card => {
          if (!packCodes.has(card.pack_code)) {
            return null;
          }
          return (
            <CardSearchResult
              key={card.code}
              card={card}
              count={card.quantity - (set.assignedCards[card.code] || 0)}
              onPress={this._cardPressed}
              limit={card.quantity}
              onDeckCountChange={this._onCountChange}
            />
          );
        })
        }
      </ScrollView>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    set: state.weaknesses.all[props.id],
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectRealm(EditAssignedWeaknessDialog, {
    schemas: ['Card'],
    mapToProps(results) {
      const cards = results.cards
        .filtered(BASIC_WEAKNESS_QUERY)
        .sorted([['name', false]]);
      const cardsMap = {};
      forEach(cards, card => {
        cardsMap[card.code] = card;
      });
      return {
        cards,
        cardsMap,
      };
    },
  })
);
