import React, { ReactNode } from 'react';
import { filter, flatMap, keys, sortBy } from 'lodash';

import { Slots } from '@actions/types';
import { SortType } from '@actions/types';
import Card from '@data/Card';
import CardToggleRow from './CardToggleRow';
import { showCard } from '@components/nav/helper';
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';

interface OwnProps {
  componentId: string;
  slots: Slots;
  counts: Slots;
  toggleCard?: (code: string, value: boolean) => void;
  updateCounts?: (slots: Slots) => void;
  filterCard?: (card: Card) => boolean;
  header?: ReactNode;
  sort?: SortType;
}

type Props = OwnProps & PlayerCardProps & DimensionsProps;

class CardSelectorComponent extends React.Component<Props> {
  _onChange = (card: Card, count: number) => {
    const {
      counts,
      updateCounts,
      toggleCard,
    } = this.props;
    if (toggleCard) {
       toggleCard(card.code, count > 0);
    } else if (updateCounts) {
      updateCounts({
        ...counts,
        [card.code]: count,
      });
    }
  };

  _onCardPress = (card: Card) => {
    showCard(this.props.componentId, card.code, card, true);
  };

  cards() {
    const {
      slots,
      cards,
      filterCard,
    } = this.props;
    return sortBy(
      filter(
        keys(slots),
        code => {
          const card = cards[code];
          return (
            slots[code] > 0 &&
            !!card &&
            (!filterCard || filterCard(card))
          );
        }
      ),
      code => {
        const card = cards[code];
        return (card && card.name) || '';
      }
    );
  }

  render() {
    const {
      slots,
      cards,
      counts,
      header,
      fontScale,
      toggleCard,
    } = this.props;
    const matchingCards = this.cards();
    if (!matchingCards.length) {
      return null;
    }

    return (
      <>
        { header }
        { flatMap(matchingCards, code => {
          const card = cards[code];
          if (!card) {
            return null;
          }
          return (
            <CardToggleRow
              key={code}
              fontScale={fontScale}
              card={card}
              onPress={this._onCardPress}
              onChange={this._onChange}
              count={counts[code] || 0}
              limit={toggleCard ? 1 : slots[code]}
            />
          );
        }) }
      </>
    );
  }
}

export default withPlayerCards<OwnProps>(
  withDimensions(CardSelectorComponent)
);
