import React from 'react';
import { flatMap } from 'lodash';
import {
  ScrollView,
} from 'react-native';

import { showCard } from '../navHelper';
import { t } from 'ttag';
import { Slots, WeaknessSet } from '../../actions/types';
import Card from '../../data/Card';
import withWeaknessCards, { WeaknessCardProps } from './withWeaknessCards';
import CardSearchResult from '../CardSearchResult';

interface OwnProps {
  componentId: string;
  weaknessSet: WeaknessSet;
  updateAssignedCards: (assignedCards: Slots) => void;
}

type Props = OwnProps & WeaknessCardProps;

class EditAssignedWeaknessComponent extends React.Component<Props> {
  static get options() {
    return {
      topBar: {
        title: {
          text: t`Available weaknesses`,
        },
      },
    };
  }

  _onCountChange = (code: string, count: number) => {
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
  };

  _cardPressed = (card: Card) => {
    showCard(this.props.componentId, card.code, card, true);
  };

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
              count={(card.quantity || 0) - (weaknessSet.assignedCards[card.code] || 0)}
              onPress={this._cardPressed}
              limit={(card.quantity || 0)}
              onDeckCountChange={this._onCountChange}
              showZeroCount
            />
          );
        }) }
      </ScrollView>
    );
  }
}

export default withWeaknessCards<OwnProps>(
  EditAssignedWeaknessComponent
);
