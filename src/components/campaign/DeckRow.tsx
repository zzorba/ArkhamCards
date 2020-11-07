import React, { useCallback, useContext, useMemo } from 'react';

import { showDeckModal } from '@components/nav/helper';
import DeckListRow from '../decklist/DeckListRow';
import { Deck } from '@actions/types';
import Card, { CardsMap } from '@data/Card';
import StyleContext from '@styles/StyleContext';
import { useDeck, useInvestigatorCards, usePlayerCards } from '@components/core/hooks';

type RenderDeckDetails = (
  deck: Deck,
  cards: CardsMap,
  investigator: Card,
  previousDeck?: Deck
) => React.ReactNode | null;

export interface DeckRowProps {
  componentId: string;
  id: number;
  lang: string;
  renderSubDetails?: RenderDeckDetails;
  renderDetails?: RenderDeckDetails;
  killedOrInsane?: boolean;
  skipRender?: (deck: Deck, investigator: Card) => boolean;
}

interface Props extends DeckRowProps {
  compact?: boolean;
  viewDeckButton?: boolean;
}

export default function DeckRow({
  componentId,
  id,
  lang,
  renderSubDetails,
  renderDetails,
  killedOrInsane,
  skipRender,
  compact,
  viewDeckButton,
}: Props) {
  const { colors } = useContext(StyleContext);
  const [theDeck, thePreviousDeck] = useDeck(id, { fetchIfMissing: true });
  const cards = usePlayerCards(theDeck?.taboo_id);
  const investigators = useInvestigatorCards(theDeck?.taboo_id);
  const investigator = theDeck && investigators && investigators[theDeck.investigator_code] || undefined;
  const onDeckPress = useCallback(() => {
    if (theDeck) {
      showDeckModal(componentId, theDeck, colors, investigator);
    }
  }, [componentId, theDeck, colors, investigator]);
  const subDetails = useMemo(() => {
    if (theDeck && renderSubDetails) {
      if (!investigator || !cards) {
        return null;
      }
      return renderSubDetails(
        theDeck,
        cards,
        investigator,
        thePreviousDeck
      );
    }
    return null;
  }, [theDeck, cards, investigator, thePreviousDeck, renderSubDetails]);
  const details = useMemo(() => {
    if (!theDeck || !renderDetails) {
      return null;
    }
    if (!investigator || !cards) {
      return null;
    }
    return renderDetails(theDeck, cards, investigator, thePreviousDeck);
  }, [theDeck, cards, investigator, thePreviousDeck, renderDetails]);

  if (!theDeck) {
    return null;
  }
  if (!investigator) {
    return null;
  }
  if (skipRender && skipRender(theDeck, investigator)) {
    return null;
  }
  return (
    <DeckListRow
      deck={theDeck}
      lang={lang}
      previousDeck={thePreviousDeck}
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