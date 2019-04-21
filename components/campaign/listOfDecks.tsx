import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import DeckList, { DeckListProps } from './DeckList';
import { Deck } from '../../actions/types';
import Card, { CardsMap } from '../../data/Card';

interface PassThroughProps {
  componentId: string;
  deckRemoved?: (id: number, deck?: Deck, investigator?: Card) => void;
}

export interface DeckProps extends PassThroughProps {
  id: number;
  cards: CardsMap;
  investigators: CardsMap;
}

export default function listOfDecks<P = {}>(
  DeckComponent: React.ComponentType<P & DeckProps>
) {
  class DeckListerComponent extends React.Component<P & PassThroughProps & DeckListProps> {
    _renderDeck = (
      deckId: number,
      cards: CardsMap,
      investigators: CardsMap
    ) => {
      return (
        <DeckComponent
          key={deckId}
          id={deckId}
          cards={cards}
          investigators={investigators}
          {...this.props}
        />
      );
    }

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

  hoistNonReactStatic(DeckListerComponent, DeckComponent);

  return DeckListerComponent;
}
