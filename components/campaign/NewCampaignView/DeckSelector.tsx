import React from 'react';

import DeckRow from '../DeckRow';
import DeckList, { DeckListProps } from '../DeckList';
import { CardsMap } from '../../../data/Card';

export default class DeckSelector extends React.Component<DeckListProps> {
  _renderDeck = (
    deckId: number,
    cards: CardsMap,
    investigators: CardsMap
  ) => {
    const {
      componentId,
    } = this.props;
    return (
      <DeckRow
        key={deckId}
        componentId={componentId}
        id={deckId}
        cards={cards}
        investigators={investigators}
        otherProps={this.props}
      />
    );
  };

  render() {
    const {
      componentId,
      deckIds,
      deckAdded,
      campaignId,
    } = this.props;
    return (
      <DeckList
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
