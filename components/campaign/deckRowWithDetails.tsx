import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import DeckRow from './DeckRow';
import { Deck } from '../../actions/types';
import Card, { CardsMap } from '../../data/Card';

interface OwnProps {
  investigators: CardsMap;
  deckRemoved: (id: number, deck?: Deck, investigator?: Card) => void;
}

interface PassThroughProps {
  componentId: string;
  id: number;
  cards: CardsMap;
}

export interface DeckRowDetailsProps extends PassThroughProps {
  deck: Deck;
  investigator: Card;
  previousDeck?: Deck
}

interface Options {
  compact?: boolean;
  viewDeckButton?: boolean;
}

export default function deckRowWithDetails<P = {}>(
  { compact, viewDeckButton }: Options,
  DeckRowDetails?: React.ComponentType<P & DeckRowDetailsProps>,
  DeckRowSubDetails?: React.ComponentType<P & DeckRowDetailsProps>,
): React.ComponentType<P & OwnProps & PassThroughProps> {
  class DeckRowWrapper extends React.Component<P & PassThroughProps & OwnProps> {
    _renderSubDetails = (
      deck: Deck,
      investigator: Card,
      previousDeck?: Deck
    ) => {
      if (!DeckRowSubDetails) {
        return null;
      }
      return (
        <DeckRowSubDetails
          deck={deck}
          previousDeck={previousDeck}
          investigator={investigator}
          {...this.props}
        />
      );
    }

    _renderDetails =  (
      deck: Deck,
      investigator: Card,
      previousDeck?: Deck
    ) => {
      if (!DeckRowDetails) {
        return null;
      }
      return (
        <DeckRowDetails
          deck={deck}
          previousDeck={previousDeck}
          investigator={investigator}
          {...this.props}
        />
      );
    }

    render() {
      const {
        componentId,
        id,
        cards,
        investigators,
        deckRemoved,
      } = this.props;
      return (
        <DeckRow
          componentId={componentId}
          id={id}
          deckRemoved={deckRemoved}
          cards={cards}
          investigators={investigators}
          compact={compact}
          viewDeckButton={viewDeckButton}
          renderDetails={this._renderDetails}
          renderSubDetails={this._renderSubDetails}
          otherProps={this.props}
        />
      );
    }
  }

  if (DeckRowDetails) {
    hoistNonReactStatic(DeckRowWrapper, DeckRowDetails);
  }

  return DeckRowWrapper;
}
