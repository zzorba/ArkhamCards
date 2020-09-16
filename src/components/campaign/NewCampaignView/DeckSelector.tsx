import React from 'react';

import InvestigatorRow from '@components/core/InvestigatorRow';
import InvestigatorDeckRow from '../InvestigatorDeckRow';
import DeckList, { DeckListProps } from '../DeckList';
import { Deck } from '@actions/types';
import Card, { CardsMap } from '@data/Card';

interface Props extends DeckListProps {
  deckRemoved?: (
    id: number,
    deck?: Deck,
    investigator?: Card
  ) => void;

  investigatorRemoved?: (
    investigator: Card
  ) => void;
}

export default class DeckSelector extends React.Component<Props> {
  _renderDeck = (
    deckId: number,
    cards: CardsMap,
    investigators: CardsMap
  ) => {
    const {
      deckRemoved,
    } = this.props;
    return (
      <InvestigatorDeckRow
        key={deckId}
        id={deckId}
        investigators={investigators}
        deckRemoved={deckRemoved}
      />
    );
  };

  _renderInvestigator = (
    code: string,
    investigators: CardsMap
  ) => {
    const {
      investigatorRemoved,
    } = this.props;
    const investigator = investigators[code];
    if (!investigator) {
      return null;
    }
    return (
      <InvestigatorRow
        key={code}
        investigator={investigator}
        onRemove={investigatorRemoved}
      />
    );
  };

  render() {
    const {
      componentId,
      deckIds,
      investigatorIds,
      deckAdded,
      investigatorAdded,
      campaignId,
    } = this.props;
    return (
      <DeckList
        renderDeck={this._renderDeck}
        renderInvestigator={this._renderInvestigator}
        componentId={componentId}
        campaignId={campaignId}
        deckIds={deckIds}
        investigatorIds={investigatorIds}
        deckAdded={deckAdded}
        investigatorAdded={investigatorAdded}
        otherProps={this.props}
      />
    );
  }
}
