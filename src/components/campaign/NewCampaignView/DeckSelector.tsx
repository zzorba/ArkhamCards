import React, { useCallback } from 'react';

import InvestigatorRow from '@components/core/InvestigatorRow';
import InvestigatorDeckRow from '../InvestigatorDeckRow';
import CampaignDeckList, { CampaignDeckListProps } from '../CampaignDeckList';
import { Deck } from '@actions/types';
import Card from '@data/Card';
import { useInvestigatorCards } from '@components/core/hooks';

interface Props extends CampaignDeckListProps {
  deckRemoved?: (
    id: number,
    deck?: Deck,
    investigator?: Card
  ) => void;

  investigatorRemoved?: (
    investigator: Card
  ) => void;
}

export default function DeckSelector({
  investigatorRemoved,
  deckRemoved,
  componentId,
  deckIds,
  investigatorIds,
  deckAdded,
  investigatorAdded,
  campaignId,
}: Props) {
  const investigators = useInvestigatorCards();
  const renderDeck = useCallback((deckId: number) => {
    return (
      <InvestigatorDeckRow
        key={deckId}
        id={deckId}
        deckRemoved={deckRemoved}
      />
    );
  }, [deckRemoved]);

  const renderInvestigator = useCallback((code: string) => {
    const investigator = investigators && investigators[code];
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
  }, [investigatorRemoved, investigators]);

  return (
    <CampaignDeckList
      renderDeck={renderDeck}
      renderInvestigator={renderInvestigator}
      componentId={componentId}
      campaignId={campaignId}
      deckIds={deckIds}
      investigatorIds={investigatorIds}
      deckAdded={deckAdded}
      investigatorAdded={investigatorAdded}
    />
  );
}
