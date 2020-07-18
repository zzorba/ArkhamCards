import React from 'react';
import { flatMap } from 'lodash';
import {
  ScrollView,
} from 'react-native';

import { showCard } from '@components/nav/helper';
import { t } from 'ttag';
import { Slots, WeaknessSet } from '@actions/types';
import Card from '@data/Card';
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import CardSearchResult from '../cardlist/CardSearchResult';

interface OwnProps {
  componentId: string;
  fontScale: number;
  weaknessSet: WeaknessSet;
  updateAssignedCards: (assignedCards: Slots) => void;
}

type Props = OwnProps & PlayerCardProps;

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
      cards,
    } = this.props;
    const card = cards[code];
    const newAssignedCards = {
      ...assignedCards,
      [code]: (card && card.quantity || 1) - count,
    };
    updateAssignedCards(newAssignedCards);
  };

  _cardPressed = (card: Card) => {
    showCard(this.props.componentId, card.code, card, true);
  };

  render() {
    const {
      weaknessSet,
      weaknessCards,
      fontScale,
    } = this.props;
    const packCodes = new Set(weaknessSet.packCodes);
    return (
      <ScrollView>
        { flatMap(weaknessCards, card => {
          if (!packCodes.has(card.pack_code)) {
            return null;
          }
          return (
            <CardSearchResult
              key={card.code}
              fontScale={fontScale}
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

export default withPlayerCards<OwnProps>(
  EditAssignedWeaknessComponent
);
