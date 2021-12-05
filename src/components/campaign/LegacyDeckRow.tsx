import React, { useCallback, useContext, useMemo } from 'react';

import { showDeckModal } from '@components/nav/helper';
import LegacyDeckListRow from '../decklist/LegacyDeckListRow';
import { Deck } from '@actions/types';
import Card, { CardsMap } from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import { useInvestigatorCards, usePlayerCards, usePressCallback } from '@components/core/hooks';
import { DeckActions } from '@data/remote/decks';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import LatestDeckT from '@data/interfaces/LatestDeckT';

type RenderDeckDetails = (
  deck: Deck,
  cards: CardsMap,
  investigator: Card,
  previousDeck?: Deck
) => JSX.Element | null;

export interface LegacyDeckRowProps {
  deck: LatestDeckT;
  campaign: MiniCampaignT;
  lang: string;
  renderSubDetails?: RenderDeckDetails;
  renderDetails?: RenderDeckDetails;
  killedOrInsane?: boolean;
  skipRender?: (deck: Deck, investigator: Card) => boolean;
  actions: DeckActions;
}

interface Props extends LegacyDeckRowProps {
  compact?: boolean;
  viewDeckButton?: boolean;
}

export default function LegacyDeckRow({
  deck: { deck, previousDeck, id },
  campaign,
  lang,
  renderSubDetails,
  renderDetails,
  killedOrInsane,
  skipRender,
  compact,
  viewDeckButton,
}: Props) {
  const { colors } = useContext(StyleContext);
  const cards = usePlayerCards(deck.taboo_id);
  const investigators = useInvestigatorCards(deck.taboo_id);
  const investigator = deck && investigators && investigators[deck.investigator_code] || undefined;
  const onDeckPressFunction = useCallback(() => {
    showDeckModal(id, deck, campaign.id, colors, investigator);
  }, [id, deck, campaign, colors, investigator]);
  const onDeckPress = usePressCallback(onDeckPressFunction);
  const subDetails = useMemo(() => {
    if (deck && renderSubDetails) {
      if (!investigator || !cards) {
        return null;
      }
      return renderSubDetails(
        deck,
        cards,
        investigator,
        previousDeck
      );
    }
    return null;
  }, [deck, cards, investigator, previousDeck, renderSubDetails]);
  const details = useMemo(() => {
    if (!deck || !renderDetails) {
      return null;
    }
    if (!investigator || !cards) {
      return null;
    }
    return renderDetails(deck, cards, investigator, previousDeck);
  }, [deck, cards, investigator, previousDeck, renderDetails]);

  if (!deck) {
    return null;
  }
  if (!investigator) {
    return null;
  }
  if (skipRender && skipRender(deck, investigator)) {
    return null;
  }
  return (
    <LegacyDeckListRow
      deck={deck}
      previousDeck={previousDeck}
      lang={lang}
      onPress={onDeckPress}
      investigator={investigator}
      details={details}
      subDetails={subDetails}
      compact={compact}
      viewDeckButton={viewDeckButton}
      killedOrInsane={killedOrInsane}
    />
  );
}