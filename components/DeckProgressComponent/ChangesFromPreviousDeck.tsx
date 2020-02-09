import React from 'react';
import { concat, findIndex, keys, map, sortBy } from 'lodash';

import { t } from 'ttag';
import { ParsedDeck, Slots } from '../../actions/types';
import { showCard, showCardSwipe } from '../navHelper';
import CardSearchResult from '../CardSearchResult';
import CardSectionHeader from '../CardSectionHeader';
import Card, { CardsMap } from '../../data/Card';

interface Props {
  componentId: string;
  fontScale: number;
  cards: CardsMap;
  parsedDeck: ParsedDeck;
  xpAdjustment: number;
  tabooSetId?: number;
  renderFooter: (slots?: Slots) => React.ReactNode;
  onDeckCountChange: (code: string, count: number) => void;
  singleCardView: boolean;
}

export default class ChangesFromPreviousDeck extends React.Component<Props> {
  cards(slots: Slots): Card[] {
    const {
      cards,
    } = this.props;
    if (!keys(slots).length) {
      return [];
    }
    return sortBy(
      sortBy(
        map(keys(slots), code => cards[code]),
        card => card.xp || 0),
      card => card.name
    );
  }

  allCards(): Card[] {
    const {
      parsedDeck: {
        changes,
      },
    } = this.props;
    if (!changes) {
      return [];
    }
    return concat(
      this.cards(changes.upgraded),
      this.cards(changes.added),
      this.cards(changes.removed),
      this.cards(changes.exiled)
    );
  }

  _showCard = (card: Card) => {
    const {
      componentId,
      parsedDeck: {
        investigator,
        deck: {
          slots,
        },
      },
      tabooSetId,
      renderFooter,
      onDeckCountChange,
      singleCardView,
    } = this.props;
    if (singleCardView) {
      showCard(componentId, card.code, card, true);
    } else {
      const allCards = this.allCards();
      showCardSwipe(
        componentId,
        this.allCards(),
        findIndex(allCards, c => c.code === card.code),
        true,
        tabooSetId,
        slots,
        onDeckCountChange,
        investigator,
        renderFooter
      );
    }
  };

  renderSection(slots: Slots, id: string, title: string) {
    const {
      parsedDeck: {
        investigator,
      },
      fontScale,
    } = this.props;
    const cards = this.cards(slots);
    if (!cards.length) {
      return null;
    }

    return (
      <React.Fragment>
        <CardSectionHeader
          investigator={investigator}
          section={{ title }}
          fontScale={fontScale}
        />
        { map(cards, card => (
          <CardSearchResult
            key={`${id}-${card.code}`}
            onPress={this._showCard}
            card={card}
            count={slots[card.code]}
            fontScale={fontScale}
            deltaCountMode
          />
        )) }
      </React.Fragment>
    );
  }

  render() {
    const {
      parsedDeck: {
        investigator,
        changes,
      },
      fontScale,
    } = this.props;
    if (!changes) {
      return null;
    }

    return (
      <React.Fragment>
        <CardSectionHeader
          investigator={investigator}
          section={{ superTitle: t`Changes from previous deck` }}
          fontScale={fontScale}
        />
        { this.renderSection(changes.upgraded, 'upgrade', t`Upgraded cards`) }
        { this.renderSection(changes.added, 'added', t`Added cards`) }
        { this.renderSection(changes.removed, 'removed', t`Removed cards`) }
        { this.renderSection(changes.exiled, 'exiled', t`Exiled cards`) }
      </React.Fragment>
    );
  }
}
