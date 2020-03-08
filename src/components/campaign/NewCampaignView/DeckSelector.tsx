import React from 'react';

import DeckRow from '../DeckRow';
import DeckList, { DeckListProps } from '../DeckList';
import { Deck } from 'actions/types';
import Card, { CardsMap } from 'data/Card';

interface Props extends DeckListProps {
  deckRemoved?: (id: number, deck?: Deck, investigator?: Card) => void;
}

export default class DeckSelector extends React.Component<Props> {
  _renderDeck = (
    deckId: number,
    cards: CardsMap,
    investigators: CardsMap
  ) => {
    const {
      componentId,
      fontScale,
      deckRemoved,
    } = this.props;
    return (
      <DeckRow
        key={deckId}
        fontScale={fontScale}
        componentId={componentId}
        id={deckId}
        cards={cards}
        investigators={investigators}
        otherProps={this.props}
        deckRemoved={deckRemoved}
      />
    );
  };

  render() {
    const {
      componentId,
      deckIds,
      deckAdded,
      campaignId,
      fontScale,
    } = this.props;
    return (
      <DeckList
        fontScale={fontScale}
        renderDeck={this._renderDeck}
        componentId={componentId}
        campaignId={campaignId}
        deckIds={deckIds}
        deckAdded={deckAdded}
        otherProps={this.props}
      />
    );
  }
}
