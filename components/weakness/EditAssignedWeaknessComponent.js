import React from 'react';
import PropTypes from 'prop-types';
import { flatMap } from 'lodash';
import {
  ScrollView,
} from 'react-native';

import { showCard } from '../navHelper';
import L from '../../app/i18n';
import withWeaknessCards from './withWeaknessCards';
import CardSearchResult from '../CardSearchResult';

class EditAssignedWeaknessComponent extends React.Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: L('Available weaknesses'),
        },
      },
    };
  }

  static propTypes = {
    componentId: PropTypes.string.isRequired,
    weaknessSet: PropTypes.object,
    updateAssignedCards: PropTypes.func.isRequired,
    // From realm.
    cards: PropTypes.object, // Realm array
    cardsMap: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._onCountChange = this.onCountChange.bind(this);
    this._cardPressed = this.cardPressed.bind(this);
  }

  onCountChange(code, count) {
    const {
      weaknessSet: {
        assignedCards,
      },
      updateAssignedCards,
      cardsMap,
    } = this.props;
    const newAssignedCards = Object.assign(
      {},
      assignedCards,
      { [code]: (cardsMap[code].quantity || 1) - count });
    updateAssignedCards(newAssignedCards);
  }

  cardPressed(card) {
    showCard(this.props.componentId, card.code, card, true);
  }

  render() {
    const {
      weaknessSet,
      cards,
    } = this.props;
    const packCodes = new Set(weaknessSet.packCodes);
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
              count={card.quantity - (weaknessSet.assignedCards[card.code] || 0)}
              onPress={this._cardPressed}
              limit={card.quantity}
              onDeckCountChange={this._onCountChange}
              showZeroCount
            />
          );
        }) }
      </ScrollView>
    );
  }
}

export default withWeaknessCards(EditAssignedWeaknessComponent);
