import React, { useCallback } from 'react';

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

export default function DeckSelector(props: Props) {
  const {
    investigatorRemoved,
    deckRemoved,
    componentId,
    deckIds,
    investigatorIds,
    deckAdded,
    investigatorAdded,
    campaignId,
  } = props;
  const renderDeck = useCallback(
    (
      deckId: number,
      cards: CardsMap,
      investigators: CardsMap
    ) => {
      return (
        <InvestigatorDeckRow
          key={deckId}
          id={deckId}
          investigators={investigators}
          deckRemoved={deckRemoved}
        />
      );
    }, [deckRemoved]);

  const renderInvestigator = useCallback(
    (
      code: string,
      investigators: CardsMap
    ) => {
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
    }, [investigatorRemoved]
  );

  return (
    <DeckList
      renderDeck={renderDeck}
      renderInvestigator={renderInvestigator}
      componentId={componentId}
      campaignId={campaignId}
      deckIds={deckIds}
      investigatorIds={investigatorIds}
      deckAdded={deckAdded}
      investigatorAdded={investigatorAdded}
      otherProps={props}
    />
  );
}
